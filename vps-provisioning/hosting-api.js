#!/usr/bin/env node

/**
 * API Backend para procesar pedidos de hosting desde lanzawebar.com
 * Se conecta con MercadoPago y ejecuta provisioning automático
 */

const express = require('express');
const cors = require('cors');
const { LanzaWebARProvisioner } = require('./lanzawebar-provisioner');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de MercadoPago
const MERCADOPAGO_CONFIG = {
    access_token: 'TU_ACCESS_TOKEN_DE_MERCADOPAGO', // Configurar
    public_key: 'TU_PUBLIC_KEY_DE_MERCADOPAGO',    // Configurar
    webhook_secret: 'TU_WEBHOOK_SECRET'             // Configurar
};

class HostingOrderProcessor {
    constructor() {
        this.provisioner = new LanzaWebARProvisioner();
        this.orders = new Map(); // En producción usar base de datos real
    }

    /**
     * Procesa una nueva orden de hosting
     */
    async processNewOrder(orderData) {
        const orderId = this.generateOrderId();
        
        const order = {
            id: orderId,
            customer: orderData.customer,
            plan: orderData.plan,
            status: 'pending_payment',
            created_at: new Date().toISOString(),
            amount: orderData.plan.price,
            currency: 'ARS'
        };

        // Guardar orden
        this.orders.set(orderId, order);
        this.saveOrderToFile(order);

        // Crear preferencia de pago en MercadoPago
        const paymentPreference = await this.createPaymentPreference(order);
        
        order.payment_id = paymentPreference.id;
        order.payment_url = paymentPreference.init_point;

        return order;
    }

    /**
     * Crea preferencia de pago en MercadoPago
     */
    async createPaymentPreference(order) {
        // En un entorno real, aquí usarías la SDK de MercadoPago
        // Por ahora simulamos la respuesta
        
        console.log('🔄 Creando preferencia de pago para orden:', order.id);
        
        const preference = {
            id: `MP_PREF_${order.id}`,
            init_point: `https://checkout.mercadopago.com.ar/preferences/v1/MP_PREF_${order.id}`,
            items: [
                {
                    title: order.plan.name,
                    unit_price: order.plan.price,
                    quantity: 1,
                    currency_id: 'ARS'
                }
            ],
            back_urls: {
                success: 'https://lanzawebar.com/payment/success',
                failure: 'https://lanzawebar.com/payment/failure',
                pending: 'https://lanzawebar.com/payment/pending'
            },
            auto_return: 'approved',
            external_reference: order.id,
            notification_url: 'https://lanzawebar.com/api/webhook/mercadopago'
        };

        return preference;
    }

    /**
     * Procesa webhook de MercadoPago cuando se confirma el pago
     */
    async processPaymentWebhook(paymentData) {
        console.log('💰 Webhook de pago recibido:', paymentData);

        const orderId = paymentData.external_reference;
        const order = this.orders.get(orderId);

        if (!order) {
            throw new Error(`Orden ${orderId} no encontrada`);
        }

        if (paymentData.status === 'approved') {
            console.log('✅ Pago aprobado para orden:', orderId);
            
            // Actualizar estado de la orden
            order.status = 'paid';
            order.payment_confirmed_at = new Date().toISOString();
            
            // ¡EJECUTAR PROVISIONING AUTOMÁTICO!
            await this.executeAutomaticProvisioning(order);
            
        } else {
            console.log('❌ Pago rechazado para orden:', orderId);
            order.status = 'payment_failed';
        }

        this.saveOrderToFile(order);
        return order;
    }

    /**
     * Ejecuta el provisioning automático después del pago confirmado
     */
    async executeAutomaticProvisioning(order) {
        console.log('🚀 Iniciando provisioning automático para orden:', order.id);

        try {
            order.status = 'provisioning';
            
            const clientData = {
                name: order.customer.name,
                email: order.customer.email,
                domain: order.customer.domain,
                projectType: order.customer.projectType,
                notes: order.customer.notes || `Orden automática #${order.id}`
            };

            // Ejecutar provisioning completo
            const result = await this.provisioner.provisionComplete(clientData);

            if (result.success) {
                order.status = 'completed';
                order.hosting_account = result.account;
                order.completed_at = new Date().toISOString();
                
                console.log('✅ Provisioning completado para orden:', order.id);
                console.log('🌐 Sitio disponible en:', `https://${order.customer.domain}`);
                
                // Enviar email de confirmación (ya lo hace el provisioner)
                
            } else {
                order.status = 'provisioning_failed';
                order.error = result.error;
                
                console.error('❌ Provisioning falló para orden:', order.id);
                
                // Aquí podrías enviar email de error o crear ticket de soporte
                await this.notifyProvisioningError(order);
            }

        } catch (error) {
            order.status = 'provisioning_failed';
            order.error = error.message;
            console.error('💥 Error en provisioning automático:', error);
        }

        this.saveOrderToFile(order);
    }

