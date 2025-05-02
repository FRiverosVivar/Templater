"use client";

import { useState } from "react";
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
} from "lucide-react";
import { TemplateEditor } from "@/email/templateEditor";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { TemplatePreview } from "@/email/templatePreview";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Datos de ejemplo
const templateData = [
  {
    id: 1,
    name: "Bienvenida",
    description: "Email de bienvenida para nuevos usuarios",
    category: "Onboarding",
    lastModified: "Hace 2 días",
    status: "active",
    storedIn: "aws",
  },
  {
    id: 2,
    name: "Recuperación de contraseña",
    description: "Email para recuperar contraseña",
    category: "Seguridad",
    lastModified: "Hace 1 semana",
    status: "active",
    storedIn: "aws",
  },
  {
    id: 3,
    name: "Confirmación de compra",
    description: "Confirmación de compra con detalles",
    category: "Transaccional",
    lastModified: "Hace 3 días",
    status: "draft",
    storedIn: "supabase",
  },
  {
    id: 4,
    name: "Newsletter mensual",
    description: "Newsletter con actualizaciones mensuales",
    category: "Marketing",
    lastModified: "Hace 2 semanas",
    status: "active",
    storedIn: "aws",
  },
  {
    id: 5,
    name: "Abandono de carrito",
    description: "Recordatorio de productos en carrito",
    category: "Marketing",
    lastModified: "Hace 5 días",
    status: "draft",
    storedIn: "supabase",
  },
  {
    id: 6,
    name: "Actualización de términos",
    description: "Notificación de cambios en términos",
    category: "Legal",
    lastModified: "Hace 1 mes",
    status: "inactive",
    storedIn: "supabase",
  },
];

interface TemplateListProps {
  searchQuery: string;
}

export function TemplateList({ searchQuery }: TemplateListProps) {
  const [templates, setTemplates] = useState(templateData);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  // Filtrar templates basados en la búsqueda y estado
  const filteredTemplates = templates.filter(
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
    setTemplates(templates.filter((template) => template.id !== id));
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
                  ? templates.find((t) => t.id === selectedTemplate)
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
              {templates.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center">
            <CloudCheck className="mr-2 h-4 w-4" />
            Activos (AWS)
            <Badge variant="secondary" className="ml-2">
              {templates.filter((t) => t.status === "active").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="drafts" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Borradores
            <Badge variant="secondary" className="ml-2">
              {templates.filter((t) => t.status === "draft").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="inactive" className="flex items-center">
            <CloudOff className="mr-2 h-4 w-4" />
            Inactivos
            <Badge variant="secondary" className="ml-2">
              {templates.filter((t) => t.status === "inactive").length}
            </Badge>
          </TabsTrigger>
        </TabsList>

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
                          {getStorageBadge(template.storedIn, template.status)}
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
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDelete(template.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Eliminar</span>
                          </DropdownMenuItem>
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

        {filteredTemplates.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-12 text-center"
          >
            <Mail className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No se encontraron templates</h3>
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
      </Tabs>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogTitle>Vista previa del template</DialogTitle>
          <TemplatePreview
            template={
              previewTemplate
                ? templates.find((t) => t.id === previewTemplate)
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
