// Este servicio maneja la comunicación con AWS SES
// Nota: En un entorno de producción, es mejor manejar esto en el servidor
// para no exponer las credenciales de AWS en el cliente

interface AwsCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  name: string;
}

interface AwsTemplate {
  Name: string;
  CreatedTimestamp: Date;
  SubjectPart?: string;
  TextPart?: string;
  HtmlPart?: string;
}

export class AwsSesService {
  private static instance: AwsSesService;
  private credentials: AwsCredentials | null = null;
  private AWS: any = null;
  private SES: any = null;

  private constructor() {
    // Cargar AWS SDK dinámicamente
    this.loadAwsSdk();
  }

  public static getInstance(): AwsSesService {
    if (!AwsSesService.instance) {
      AwsSesService.instance = new AwsSesService();
    }
    return AwsSesService.instance;
  }

  private async loadAwsSdk() {
    try {
      // En un entorno real, importaríamos AWS SDK
      // Aquí simulamos la carga para el ejemplo
      this.AWS = {
        config: {
          update: (credentials: any) => {
            console.log("AWS credentials updated", credentials);
          },
        },
        SES: class {
          constructor() {
            console.log("AWS SES client initialized");
          }

          listTemplates(params: any) {
            return {
              promise: async () => {
                console.log("Listing templates with params", params);
                // Simulamos una respuesta de AWS SES
                return this.mockTemplateResponse();
              },
            };
          }

          getTemplate(params: any) {
            return {
              promise: async () => {
                console.log("Getting template", params.TemplateName);
                // Simulamos una respuesta de AWS SES
                return this.mockGetTemplateResponse(params.TemplateName);
              },
            };
          }

          private mockTemplateResponse() {
            return {
              TemplatesMetadata: [
                {
                  Name: "WelcomeTemplate",
                  CreatedTimestamp: new Date(
                    Date.now() - 7 * 24 * 60 * 60 * 1000
                  ),
                },
                {
                  Name: "PasswordResetTemplate",
                  CreatedTimestamp: new Date(
                    Date.now() - 3 * 24 * 60 * 60 * 1000
                  ),
                },
                {
                  Name: "OrderConfirmationTemplate",
                  CreatedTimestamp: new Date(
                    Date.now() - 1 * 24 * 60 * 60 * 1000
                  ),
                },
                {
                  Name: "NewsletterTemplate",
                  CreatedTimestamp: new Date(
                    Date.now() - 14 * 24 * 60 * 60 * 1000
                  ),
                },
              ],
            };
          }

          private mockGetTemplateResponse(templateName: string) {
            const templates: Record<string, any> = {
              WelcomeTemplate: {
                Template: {
                  TemplateName: "WelcomeTemplate",
                  SubjectPart: "Welcome to our service, {{name}}!",
                  HtmlPart:
                    "<h1>Hello {{name}},</h1><p>Welcome to our amazing service!</p>",
                  TextPart: "Hello {{name}}, Welcome to our amazing service!",
                },
              },
              PasswordResetTemplate: {
                Template: {
                  TemplateName: "PasswordResetTemplate",
                  SubjectPart: "Password Reset Request",
                  HtmlPart:
                    "<h1>Password Reset</h1><p>Click <a href='{{resetLink}}'>here</a> to reset your password.</p>",
                  TextPart:
                    "Password Reset. Go to {{resetLink}} to reset your password.",
                },
              },
              OrderConfirmationTemplate: {
                Template: {
                  TemplateName: "OrderConfirmationTemplate",
                  SubjectPart: "Your order #{{orderId}} has been confirmed",
                  HtmlPart:
                    "<h1>Order Confirmation</h1><p>Thank you for your order #{{orderId}}.</p>",
                  TextPart:
                    "Order Confirmation. Thank you for your order #{{orderId}}.",
                },
              },
              NewsletterTemplate: {
                Template: {
                  TemplateName: "NewsletterTemplate",
                  SubjectPart: "Monthly Newsletter - {{month}}",
                  HtmlPart:
                    "<h1>Newsletter - {{month}}</h1><p>Here are the latest updates...</p>",
                  TextPart:
                    "Newsletter - {{month}}. Here are the latest updates...",
                },
              },
            };

            return (
              templates[templateName] || {
                Template: {
                  TemplateName: templateName,
                  SubjectPart: "Default Subject",
                  HtmlPart: "<p>Default template content</p>",
                  TextPart: "Default template content",
                },
              }
            );
          }
        },
      };

      console.log("AWS SDK loaded successfully");
    } catch (error) {
      console.error("Error loading AWS SDK:", error);
    }
  }

  public loadCredentials(): AwsCredentials | null {
    try {
      const storedCredentials = localStorage.getItem("aws-credentials");
      if (storedCredentials) {
        this.credentials = JSON.parse(storedCredentials);
        return this.credentials;
      }
      return null;
    } catch (error) {
      console.error("Error loading AWS credentials:", error);
      return null;
    }
  }

  public async initializeAwsSdk(): Promise<boolean> {
    try {
      const credentials = this.loadCredentials();
      if (!credentials || !this.AWS) {
        return false;
      }

      // Configurar AWS con las credenciales
      this.AWS.config.update({
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
        region: credentials.region,
      });

      // Inicializar el cliente SES
      this.SES = new this.AWS.SES();
      return true;
    } catch (error) {
      console.error("Error initializing AWS SDK:", error);
      return false;
    }
  }

  public async listTemplates(): Promise<AwsTemplate[]> {
    try {
      if (!this.SES) {
        const initialized = await this.initializeAwsSdk();
        if (!initialized) {
          throw new Error("AWS SES client not initialized");
        }
      }

      const response = await this.SES.listTemplates({}).promise();
      return response.TemplatesMetadata || [];
    } catch (error) {
      console.error("Error listing templates:", error);
      return [];
    }
  }

  public async getTemplate(templateName: string): Promise<any> {
    try {
      if (!this.SES) {
        const initialized = await this.initializeAwsSdk();
        if (!initialized) {
          throw new Error("AWS SES client not initialized");
        }
      }

      const response = await this.SES.getTemplate({
        TemplateName: templateName,
      }).promise();
      return response.Template;
    } catch (error) {
      console.error(`Error getting template ${templateName}:`, error);
      return null;
    }
  }
}

export const awsSesService = AwsSesService.getInstance();
