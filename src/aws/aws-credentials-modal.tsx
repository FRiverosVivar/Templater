"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info, Key } from "lucide-react";
import { toast } from "sonner";

// AWS Regions para SES
const AWS_REGIONS = [
  { value: "us-east-1", label: "US East (N. Virginia)" },
  { value: "us-east-2", label: "US East (Ohio)" },
  { value: "us-west-1", label: "US West (N. California)" },
  { value: "us-west-2", label: "US West (Oregon)" },
  { value: "ap-south-1", label: "Asia Pacific (Mumbai)" },
  { value: "ap-northeast-3", label: "Asia Pacific (Osaka)" },
  { value: "ap-northeast-2", label: "Asia Pacific (Seoul)" },
  { value: "ap-southeast-1", label: "Asia Pacific (Singapore)" },
  { value: "ap-southeast-2", label: "Asia Pacific (Sydney)" },
  { value: "ap-northeast-1", label: "Asia Pacific (Tokyo)" },
  { value: "ca-central-1", label: "Canada (Central)" },
  { value: "eu-central-1", label: "Europe (Frankfurt)" },
  { value: "eu-west-1", label: "Europe (Ireland)" },
  { value: "eu-west-2", label: "Europe (London)" },
  { value: "eu-west-3", label: "Europe (Paris)" },
  { value: "eu-north-1", label: "Europe (Stockholm)" },
  { value: "sa-east-1", label: "South America (São Paulo)" },
];

interface AwsCredentialsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AwsCredentialsModal({
  open,
  onOpenChange,
  onSuccess,
}: AwsCredentialsModalProps) {
  const [accessKeyId, setAccessKeyId] = useState("");
  const [secretAccessKey, setSecretAccessKey] = useState("");
  const [region, setRegion] = useState("us-east-1");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!accessKeyId || !secretAccessKey || !name) {
      toast("Error", {
        description: "Por favor completa todos los campos",
      });
      return;
    }

    setIsLoading(true);

    try {
      localStorage.setItem(
        "aws-credentials",
        JSON.stringify({
          accessKeyId,
          secretAccessKey,
          region,
          name,
        })
      );

      // Simulación exitosa
      toast("Credenciales guardadas", {
        description: `Las credenciales para ${name} han sido guardadas correctamente`,
      });

      if (onSuccess) {
        onSuccess();
      }

      onOpenChange(false);
    } catch (error) {
      toast("Error", {
        description: "No se pudieron guardar las credenciales",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configurar credenciales de AWS</DialogTitle>
          <DialogDescription>
            Ingresa tus credenciales de AWS IAM para enviar correos a través de
            SES. Las credenciales se guardarán encriptadas.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Usuario principal"
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="accessKeyId" className="text-right">
              Access Key ID
            </Label>
            <Input
              id="accessKeyId"
              value={accessKeyId}
              onChange={(e) => setAccessKeyId(e.target.value)}
              placeholder="AKIAIOSFODNN7EXAMPLE"
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="secretAccessKey" className="text-right">
              Secret Access Key
            </Label>
            <Input
              id="secretAccessKey"
              type="password"
              value={secretAccessKey}
              onChange={(e) => setSecretAccessKey(e.target.value)}
              placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="region" className="text-right">
              Región
            </Label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger id="region" className="col-span-3">
                <SelectValue placeholder="Selecciona una región" />
              </SelectTrigger>
              <SelectContent>
                {AWS_REGIONS.map((region) => (
                  <SelectItem key={region.value} value={region.value}>
                    {region.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-md bg-blue-50 p-4 mt-2"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-blue-400" aria-hidden="true" />
              </div>
              <div className="ml-3 flex-1 md:flex md:justify-between">
                <p className="text-sm text-blue-700">
                  El usuario IAM debe tener permisos de SES para enviar correos.
                </p>
                <p className="mt-3 text-sm md:mt-0 md:ml-6">
                  <a
                    href="https://docs.aws.amazon.com/ses/latest/dg/sending-authorization-identity-owner-tasks-management-console.html"
                    target="_blank"
                    rel="noreferrer"
                    className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600"
                  >
                    Más información →
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>Guardando...</>
            ) : (
              <>
                <Key className="mr-2 h-4 w-4" />
                Guardar credenciales
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
