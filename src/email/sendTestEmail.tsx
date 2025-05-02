"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, Plus, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface SendTestEmailProps {
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

export function SendTestEmail({ template, onClose }: SendTestEmailProps) {
  const [sender, setSender] = useState("tu@empresa.com");
  const [recipients, setRecipients] = useState("destinatario@ejemplo.com");
  const [subject, setSubject] = useState(template?.name || "Prueba de correo");

  // Extraer variables del template (simulado)
  const [templateVariables, setTemplateVariables] = useState<
    Array<{ key: string; value: string }>
  >([]);

  // Detectar variables en el template
  useEffect(() => {
    // Simulamos la extracción de variables de un template
    // En un caso real, esto vendría de analizar el HTML del template
    const defaultVariables = [
      { key: "nombre", value: "Usuario" },
      { key: "email", value: "usuario@ejemplo.com" },
      { key: "link_confirmacion", value: "https://tuempresa.com/confirmar" },
    ];

    setTemplateVariables(defaultVariables);
  }, [template]);

  // Añadir una nueva variable personalizada
  const addVariable = () => {
    setTemplateVariables([...templateVariables, { key: "", value: "" }]);
  };

  // Eliminar una variable
  const removeVariable = (index: number) => {
    const newVariables = [...templateVariables];
    newVariables.splice(index, 1);
    setTemplateVariables(newVariables);
  };

  // Actualizar una variable
  const updateVariable = (
    index: number,
    field: "key" | "value",
    newValue: string
  ) => {
    const newVariables = [...templateVariables];
    newVariables[index][field] = newValue;
    setTemplateVariables(newVariables);
  };

  // Enviar el correo de prueba
  const sendTestEmail = () => {
    // Aquí iría la lógica para enviar el correo
    toast.success(`Se ha enviado un correo de prueba a ${recipients}`);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 py-4"
    >
      <div className="space-y-2">
        <Label htmlFor="sender">Remitente</Label>
        <Input
          id="sender"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          placeholder="nombre@empresa.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="recipients">Destinatarios</Label>
        <Textarea
          id="recipients"
          value={recipients}
          onChange={(e) => setRecipients(e.target.value)}
          placeholder="Introduce los correos separados por comas"
          rows={2}
        />
        <p className="text-xs text-muted-foreground">
          Separa múltiples destinatarios con comas
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Asunto</Label>
        <Input
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Asunto del correo"
        />
      </div>

      <Separator className="my-4" />

      <div>
        <div className="flex justify-between items-center mb-2">
          <Label>Variables del template</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={addVariable}
            className="h-8"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Añadir variable
          </Button>
        </div>

        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
          {templateVariables.map((variable, index) => (
            <div key={index} className="flex gap-2 items-start">
              <div className="flex-1">
                <Input
                  value={variable.key}
                  onChange={(e) => updateVariable(index, "key", e.target.value)}
                  placeholder="Nombre de variable"
                  className="mb-1"
                />
                <Input
                  value={variable.value}
                  onChange={(e) =>
                    updateVariable(index, "value", e.target.value)
                  }
                  placeholder="Valor"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeVariable(index)}
                className="mt-1"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {templateVariables.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No se han detectado variables en este template
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={sendTestEmail}>
          <Send className="mr-2 h-4 w-4" />
          Enviar prueba
        </Button>
      </div>
    </motion.div>
  );
}
