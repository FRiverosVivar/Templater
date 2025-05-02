"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Save,
  Eye,
  Send,
  Code,
  FileText,
  Sparkles,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TemplatePreview } from "@/email/templatePreview";
import { SendTestEmail } from "@/email/sendTestEmail";
import { toast } from "sonner";
interface TemplateEditorProps {
  template?: {
    id: number;
    name: string;
    description: string;
    category: string;
    status: string;
    htmlContent?: string;
    cssContent?: string;
  };
  onClose: () => void;
}

export function TemplateEditor({ template, onClose }: TemplateEditorProps) {
  const [activeTab, setActiveTab] = useState("design");
  const [name, setName] = useState(template?.name || "");
  const [description, setDescription] = useState(template?.description || "");
  const [category, setCategory] = useState(template?.category || "");
  const [status, setStatus] = useState(template?.status || "draft");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateWithAI = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Por favor, introduce un contexto para la generación");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(
        "https://friveros.app.n8n.cloud/webhook/ad9a948a-181d-4f30-aca4-bbcf6b4538ed",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatInput: aiPrompt,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      const data = await response.json();

      // Extraer el HTML de la propiedad text de la respuesta
      if (data.text) {
        // Limpiar el HTML (eliminar backticks y otros caracteres no deseados)
        let cleanHtml = data.text;

        // Si termina con backticks, eliminarlos
        cleanHtml = cleanHtml.replace(/```$/g, "");

        // Si comienza con backticks, eliminarlos
        cleanHtml = cleanHtml.replace(/^```/g, "");

        // Eliminar espacios en blanco al inicio y final
        cleanHtml = cleanHtml.trim();

        // Actualizar el contenido HTML
        setHtmlContent(cleanHtml);

        // Cerrar el modal
        setIsAiModalOpen(false);

        toast.success("Se ha generado el template con IA correctamente");

        // Cambiar a la pestaña de diseño para ver el resultado
        setActiveTab("design");
      } else {
        throw new Error("La respuesta no contiene la propiedad 'text'");
      }
    } catch (error) {
      console.error("Error generando con IA:", error);
      toast.error("No se pudo generar el template con IA");
    } finally {
      setIsGenerating(false);
    }
  };
  // Contenido HTML y CSS por defecto si no hay template
  const defaultHtml = `<!DOCTYPE html>
<html>
<head>
  <title>Email Template</title>
  <style>
    /* Estilos inline para compatibilidad con clientes de correo */
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

  const defaultCss = `/* Estilos adicionales (se combinarán con los inline) */
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

  const [htmlContent, setHtmlContent] = useState(
    template?.htmlContent || defaultHtml
  );
  const [cssContent, setCssContent] = useState(
    template?.cssContent || defaultCss
  );
  const [combinedPreview, setCombinedPreview] = useState("");

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSendTestOpen, setIsSendTestOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState("desktop");

  // Combinar HTML y CSS para la vista previa
  useEffect(() => {
    // Extraer el contenido del body
    let bodyContent = htmlContent;

    // Si el HTML contiene etiquetas <body>, extraer solo el contenido dentro de ellas
    const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch && bodyMatch[1]) {
      bodyContent = bodyMatch[1];
    }

    // Extraer estilos del HTML
    let stylesFromHtml = "";
    const styleMatch = htmlContent.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    if (styleMatch && styleMatch[1]) {
      stylesFromHtml = styleMatch[1];
    }

    // Combinar estilos y contenido
    const combined = `
      <style>
        ${stylesFromHtml}
        ${cssContent}
      </style>
      <div class="email-preview">
        ${bodyContent}
      </div>
    `;

    setCombinedPreview(combined);
  }, [htmlContent, cssContent]);

  const handleSave = () => {
    // Aquí iría la lógica para guardar el template
    toast.success(`El template "${name}" ha sido guardado correctamente.`);
    onClose();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {template ? "Editar Template" : "Nuevo Template"}
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Guardar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del template"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción breve"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Onboarding">Onboarding</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Transaccional">Transaccional</SelectItem>
                <SelectItem value="Seguridad">Seguridad</SelectItem>
                <SelectItem value="Legal">Legal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="draft">Borrador</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 space-y-2">
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Eye className="mr-2 h-4 w-4" />
                  Vista previa
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[900px]">
                <DialogTitle>Vista previa del template</DialogTitle>
                <TemplatePreview
                  template={{
                    ...template,
                    id: template?.id || 0,
                    name,
                    description,
                    category,
                    status,
                    htmlContent: combinedPreview,
                  }}
                  onClose={() => setIsPreviewOpen(false)}
                />
              </DialogContent>
            </Dialog>

            <Dialog open={isSendTestOpen} onOpenChange={setIsSendTestOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Enviar prueba
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Enviar correo de prueba</DialogTitle>
                <SendTestEmail
                  template={{
                    ...template,
                    id: template?.id || 0,
                    name,
                    description,
                    category,
                    status,
                    htmlContent: combinedPreview,
                  }}
                  onClose={() => setIsSendTestOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="md:col-span-2">
          <Dialog open={isAiModalOpen} onOpenChange={setIsAiModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="my-4">
                <Sparkles className="mr-2 h-4 w-4" />
                Generar con IA
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generar template con IA</DialogTitle>
                <DialogDescription>
                  Describe el tipo de email que necesitas y la IA generará un
                  template para ti.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="ai-prompt">Contexto para la generación</Label>
                <Textarea
                  id="ai-prompt"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ej: Un email de bienvenida para nuevos usuarios de una plataforma de streaming"
                  className="mt-2"
                  rows={5}
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAiModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={generateWithAI} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generar
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <div className="flex items-center justify-between mb-4">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-4">
                <TabsTrigger value="design">
                  <FileText className="mr-2 h-4 w-4" />
                  Vista previa
                </TabsTrigger>
                <TabsTrigger value="html">
                  <Code className="mr-2 h-4 w-4" />
                  HTML
                </TabsTrigger>
                <TabsTrigger value="css">
                  <Code className="mr-2 h-4 w-4" />
                  CSS
                </TabsTrigger>
              </TabsList>

              <TabsContent value="design">
                <div className="border rounded-md p-4 min-h-[500px] bg-white overflow-auto">
                  <div className="flex justify-end mb-4 space-x-2">
                    <Button
                      variant={
                        previewMode === "desktop" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setPreviewMode("desktop")}
                    >
                      Desktop
                    </Button>
                    <Button
                      variant={previewMode === "tablet" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPreviewMode("tablet")}
                    >
                      Tablet
                    </Button>
                    <Button
                      variant={previewMode === "mobile" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPreviewMode("mobile")}
                    >
                      Mobile
                    </Button>
                  </div>
                  <div
                    className={`mx-auto transition-all duration-300 ease-in-out overflow-auto border rounded shadow-sm`}
                    style={{
                      width:
                        previewMode === "desktop"
                          ? "100%"
                          : previewMode === "tablet"
                          ? "768px"
                          : "375px",
                      maxWidth: "100%",
                      height: "450px",
                    }}
                  >
                    <iframe
                      srcDoc={combinedPreview}
                      title="Email Preview"
                      className="w-full h-full border-0"
                      sandbox="allow-same-origin"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="html">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border rounded-md p-4 min-h-[500px] bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="html-editor">HTML</Label>
                    <div className="text-xs text-muted-foreground">
                      Usa <code>{"{{variable}}"}</code> para variables dinámicas
                    </div>
                  </div>
                  <Textarea
                    id="html-editor"
                    value={htmlContent}
                    onChange={(e) => setHtmlContent(e.target.value)}
                    className="min-h-[450px] max-h-[450px] font-mono text-sm bg-white"
                    spellCheck={false}
                  />
                </motion.div>
              </TabsContent>

              <TabsContent value="css">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border rounded-md p-4 min-h-[500px] bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="css-editor">CSS</Label>
                    <div className="text-xs text-muted-foreground">
                      Estos estilos se combinarán con los inline del HTML
                    </div>
                  </div>
                  <Textarea
                    id="css-editor"
                    value={cssContent}
                    onChange={(e) => setCssContent(e.target.value)}
                    className="min-h-[450px] font-mono text-sm bg-white"
                    spellCheck={false}
                  />
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
