"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2, Key, Plus, Shield } from "lucide-react";
import { AwsCredentialsModal } from "@/aws/aws-credentials-modal";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Datos de ejemplo para usuarios IAM
const sampleIamUsers = [
  {
    id: 1,
    name: "Usuario Principal",
    accessKeyId: "AKIA*************EXP",
    region: "us-east-1",
    createdAt: "2023-10-15",
    isActive: true,
  },
  {
    id: 2,
    name: "Usuario Secundario",
    accessKeyId: "AKIA*************TRY",
    region: "eu-west-1",
    createdAt: "2023-11-20",
    isActive: false,
  },
];

export function IamUsersList() {
  const [users, setUsers] = useState(sampleIamUsers);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [, setSelectedUserId] = useState<number | null>(null);

  const handleEdit = (userId: number) => {
    setSelectedUserId(userId);
    setIsEditUserOpen(true);
  };

  const handleDelete = (userId: number) => {
    // Simulación de eliminación de usuario
    setUsers(users.filter((user) => user.id !== userId));
    toast("Usuario eliminado", {
      description: "El usuario IAM ha sido eliminado correctamente",
    });
  };

  const handleAddSuccess = () => {
    // Simulación de adición de nuevo usuario
    const newUser = {
      id: users.length + 1,
      name: "Nuevo Usuario",
      accessKeyId: "AKIA*************NEW",
      region: "us-west-2",
      createdAt: new Date().toISOString().split("T")[0],
      isActive: true,
    };
    setUsers([...users, newUser]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Usuarios IAM</h2>
        <Button onClick={() => setIsAddUserOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Añadir usuario
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {users.map((user) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center">
                      {user.name}
                      {user.isActive ? (
                        <Badge className="ml-2 bg-green-500">Activo</Badge>
                      ) : (
                        <Badge variant="outline" className="ml-2">
                          Inactivo
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>Región: {user.region}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Acciones</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(user.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Editar</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Eliminar</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Key className="mr-1 h-4 w-4" />
                    <span>Access Key: {user.accessKeyId}</span>
                  </div>
                  <div className="mt-1">Creado: {user.createdAt}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {users.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-12 text-center"
          >
            <Shield className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">
              No hay usuarios IAM configurados
            </h3>
            <p className="text-muted-foreground mt-2">
              Añade credenciales de AWS IAM para enviar correos con SES
            </p>
            <Button className="mt-4" onClick={() => setIsAddUserOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Añadir usuario
            </Button>
          </motion.div>
        )}
      </div>

      {/* Modal para añadir usuario IAM */}
      <AwsCredentialsModal
        open={isAddUserOpen}
        onOpenChange={setIsAddUserOpen}
        onSuccess={handleAddSuccess}
      />

      {/* Modal para editar usuario IAM (reutiliza el componente de añadir) */}
      <AwsCredentialsModal
        open={isEditUserOpen}
        onOpenChange={setIsEditUserOpen}
        onSuccess={() => {
          toast("Usuario actualizado", {
            description: "Las credenciales han sido actualizadas correctamente",
          });
        }}
      />
    </div>
  );
}