    /**
     * Notifica errores de provisioning
     */
    async notifyProvisioningError(order) {
        console.log('📧 Notificando error de provisioning...');
        
        // Aquí enviarías email al admin y al cliente
        // También podrías crear un ticket de soporte automático
        
        const errorReport = {
            order_id: order.id,
            customer: order.customer,
            error: order.error,
            timestamp: new Date().toISOString()
        };
        
        // Guardar reporte de error
        const errorsDir = './provisioning-errors';
        if (!fs.existsSync(errorsDir)) {
            fs.mkdirSync(errorsDir, { recursive: true });
        }
        
        fs.writeFileSync(
            path.join(errorsDir, `error-${order.id}.json`),
            JSON.stringify(errorReport, null, 2)
        );
    }

    /**
     * Genera ID único para la orden
     */
    generateOrderId() {
        return 'LW' + Date.now().toString().slice(-8) + Math.random().toString(36).substring(2, 6).toUpperCase();
    }

    /**
     * Guarda orden en archivo
     */
    saveOrderToFile(order) {
        const ordersDir = './orders';
        if (!fs.existsSync(ordersDir)) {
            fs.mkdirSync(ordersDir, { recursive: true });
        }
        
        fs.writeFileSync(
            path.join(ordersDir, `${order.id}.json`),
            JSON.stringify(order, null, 2)
        );
    }
}

const orderProcessor = new HostingOrderProcessor();

// RUTAS DE LA API

/**
 * POST /api/hosting/order
 * Crear nueva orden de hosting
 */
app.post('/api/hosting/order', async (req, res) => {
    try {
        console.log('📝 Nueva orden de hosting recibida:', req.body);
        
        const order = await orderProcessor.processNewOrder(req.body);
        
        res.json({
            success: true,
            order_id: order.id,
            payment_url: order.payment_url,
            amount: order.amount
        });
        
    } catch (error) {
        console.error('❌ Error procesando orden:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/webhook/mercadopago
 * Webhook de MercadoPago
 */
app.post('/api/webhook/mercadopago', async (req, res) => {
    try {
        console.log('🔔 Webhook MercadoPago recibido');
        
        // Validar webhook (en producción verificar firma)
        const paymentData = req.body;
        
        await orderProcessor.processPaymentWebhook(paymentData);
        
        res.status(200).send('OK');
        
    } catch (error) {
        console.error('❌ Error en webhook:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/orders/:orderId
 * Consultar estado de una orden
 */
app.get('/api/orders/:orderId', (req, res) => {
    try {
        const order = orderProcessor.orders.get(req.params.orderId);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Orden no encontrada'
            });
        }
        
        res.json({
            success: true,
            order: order
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/orders
 * Listar todas las órdenes (para admin)
 */
app.get('/api/orders', (req, res) => {
    try {
        const orders = Array.from(orderProcessor.orders.values());
        
        res.json({
            success: true,
            orders: orders,
            total: orders.length
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/hosting/manual-provision
 * Provisioning manual (para testing)
 */
app.post('/api/hosting/manual-provision', async (req, res) => {
    try {
        console.log('🔧 Provisioning manual solicitado');
        
        const result = await orderProcessor.provisioner.provisionComplete(req.body);
        
        res.json({
            success: result.success,
            message: result.message,
            account: result.account
        });
        
    } catch (error) {
        console.error('❌ Error en provisioning manual:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Ruta de salud del sistema
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        orders_in_memory: orderProcessor.orders.size
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`
🚀 === LanzaWebAR Hosting API ===
📡 Servidor ejecutándose en: http://localhost:${PORT}
🎯 Endpoints disponibles:
   • POST /api/hosting/order       - Crear orden
   • POST /api/webhook/mercadopago - Webhook pagos
   • GET  /api/orders              - Listar órdenes
   • GET  /api/health              - Estado del sistema

💡 Para testing:
   curl -X POST http://localhost:${PORT}/api/hosting/manual-provision \\
   -H "Content-Type: application/json" \\
   -d '{"name":"Test","email":"test@test.com","domain":"test.com","projectType":"basic"}'

=======================================
    `);
});

module.exports = { HostingOrderProcessor, app };