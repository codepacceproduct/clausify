import axios, { AxiosInstance } from 'axios';
import { ENV } from "@/lib/env";

export interface AsaasPaymentResponse {
  id: string;
  netValue: number;
  value: number;
  billingType: string;
  status: string;
  invoiceUrl: string;
  bankSlipUrl: string | null;
  transactionReceiptUrl: string | null;
  pixTransaction: string | null;
  deleted: boolean;
  dueDate: string;
  description?: string;
  subscription?: string;
}

export interface AsaasSubscriptionResponse {
    id: string;
    customer: string;
    value: number;
    billingType: string;
    status: string;
    cycle: string;
    description: string;
    deleted: boolean;
    nextDueDate: string;
}

export interface AsaasPixQrCodeResponse {
    encodedImage: string;
    payload: string;
    expirationDate: string;
}

export class AsaasClient {
  private apiKey: string;
  private baseURL: string;

  constructor() {
    const apiKey = ENV.ASAAS_API_KEY;
    const baseURL = ENV.ASAAS_BASE_URL;

    // Logs obrigatórios para debug de runtime
    const keyStatus = apiKey ? `Present (Length: ${apiKey.length}, Starts: ${apiKey.substring(0,3)}...)` : "Missing";
    console.log(`[AsaasClient] Init. Runtime: ${process.env.NEXT_RUNTIME ?? "node"}. Key: ${keyStatus}`);
    
    if (!apiKey) {
      // Erro crítico se tentar usar o cliente sem chave
      throw new Error("ASAAS_API_KEY is missing at runtime (dotenv forced)");
    }

    this.apiKey = apiKey;
    this.baseURL = baseURL;
  }

  // Getter para a instância do Axios (cria na hora do uso)
  get api(): AxiosInstance {
    return axios.create({
      baseURL: this.baseURL,
      headers: {
        'access_token': this.apiKey,
        'Content-Type': 'application/json',
        'User-Agent': 'Clausify'
      }
    });
  }

  private sanitizeDocument(doc?: string) {
    if (!doc) return undefined;
    return doc.replace(/\D/g, '');
  }

  // 👤 Fluxo: criar ou buscar cliente
  async getOrCreateCustomer(customerData: {
      name: string;
      email: string;
      cpfCnpj?: string;
      mobilePhone?: string;
  }): Promise<string> {
      try {
          const email = customerData.email;
          
          if (email) {
            try {
                const byEmail = await this.api.get(`/customers`, {
                    params: { email, limit: 1 }
                });
                if (byEmail.data?.data?.length > 0) {
                    // Se encontrou, atualiza os dados para garantir consistência
                    const customerId = byEmail.data.data[0].id;
                    const updatePayload: any = {};
                    const doc = this.sanitizeDocument(customerData.cpfCnpj);
                    if (doc) updatePayload.cpfCnpj = doc;
                    if (customerData.mobilePhone) updatePayload.mobilePhone = customerData.mobilePhone;
                    
                    if (Object.keys(updatePayload).length > 0) {
                        await this.api.post(`/customers/${customerId}`, updatePayload).catch(err => {
                             console.warn('Erro ao atualizar dados do cliente existente:', err.message);
                        });
                    }
                    return customerId;
                }
            } catch (err) {
                console.warn('Erro ao buscar cliente por email, tentando criar:', err);
            }
          }

          const createPayload: any = {
            name: customerData.name,
            email: customerData.email
          };
          
          const doc = this.sanitizeDocument(customerData.cpfCnpj);
          if (doc) createPayload.cpfCnpj = doc;
          if (customerData.mobilePhone) createPayload.mobilePhone = customerData.mobilePhone;
          
          const createResponse = await this.api.post(`/customers`, createPayload);
          return createResponse.data.id;

      } catch (error: any) {
          console.error('Asaas Get/Create Customer Error:', error.response?.data || error.message);
          // Retornar erro detalhado se o Asaas rejeitar (ex: CPF inválido)
          if (error.response?.data?.errors) {
               const asaasErrors = error.response.data.errors.map((e: any) => e.description).join(', ');
               throw new Error(`Erro Asaas: ${asaasErrors}`);
          }
          throw new Error('Falha ao registrar cliente no gateway de pagamento');
      }
  }

