"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Edit,
  Eye,
  MoreVertical,
  Plus,
  Trash2,
  Send,
  Mail,
  CloudOff,
  CloudIcon as CloudCheck,
  FileText,
  Loader2,
} from "lucide-react";
import { TemplateEditor } from "@/email/templateEditor";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { TemplatePreview } from "@/email/templatePreview";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { awsSesService } from "@/aws/aws-ses-service";
import { toast } from "sonner";
// HTML y CSS de ejemplo para los templates
const defaultHtml = `<!DOCTYPE html>
<html>
<head>
  <title>Email Template</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background-color: #4CAF50;
      padding: 20px;
      text-align: center;
      color: white;
    }
    .content {
      padding: 20px;
      line-height: 1.5;
    }
    .footer {
      background-color: #333333;
      color: white;
      text-align: center;
      padding: 10px;
      font-size: 12px;
    }
    .button {
      display: inline-block;
      background-color: #4CAF50;
      color: white;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Hola, {{nombre}}!</h1>
    </div>
    <div class="content">
      <p>Gracias por unirte a nuestra plataforma. Estamos emocionados de tenerte con nosotros.</p>
      <p>Tu cuenta ha sido creada exitosamente y ahora puedes comenzar a explorar todas las funcionalidades que ofrecemos.</p>
      <p>Si tienes alguna pregunta, no dudes en contactarnos respondiendo a este correo.</p>
      <div style="text-align: center;">
        <a href="{{link_confirmacion}}" class="button">Confirmar cuenta</a>
      </div>
      <p style="font-size: 12px; color: #777777; margin-top: 20px;">
        Este correo fue enviado a {{email}}. Si no solicitaste esta cuenta, puedes ignorar este mensaje.
      </p>
    </div>
    <div class="footer">
      <p>© 2023 Tu Empresa. Todos los derechos reservados.</p>
      <p>Dirección de la empresa, Ciudad, País</p>
    </div>
  </div>
</body>
</html>`;

const defaultCss = `/* Estilos adicionales */
.header h1 {
  margin: 0;
  font-size: 24px;
}

.content p {
  margin-bottom: 15px;
}

.button:hover {
  background-color: #45a049;
}

@media only screen and (max-width: 480px) {
  .container {
    width: 100%;
  }
  .header h1 {
    font-size: 20px;
  }
}`;

// Datos de ejemplo para templates locales
const localTemplateData = [
  {
    id: 3,
    name: "Confirmación de compra",
    description: "Confirmación de compra con detalles",
    category: "Transaccional",
    lastModified: "Hace 3 días",
    status: "draft",
    storedIn: "supabase",
    htmlContent: defaultHtml.replace(
      "Hola, {{nombre}}!",
      "Confirmación de Compra #{{order_id}}"
    ),
    cssContent: defaultCss,
  },
  {
    id: 5,
    name: "Abandono de carrito",
    description: "Recordatorio de productos en carrito",
    category: "Marketing",
    lastModified: "Hace 5 días",
    status: "draft",
    storedIn: "supabase",
    htmlContent: defaultHtml.replace(
      "Hola, {{nombre}}!",
      "¡No olvides tu carrito, {{nombre}}!"
    ),
    cssContent: defaultCss,
  },
  {
    id: 6,
    name: "Actualización de términos",
    description: "Notificación de cambios en términos",
    category: "Legal",
    lastModified: "Hace 1 mes",
    status: "inactive",
    storedIn: "supabase",
    htmlContent: defaultHtml.replace(
      "Hola, {{nombre}}!",
      "Actualización de Términos y Condiciones"
    ),
    cssContent: defaultCss,
  },
];

interface TemplateListProps {
  searchQuery: string;
}

