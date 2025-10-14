/**
 * JavaScript para integrar lanzawebar.com con el sistema de hosting
 * Conecta formularios web con la API backend y MercadoPago
 */

// Configuración
const HOSTING_API_BASE = 'http://localhost:3001'; // En producción usar tu dominio
const DEBUG = true; // Cambiar a false en producción

class LanzaWebHostingIntegration {
    constructor() {
        this.currentOrder = null;
        this.isProcessing = false;
        
        // Inicializar cuando el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    /**
     * Inicializa la integración
     */
    init() {
        this.log('🚀 LanzaWebAR Hosting Integration inicializada');
        
        // Detectar si estamos en página de resultado de pago
        this.handlePaymentResult();
        
        // Escuchar eventos de formularios
        this.setupEventListeners();
    }

    /**
     * Configura event listeners
     */
    setupEventListeners() {
        // Interceptar submit del formulario de hosting
        const hostingForm = document.getElementById('hostingForm');
        if (hostingForm) {
            hostingForm.addEventListener('submit', (e) => this.handleHostingFormSubmit(e));
        }

        // Botones de planes
        document.querySelectorAll('[data-plan]').forEach(button => {
            button.addEventListener('click', (e) => this.handlePlanSelection(e));
        });
    }

    /**
     * Maneja la selección de un plan
     */
    handlePlanSelection(event) {
        const button = event.target;
        const planType = button.getAttribute('data-plan');
        const planPrice = parseInt(button.getAttribute('data-price'));
        const planName = button.getAttribute('data-name');

        this.openHostingModal(planType, planPrice, planName);
    }

    /**
     * Maneja el envío del formulario de hosting
     */
    async handleHostingFormSubmit(event) {
        event.preventDefault();
        
        if (this.isProcessing) {
            this.log('⚠️ Ya se está procesando una orden');
            return;
        }

        this.isProcessing = true;
        this.showLoading(true);

        try {
            const formData = new FormData(event.target);
            const orderData = this.buildOrderData(formData);

            this.log('📝 Enviando orden:', orderData);

            // Enviar orden a la API
            const response = await fetch(`${HOSTING_API_BASE}/api/hosting/order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            if (result.success) {
                this.log('✅ Orden creada:', result);
                
                // Guardar datos de la orden
                this.currentOrder = result;
                
                // Mostrar confirmación y redirigir al pago
                this.showOrderConfirmation(result);
                
                // En un entorno real, redirigir a MercadoPago
                // window.location.href = result.payment_url;
                
            } else {
                throw new Error(result.error || 'Error desconocido');
            }

        } catch (error) {
            this.log('❌ Error en orden:', error);
            this.showError('Error al procesar la orden: ' + error.message);
        } finally {
            this.isProcessing = false;
            this.showLoading(false);
        }
    }

    /**
     * Construye datos de la orden desde el formulario
     */
    buildOrderData(formData) {
        if (!window.currentPlan) {
            throw new Error('No hay plan seleccionado');
        }

        return {
            customer: {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone') || '',
                domain: formData.get('domain'),
                projectType: formData.get('projectType') || 'basic',
                notes: formData.get('notes') || ''
            },
            plan: window.currentPlan
        };
    }

    /**
     * Muestra confirmación de la orden
     */
    showOrderConfirmation(orderResult) {
        // Cerrar modal de formulario
        this.closeHostingModal();

        // Mostrar modal de confirmación
        const confirmationHTML = `
        <div id="orderConfirmationModal" class="modal" style="display: block;">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-title">¡Orden Creada!</div>
                </div>
                <div style="text-align: center; padding: 20px;">
                    <div style="font-size: 4rem; color: #27ae60; margin-bottom: 20px;">✅</div>
                    <h3>Orden #${orderResult.order_id}</h3>
                    <p>Total: $${orderResult.amount.toLocaleString()}</p>
                    <p style="margin: 20px 0;">En un sistema real, ahora te redirigiríamos a MercadoPago para completar el pago.</p>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <h4>Para Testing:</h4>
                        <button onclick="lanzaWebHosting.simulatePaymentSuccess('${orderResult.order_id}')" 
                                class="plan-btn" style="margin: 10px;">
                            Simular Pago Exitoso
                        </button>
                        <button onclick="lanzaWebHosting.checkOrderStatus('${orderResult.order_id}')" 
                                class="plan-btn" style="margin: 10px;">
                            Ver Estado de Orden
                        </button>
                    </div>
                    
                    <button onclick="document.getElementById('orderConfirmationModal').remove()" 
                            class="plan-btn">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', confirmationHTML);
    }

    /**
     * Simula un pago exitoso (solo para testing)
     */
    async simulatePaymentSuccess(orderId) {
        this.log('💳 Simulando pago exitoso para orden:', orderId);

        try {
            const webhookData = {
                external_reference: orderId,
                status: 'approved',
                payment_id: `TEST_PAYMENT_${Date.now()}`,
                transaction_amount: this.currentOrder?.amount || 0
            };

            const response = await fetch(`${HOSTING_API_BASE}/api/webhook/mercadopago`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(webhookData)
            });

            if (response.ok) {
                this.showSuccess('¡Pago simulado exitosamente! El provisioning se ejecutará automáticamente.');
                this.startOrderTracking(orderId);
            } else {
                throw new Error('Error en webhook simulado');
            }

        } catch (error) {
            this.log('❌ Error simulando pago:', error);
            this.showError('Error simulando pago: ' + error.message);
        }
    }

    /**
     * Inicia seguimiento de la orden
     */
    startOrderTracking(orderId) {
        this.log('👀 Iniciando seguimiento de orden:', orderId);

        const trackingInterval = setInterval(async () => {
            try {
                const status = await this.checkOrderStatus(orderId, false);
                
                if (status && status.order) {
                    this.log(`📊 Estado actual: ${status.order.status}`);
                    
                    if (status.order.status === 'completed') {
                        clearInterval(trackingInterval);
                        this.showOrderCompleted(status.order);
                    } else if (status.order.status === 'provisioning_failed') {
                        clearInterval(trackingInterval);
                        this.showError('Error en el provisioning: ' + status.order.error);
                    }
                }
            } catch (error) {
                this.log('⚠️ Error en seguimiento:', error);
            }
        }, 3000); // Verificar cada 3 segundos

        // Cancelar seguimiento después de 5 minutos
        setTimeout(() => {
            clearInterval(trackingInterval);
        }, 300000);
    }

    /**
     * Consulta el estado de una orden
     */
    async checkOrderStatus(orderId, showAlert = true) {
        try {
            const response = await fetch(`${HOSTING_API_BASE}/api/orders/${orderId}`);
            const result = await response.json();

            if (result.success && showAlert) {
                const status = result.order.status;
                const statusMessages = {
                    'pending_payment': 'Esperando pago',
                    'paid': 'Pago confirmado',
                    'provisioning': 'Creando hosting...',
                    'completed': '¡Completado!',
                    'provisioning_failed': 'Error en provisioning'
                };

                this.showInfo(`Estado: ${statusMessages[status] || status}`);
            }

            return result;

        } catch (error) {
            this.log('❌ Error consultando estado:', error);
            if (showAlert) {
                this.showError('Error consultando estado: ' + error.message);
            }
            return null;
        }
    }

    /**
     * Muestra orden completada
     */
    showOrderCompleted(order) {
        const completedHTML = `
        <div id="orderCompletedModal" class="modal" style="display: block;">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-title">🎉 ¡Hosting Creado!</div>
                </div>
                <div style="text-align: center; padding: 20px;">
                    <div style="font-size: 4rem; color: #27ae60; margin-bottom: 20px;">🎊</div>
                    <h3>¡Tu hosting está listo!</h3>
                    <p><strong>Dominio:</strong> ${order.customer.domain}</p>
                    <p><strong>Usuario cPanel:</strong> ${order.hosting_account.username}</p>
                    <p><strong>Contraseña:</strong> ${order.hosting_account.password}</p>
                    
                    <div style="background: #e8f5e8; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <h4>🌐 Tu sitio web:</h4>
                        <a href="https://${order.customer.domain}" target="_blank" 
                           style="color: #27ae60; font-weight: bold;">
                            https://${order.customer.domain}
                        </a>
                    </div>
                    
                    <p style="font-size: 0.9rem; color: #666;">
                        Se ha enviado un email con todos los detalles a ${order.customer.email}
                    </p>
                    
                    <button onclick="document.getElementById('orderCompletedModal').remove()" 
                            class="plan-btn">
                        ¡Perfecto!
                    </button>
                </div>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', completedHTML);
    }

    /**
     * Maneja resultados de pago desde MercadoPago
     */
    handlePaymentResult() {
        const urlParams = new URLSearchParams(window.location.search);
        const status = urlParams.get('payment_status');
        const orderId = urlParams.get('order_id');

        if (status && orderId) {
            this.log('💳 Resultado de pago detectado:', { status, orderId });

            if (status === 'approved') {
                this.showSuccess('¡Pago aprobado! Tu hosting se está configurando automáticamente.');
                this.startOrderTracking(orderId);
            } else if (status === 'rejected') {
                this.showError('Pago rechazado. Puedes intentar nuevamente.');
            } else if (status === 'pending') {
                this.showInfo('Pago pendiente. Te notificaremos cuando se confirme.');
            }
        }
    }

    /**
     * Utilitarios de UI
     */
    showLoading(show) {
        const existingLoader = document.getElementById('hostingLoader');
        if (existingLoader) existingLoader.remove();

        if (show) {
            const loader = `
            <div id="hostingLoader" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                 background: rgba(0,0,0,0.8); z-index: 9999; display: flex; align-items: center; 
                 justify-content: center; color: white;">
                <div style="text-align: center;">
                    <div style="border: 4px solid #f3f3f3; border-top: 4px solid #667eea; 
                         border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; 
                         margin: 0 auto 20px;"></div>
                    <div>Procesando orden...</div>
                </div>
            </div>
            <style>
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            </style>
            `;
            document.body.insertAdjacentHTML('beforeend', loader);
        }
    }

    showSuccess(message) { this.showAlert(message, 'success'); }
    showError(message) { this.showAlert(message, 'error'); }
    showInfo(message) { this.showAlert(message, 'info'); }

    showAlert(message, type = 'info') {
        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            info: '#3498db'
        };

        const alert = document.createElement('div');
        alert.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 10000;
            background: ${colors[type]}; color: white; padding: 15px 20px;
            border-radius: 5px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            max-width: 300px; animation: slideIn 0.3s ease;
        `;
        alert.textContent = message;

        // Agregar animación CSS
        if (!document.getElementById('alertStyles')) {
            const styles = document.createElement('style');
            styles.id = 'alertStyles';
            styles.textContent = `
                @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
                @keyframes slideOut { from { transform: translateX(0); } to { transform: translateX(100%); } }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(alert);

        // Remover después de 5 segundos
        setTimeout(() => {
            alert.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => alert.remove(), 300);
        }, 5000);
    }

    closeHostingModal() {
        const modal = document.getElementById('hostingModal');
        if (modal) modal.style.display = 'none';
    }

    openHostingModal(planType, price, planName) {
        // Esta función ya existe en hosting-section.html
        if (window.openHostingModal) {
            window.openHostingModal(planType, price, planName);
        }
    }

    log(message, data = null) {
        if (DEBUG) {
            console.log(`[LanzaWebHosting] ${message}`, data || '');
        }
    }
}

// Inicializar automáticamente
const lanzaWebHosting = new LanzaWebHostingIntegration();

// Hacer disponible globalmente
window.lanzaWebHosting = lanzaWebHosting;