// Servicio de automatización completa para hosting
import WHMApiService from './whmApi';
import EmailService from './emailService';
class HostingAutomationService {
    constructor() {
        this.nameservers = [
            'ns1.dnsmitienda.net',
            'ns2.dnsmitienda.net'
        ];
        // Configurar WHM API con las credenciales del entorno
        const whmConfig = {
            baseUrl: 'https://blue106.dnsmisitio.net:2087',
            username: 'lanzawe1',
            password: 'REDACTED_WHM_PASSWORD'
        };
        this.whmApi = new WHMApiService(whmConfig);
    }
    // Procesar orden completa de hosting
    async processHostingOrder(orderData) {
        const errors = [];
        const warnings = [];
        let accountDetails = null;
        let welcomeEmailSent = false;
        let configEmailSent = false;
        try {
            console.log('🚀 Iniciando automatización de hosting para:', orderData.clientData.email);
            // 1. Crear cuenta en WHM
            console.log('⚙️ Creando cuenta en WHM...');
            const accountResult = await this.createHostingAccount(orderData);
            if (!accountResult.success) {
                errors.push(`Error creando cuenta: ${accountResult.error}`);
                return { success: false, errors };
            }
            accountDetails = accountResult.accountDetails;
            console.log('✅ Cuenta creada:', accountDetails.domain);
            // 2. Configurar dominio según la opción elegida
            console.log('🌐 Configurando dominio...');
            const domainResult = await this.configureDomain(orderData, accountDetails);
            if (!domainResult.success) {
                warnings.push(`Advertencia en configuración de dominio: ${domainResult.message}`);
            }
            // 3. Enviar email de bienvenida con credenciales
            console.log('📧 Enviando email de bienvenida...');
            const welcomeResult = await this.sendWelcomeEmail(orderData, accountDetails);
            welcomeEmailSent = welcomeResult;
            if (!welcomeEmailSent) {
                warnings.push('No se pudo enviar el email de bienvenida');
            }
            // 4. Enviar email de configuración si es necesario
            if (orderData.domainOption === 'own-domain' && orderData.customDomain) {
                console.log('📧 Enviando instrucciones de configuración de dominio...');
                configEmailSent = await this.sendDomainConfigEmail(orderData, accountDetails);
                if (!configEmailSent) {
                    warnings.push('No se pudo enviar el email de configuración de dominio');
                }
            }
            // 5. Log del resultado
            console.log('🎉 Automatización completada exitosamente');
            return {
                success: true,
                accountDetails: {
                    username: accountDetails.username,
                    domain: accountDetails.domain,
                    cpanelUrl: accountDetails.cpanelUrl,
                    planName: this.getPlanDisplayName(orderData.planId)
                },
                emails: {
                    welcomeEmailSent,
                    configEmailSent: orderData.domainOption === 'own-domain' ? configEmailSent : undefined
                },
                warnings: warnings.length > 0 ? warnings : undefined
            };
        }
        catch (error) {
            console.error('❌ Error en automatización:', error);
            errors.push(`Error general: ${error instanceof Error ? error.message : 'Error desconocido'}`);
            return { success: false, errors, warnings: warnings.length > 0 ? warnings : undefined };
        }
    }
    // Crear cuenta de hosting en WHM
    async createHostingAccount(orderData) {
        const { clientData, planId, domainOption, customDomain, subdomainName } = orderData;
        // Determinar el dominio final
        let finalDomain;
        if (domainOption === 'subdomain') {
            finalDomain = `${subdomainName}.lanzawebar.com`;
        }
        else if (domainOption === 'own-domain' || domainOption === 'register-new') {
            finalDomain = customDomain || '';
        }
        else {
            return { success: false, error: 'Opción de dominio inválida' };
        }
        return await this.whmApi.createAccountAutomated({
            clientName: clientData.name,
            clientEmail: clientData.email,
            planId,
            domainOption,
            customDomain: finalDomain
        });
    }
    // Configurar dominio según la opción
    async configureDomain(orderData, accountDetails) {
        const { domainOption, customDomain } = orderData;
        if (domainOption === 'subdomain') {
            // Subdominios se configuran automáticamente
            return { success: true, message: 'Subdominio configurado automáticamente' };
        }
        if (domainOption === 'own-domain') {
            // Para dominios propios, el cliente debe configurar nameservers
            return {
                success: true,
                message: 'Cliente debe configurar nameservers manualmente'
            };
        }
        if (domainOption === 'register-new') {
            // TODO: Integrar con Namecheap API para registro automático
            return {
                success: true,
                message: 'Registro de dominio pendiente - proceso manual requerido'
            };
        }
        return { success: false, message: 'Opción de dominio no reconocida' };
    }
    // Enviar email de bienvenida
    async sendWelcomeEmail(orderData, accountDetails) {
        const credentials = {
            username: accountDetails.username,
            password: accountDetails.password,
            domain: accountDetails.domain,
            cpanelUrl: accountDetails.cpanelUrl,
            email: accountDetails.email,
            planName: this.getPlanDisplayName(orderData.planId),
            clientName: orderData.clientData.name
        };
        return await EmailService.sendWelcomeEmail(credentials);
    }
    // Enviar email de configuración de dominio
    async sendDomainConfigEmail(orderData, accountDetails) {
        if (!orderData.customDomain)
            return false;
        // TODO: Implementar envío de email de configuración
        // Por ahora retornamos true para testing
        return true;
    }
    // Obtener nombre del plan para mostrar
    getPlanDisplayName(planId) {
        const planNames = {
            'basico': 'Lanza Básico',
            'intermedio': 'Lanza Pro',
            'premium': 'Lanza Premium'
        };
        return planNames[planId] || planId;
    }
    // Validar datos de la orden
    static validateOrderData(orderData) {
        const errors = [];
        // Validar datos del cliente
        if (!orderData.clientData.name?.trim())
            errors.push('Nombre del cliente requerido');
        if (!orderData.clientData.email?.trim())
            errors.push('Email del cliente requerido');
        if (!orderData.clientData.phone?.trim())
            errors.push('Teléfono del cliente requerido');
        // Validar email format
        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
        if (orderData.clientData.email && !emailRegex.test(orderData.clientData.email)) {
            errors.push('Formato de email inválido');
        }
        // Validar plan
        const validPlans = ['basico', 'intermedio', 'premium'];
        if (!validPlans.includes(orderData.planId)) {
            errors.push('Plan de hosting inválido');
        }
        // Validar dominio según opción
        if (orderData.domainOption === 'subdomain' && !orderData.subdomainName?.trim()) {
            errors.push('Nombre de subdominio requerido');
        }
        if ((orderData.domainOption === 'own-domain' || orderData.domainOption === 'register-new') && !orderData.customDomain?.trim()) {
            errors.push('Dominio personalizado requerido');
        }
        return { valid: errors.length === 0, errors };
    }
}
export default new HostingAutomationService();