export function TemplateList({ searchQuery }: TemplateListProps) {
  const [localTemplates, setLocalTemplates] = useState(localTemplateData);
  const [awsTemplates, setAwsTemplates] = useState<any[]>([]);
  const [isLoadingAwsTemplates, setIsLoadingAwsTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  // Cargar templates de AWS SES
  useEffect(() => {
    const fetchAwsTemplates = async () => {
      setIsLoadingAwsTemplates(true);
      try {
        // Verificar si hay credenciales de AWS
        const credentials = awsSesService.loadCredentials();
        if (!credentials) {
          console.log("No AWS credentials found");
          setIsLoadingAwsTemplates(false);
          return;
        }

        // Obtener templates de AWS SES
        const templates = await awsSesService.listTemplates();

        // Convertir los templates de AWS al formato que necesitamos
        const formattedTemplates = await Promise.all(
          templates.map(async (template, index) => {
            // Para cada template, obtener sus detalles
            const templateDetail = await awsSesService.getTemplate(
              template.Name
            );

            return {
              id: 1000 + index, // IDs únicos para no colisionar con los locales
              name: template.Name,
              description: `Template de AWS SES: ${template.Name}`,
              category: "AWS SES",
              lastModified: template.CreatedTimestamp
                ? new Date(template.CreatedTimestamp).toLocaleDateString()
                : "Fecha desconocida",
              status: "active",
              storedIn: "aws",
              htmlContent: templateDetail?.HtmlPart || defaultHtml,
              cssContent: "",
            };
          })
        );

        setAwsTemplates(formattedTemplates);
      } catch (error) {
        console.error("Error fetching AWS templates:", error);
        toast.error("No se pudieron cargar los templates de AWS SES");
      } finally {
        setIsLoadingAwsTemplates(false);
      }
    };

    fetchAwsTemplates();
  }, [toast]);

  // Combinar templates locales y de AWS
  const allTemplates = [...localTemplates, ...awsTemplates];

  // Filtrar templates basados en la búsqueda y estado
  const filteredTemplates = allTemplates.filter(
    (template) =>
      (activeTab === "all" ||
        (activeTab === "active" && template.status === "active") ||
        (activeTab === "drafts" && template.status === "draft") ||
        (activeTab === "inactive" && template.status === "inactive")) &&
      (template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        template.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDelete = (id: number) => {
    // Si es un template de AWS (ID >= 1000), mostramos un mensaje
    if (id >= 1000) {
      toast.error(
        "No se pueden eliminar templates directamente de AWS SES desde esta interfaz"
      );
      return;
    }

    // Si es un template local, lo eliminamos
    setLocalTemplates(localTemplates.filter((template) => template.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "draft":
        return "bg-yellow-500";
      case "inactive":
        return "bg-gray-500";
      default:
        return "bg-blue-500";
    }
  };

  const getStorageBadge = (storedIn: string, status: string) => {
    if (storedIn === "aws") {
      return (
        <Badge variant="outline" className="ml-2 flex items-center">
          <CloudCheck className="mr-1 h-3 w-3" />
          AWS SES
        </Badge>
      );
    } else {
      return (
        <Badge variant="secondary" className="ml-2 flex items-center">
          <CloudOff className="mr-1 h-3 w-3" />
          Local DB
        </Badge>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Templates de Email</h2>
        <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Template
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[900px]">
            <TemplateEditor
              template={
                selectedTemplate
                  ? allTemplates.find((t) => t.id === selectedTemplate)
                  : undefined
              }
              onClose={() => {
                setIsEditorOpen(false);
                setSelectedTemplate(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="all" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Todos
            <Badge variant="secondary" className="ml-2">
              {allTemplates.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center">
            <CloudCheck className="mr-2 h-4 w-4" />
            Activos (AWS)
            <Badge variant="secondary" className="ml-2">
              {allTemplates.filter((t) => t.status === "active").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="drafts" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Borradores
            <Badge variant="secondary" className="ml-2">
              {allTemplates.filter((t) => t.status === "draft").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="inactive" className="flex items-center">
            <CloudOff className="mr-2 h-4 w-4" />
            Inactivos
            <Badge variant="secondary" className="ml-2">
              {allTemplates.filter((t) => t.status === "inactive").length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {isLoadingAwsTemplates && activeTab === "active" && (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Cargando templates de AWS SES...</span>
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ y: -5 }}
                  className="h-full"
                >
                  <Card className="h-full flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center flex-wrap">
                            {template.name}
                            <div
                              className={`ml-2 h-2 w-2 rounded-full ${getStatusColor(
                                template.status
                              )}`}
                            />
                            {getStorageBadge(
                              template.storedIn,
                              template.status
                            )}
                          </CardTitle>
                          <CardDescription>
                            {template.description}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Acciones</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedTemplate(template.id);
                                setIsEditorOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Editar</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setPreviewTemplate(template.id);
                                setIsPreviewOpen(true);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Vista previa</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" />
                              <span>Duplicar</span>
                            </DropdownMenuItem>
                            {template.status === "active" && (
                              <DropdownMenuItem>
                                <Send className="mr-2 h-4 w-4" />
                                <span>Enviar prueba</span>
                              </DropdownMenuItem>
                            )}
                            {template.storedIn !== "aws" && (
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDelete(template.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Eliminar</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="outline">{template.category}</Badge>
                    </CardContent>
                    <CardFooter className="mt-auto text-sm text-muted-foreground">
                      Modificado: {template.lastModified}
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredTemplates.length === 0 && !isLoadingAwsTemplates && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center p-12 text-center"
            >
              <Mail className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">
                No se encontraron templates
              </h3>
              <p className="text-muted-foreground mt-2">
                {searchQuery
                  ? "Intenta con otra búsqueda"
                  : activeTab !== "all"
                  ? `No hay templates ${
                      activeTab === "active"
                        ? "activos"
                        : activeTab === "drafts"
                        ? "en borrador"
                        : "inactivos"
                    }`
                  : "Crea tu primer template para comenzar"}
              </p>
              <Button className="mt-4" onClick={() => setIsEditorOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Template
              </Button>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogTitle>Vista previa del template</DialogTitle>
          <TemplatePreview
            template={
              previewTemplate
                ? allTemplates.find((t) => t.id === previewTemplate)
                : undefined
            }
            onClose={() => {
              setIsPreviewOpen(false);
              setPreviewTemplate(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
