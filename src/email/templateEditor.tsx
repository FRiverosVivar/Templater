"use client";

import { useState } from "react";
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
import { Save, Eye, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TemplatePreview } from "@/email/templatePreview";
import { SendTestEmail } from "@/email/sendTestEmail";

interface TemplateEditorProps {
  template?: {
    id: number;
    name: string;
    description: string;
    category: string;
    status: string;
  };
  onClose: () => void;
}

export function TemplateEditor({ template, onClose }: TemplateEditorProps) {
  const [activeTab, setActiveTab] = useState("design");
  const [name, setName] = useState(template?.name || "");
  const [description, setDescription] = useState(template?.description || "");
  const [category, setCategory] = useState(template?.category || "");
  const [status, setStatus] = useState(template?.status || "draft");
  const [htmlContent, setHtmlContent] = useState(
    "<h1>Hola, {{nombre}}!</h1><p>Bienvenido a nuestra plataforma.</p>"
  );

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSendTestOpen, setIsSendTestOpen] = useState(false);

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
          <Button>
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
                  template={template}
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
                  template={template}
                  onClose={() => setIsSendTestOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="md:col-span-2">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="design">Diseño</TabsTrigger>
              <TabsTrigger value="code">Código</TabsTrigger>
              <TabsTrigger value="preview">Vista previa</TabsTrigger>
            </TabsList>
            <TabsContent value="design">
              <div className="border rounded-md p-4 min-h-[400px]">
                <p className="text-muted-foreground text-center">
                  Aquí iría el editor visual de arrastrar y soltar
                </p>
              </div>
            </TabsContent>
            <TabsContent value="code">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border rounded-md p-4 min-h-[400px] font-mono text-sm"
              >
                <Textarea
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  className="min-h-[400px] font-mono"
                />
              </motion.div>
            </TabsContent>
            <TabsContent value="preview">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border rounded-md p-4 min-h-[400px] bg-white"
              >
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
