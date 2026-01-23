import axios from 'axios';

const CAKTO_BASE_URL = 'https://api.cakto.com.br';

export interface CaktoPixResponse {
  transactionId: string;
  qrCode: string;
  copyPaste: string;
  status: string;
  expiresAt: string;
}

export class CaktoClient {
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.clientId = process.env.CAKTO_CLIENT_ID || '';
    this.clientSecret = process.env.CAKTO_CLIENT_SECRET || '';
    
    if (!this.clientId || !this.clientSecret) {
      console.warn('CAKTO_CLIENT_ID or CAKTO_CLIENT_SECRET is missing');
    }
  }

  private async getHeaders() {
    const token = await this.authenticate();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  private async authenticate() {
    // Return cached token if valid (buffer 60s)
    if (this.accessToken && Date.now() < this.tokenExpiry - 60000) {
      return this.accessToken;
    }

    try {
      // Standard OAuth2 Client Credentials flow
      // Note: Endpoint might vary, usually /oauth/token or /auth
      // Based on docs search, we'll try standard /oauth/token or check if there's a specific auth endpoint
      // If this fails 404, we might need to adjust.
      const params = new URLSearchParams();
      params.append('client_id', this.clientId);
      params.append('client_secret', this.clientSecret);

      const response = await axios.post(`${CAKTO_BASE_URL}/public_api/token/`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + ((response.data.expires_in || 3600) * 1000);
      return this.accessToken;
    } catch (error: any) {
      console.error('Cakto Auth Error:', error.response?.data || error.message);
      throw new Error('Falha na autenticação com o gateway de pagamento');
    }
  }

  async createPixCharge(payload: {
    customer: {
      name: string;
      email: string;
      tax_id?: string; // CPF/CNPJ
    };
    amount: number; // em centavos
    description: string;
    items?: any[];
  }): Promise<CaktoPixResponse> {
    try {
      const headers = await this.getHeaders();
      
      // Mapeando para o formato esperado da Cakto (baseado em padrões de mercado e snippets)
      const body = {
        payment_method: 'pix',
        amount: payload.amount,
        customer: {
          name: payload.customer.name,
          email: payload.customer.email,
          document: payload.customer.tax_id
        },
        description: payload.description,
        items: payload.items
      };

      const response = await axios.post(`${CAKTO_BASE_URL}/api/transactions`, body, { headers });
      
      // Adaptar resposta conforme retorno real da Cakto
      const data = response.data;
      
      return {
        transactionId: data.id || data.transaction_id,
        qrCode: data.pix?.qrcode || data.qrcode?.image, // ajuste conforme API
        copyPaste: data.pix?.qrcode_text || data.qrcode?.content, // ajuste conforme API
        status: data.status,
        expiresAt: data.pix?.expiration_date || data.expiration_date
      };
    } catch (error: any) {
      console.error('Cakto Create Pix Error:', error.response?.data || error.message);
      throw new Error('Falha ao gerar cobrança PIX');
    }
  }

  async getOffers(params?: { type?: string; status?: string }) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.get(`${CAKTO_BASE_URL}/public_api/offers`, { 
        headers,
        params
      });
      return response.data;
    } catch (error: any) {
      console.error('Cakto Get Offers Error:', error.response?.data || error.message);
      throw error;
    }
  }

  async getTransaction(id: string) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.get(`${CAKTO_BASE_URL}/api/transactions/${id}`, { headers });
      return response.data;
    } catch (error: any) {
      console.error('Cakto Get Transaction Error:', error.response?.data || error.message);
      throw error;
    }
  }
}

export const cakto = new CaktoClient();
