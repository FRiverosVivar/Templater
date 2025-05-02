"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SendTestEmail } from "@/email/sendTestEmail";

interface TemplatePreviewProps {
  template?: {
    id: number;
    name: string;
    description: string;
    category: string;
    status: string;
    htmlContent?: string;
  };
  onClose: () => void;
}

export function TemplatePreview({ template, onClose }: TemplatePreviewProps) {
  const [activeView, setActiveView] = useState("desktop");
  const [isSendTestOpen, setIsSendTestOpen] = useState(false);

  // HTML de ejemplo para la vista previa si no hay contenido
  const previewHtml =
    template?.htmlContent ||
    `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f5f5f5; padding: 20px; text-align: center;">
        <h1 style="color: #333;">Hola, {{nombre}}!</h1>
      </div>
      <div style="padding: 20px;">
        <p>Gracias por unirte a nuestra plataforma. Estamos emocionados de tenerte con nosotros.</p>
        <p>Tu cuenta ha sido creada exitosamente y ahora puedes comenzar a explorar todas las funcionalidades que ofrecemos.</p>
        <p>Si tienes alguna pregunta, no dudes en contactarnos respondiendo a este correo.</p>
        <div style="margin-top: 30px; text-align: center;">
          <a href="{{link_confirmacion}}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Confirmar cuenta</a>
        </div>
        <p style="margin-top: 30px; font-size: 12px; color: #777; text-align: center;">
          Este correo fue enviado a {{email}}. Si no solicitaste esta cuenta, puedes ignorar este mensaje.
        </p>
      </div>
      <div style="background-color: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
        <p>© 2023 Tu Empresa. Todos los derechos reservados.</p>
        <p>Dirección de la empresa, Ciudad, País</p>
      </div>
    </div>
  `;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {template?.name || "Vista previa"}
        </h3>
        <div className="flex space-x-2">
          <Dialog open={isSendTestOpen} onOpenChange={setIsSendTestOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Send className="mr-2 h-4 w-4" />
                Enviar prueba
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Enviar correo de prueba</DialogTitle>
              <SendTestEmail
                template={template}
                onClose={() => setIsSendTestOpen(false)}
              />
            </DialogContent>
          </Dialog>
          <Button onClick={onClose}>Cerrar</Button>
        </div>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        <TabsList className="mb-4 grid grid-cols-3 w-[300px]">
          <TabsTrigger value="desktop">Desktop</TabsTrigger>
          <TabsTrigger value="tablet">Tablet</TabsTrigger>
          <TabsTrigger value="mobile">Mobile</TabsTrigger>
        </TabsList>

        <TabsContent value="desktop">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border rounded-md p-4 bg-white overflow-auto"
            style={{ height: "600px", maxWidth: "800px", margin: "0 auto" }}
          >
            <iframe
              srcDoc={previewHtml}
              title="Email Preview - Desktop"
              className="w-full h-full border-0"
              sandbox="allow-same-origin"
            />
          </motion.div>
        </TabsContent>

        <TabsContent value="tablet">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border rounded-md p-4 bg-white overflow-auto"
            style={{ height: "600px", maxWidth: "600px", margin: "0 auto" }}
          >
            <iframe
              srcDoc={previewHtml}
              title="Email Preview - Tablet"
              className="w-full h-full border-0"
              sandbox="allow-same-origin"
            />
          </motion.div>
        </TabsContent>

        <TabsContent value="mobile">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border rounded-md p-4 bg-white overflow-auto"
            style={{ height: "600px", maxWidth: "375px", margin: "0 auto" }}
          >
            <iframe
              srcDoc={previewHtml}
              title="Email Preview - Mobile"
              className="w-full h-full border-0"
              sandbox="allow-same-origin"
            />
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