  // 💸 Fluxo: gerar cobrança PIX
  async createPixCharge(payload: {
    customerId: string;
    value: number;
    description: string;
    dueDate?: string;
  }) {
      try {
          const dueDate = payload.dueDate || new Date().toISOString().split('T')[0];
          
          const paymentResponse = await this.api.post(`/payments`, {
              customer: payload.customerId,
              billingType: 'PIX',
              value: payload.value,
              dueDate: dueDate,
              description: payload.description
          });

          const paymentId = paymentResponse.data.id;
          console.log(`[Asaas] Charge created: ${paymentId}. Waiting for QR Code generation...`);

          // Pequeno delay para garantir que o Asaas gerou o QR Code (evita race condition)
          await new Promise(resolve => setTimeout(resolve, 1500));

          let qrCodeResponse;
          try {
            qrCodeResponse = await this.api.get(`/payments/${paymentId}/pixQrCode`);
            console.log(`[Asaas] QR Code response status: ${qrCodeResponse.status}`);
          } catch (qrError) {
             console.warn(`[Asaas] First attempt to fetch QR Code failed. Retrying...`);
             await new Promise(resolve => setTimeout(resolve, 2000));
             qrCodeResponse = await this.api.get(`/payments/${paymentId}/pixQrCode`);
          }
          
          if (!qrCodeResponse.data.encodedImage && !qrCodeResponse.data.payload) {
             console.warn(`[Asaas] QR Code data missing for ${paymentId}:`, qrCodeResponse.data);
          }

          let qrCodeBase64 = qrCodeResponse.data.encodedImage;
          if (qrCodeBase64 && !qrCodeBase64.startsWith('data:image')) {
              qrCodeBase64 = `data:image/png;base64,${qrCodeBase64}`;
          }

          return {
              invoiceUrl: paymentResponse.data.invoiceUrl,
              pixQrCode: qrCodeBase64,
              pixCopyPaste: qrCodeResponse.data.payload,
              paymentId: paymentId
          };

      } catch (error: any) {
          console.error('Asaas Create Pix Charge Error:', error.response?.data || error.message);
          throw new Error('Falha ao gerar cobrança PIX');
      }
  }

  // Listar cobranças de um cliente
  async listPayments(customerId: string): Promise<AsaasPaymentResponse[]> {
    try {
        const response = await this.api.get(`/payments`, {
            params: {
                customer: customerId,
                limit: 20 // Limite razoável para histórico
            }
        });
        return response.data.data;
    } catch (error: any) {
        console.error('Asaas List Payments Error:', error.response?.data || error.message);
        return [];
    }
  }

  // Métodos auxiliares
  async createSubscription(payload: {
      customer: string;
      billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX' | 'UNDEFINED';
      value: number;
      nextDueDate: string;
      cycle: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'SEMIANNUALLY' | 'YEARLY';
      description: string;
      externalReference?: string;
  }): Promise<AsaasSubscriptionResponse> {
      try {
          const response = await this.api.post(`/subscriptions`, {
              customer: payload.customer,
              billingType: payload.billingType,
              value: payload.value,
              nextDueDate: payload.nextDueDate,
              cycle: payload.cycle,
              description: payload.description,
              externalReference: payload.externalReference
          });
          return response.data;
      } catch (error: any) {
          console.error('Asaas Create Subscription Error:', error.response?.data || error.message);
          if (error.response?.data?.errors) {
               const asaasErrors = error.response.data.errors.map((e: any) => e.description).join(', ');
               throw new Error(`Erro Asaas: ${asaasErrors}`);
          }
          throw new Error('Falha ao criar assinatura no gateway');
      }
  }

  async getTransaction(id: string): Promise<AsaasPaymentResponse> {
    try {
      const response = await this.api.get(`/payments/${id}`);
      return response.data;
    } catch (error: any) {
        console.error('Asaas Get Transaction Error:', error.response?.data || error.message);
        throw error;
    }
  }

  async getSubscriptionPayments(subscriptionId: string): Promise<any> {
    try {
        const response = await this.api.get(`/subscriptions/${subscriptionId}/payments`);
        return response.data;
    } catch (error: any) {
        console.error('Asaas Get Subscription Payments Error:', error.response?.data || error.message);
        throw new Error('Falha ao buscar pagamentos da assinatura');
    }
  }
}

// Factory function para garantir leitura de ENV no runtime
export function getAsaasClient() {
  return new AsaasClient();
}
