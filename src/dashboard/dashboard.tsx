"use client";

import { useState, useEffect } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TemplateList } from "@/email/templateList";
import { TemplateStats } from "@/email/templateStats";
import { IamUsersList } from "@/aws/iam-users-list";
import { UserNav } from "@/email/userNav";
import {
  Mail,
  LayoutDashboard,
  Settings,
  Users,
  PieChart,
  Search,
  Key,
  Zap,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AwsCredentialsModal } from "@/aws/aws-credentials-modal";

export function EmailDashboard() {
  const [activeTab, setActiveTab] = useState("templates");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAwsModalOpen, setIsAwsModalOpen] = useState(false);
  const [hasCredentials, setHasCredentials] = useState(false);

  // Simular verificación de credenciales al cargar
  useEffect(() => {
    // Simular una llamada a la API para verificar si hay credenciales
    const checkCredentials = async () => {
      try {
        // Simulamos que no hay credenciales guardadas
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setHasCredentials(false);

        // Si no hay credenciales, mostramos el modal
        if (!hasCredentials) {
          setIsAwsModalOpen(true);
        }
      } catch (error) {
        console.error("Error al verificar credenciales:", error);
      }
    };

    checkCredentials();
  }, []);

  return (
    <>
      <SidebarProvider>
        <div className="flex h-screen w-full overflow-hidden bg-background">
          <Sidebar>
            <SidebarHeader className="flex flex-col gap-2 px-4 py-2">
              <div className="flex items-center gap-2 px-2">
                <div className="flex h-6 w-6 my-4 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <Zap className="size-4" />
                </div>
                templater.io
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar templates..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Principal</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeTab === "templates"}
                        onClick={() => setActiveTab("templates")}
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Templates</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeTab === "stats"}
                        onClick={() => setActiveTab("stats")}
                      >
                        <PieChart className="mr-2 h-4 w-4" />
                        <span>Estadísticas</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupLabel>Administración</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeTab === "iam"}
                        onClick={() => setActiveTab("iam")}
                      >
                        <Key className="mr-2 h-4 w-4" />
                        <span>Usuarios IAM</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <Users className="mr-2 h-4 w-4" />
                        <span>Usuarios</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Configuración</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-4">
              <div className="text-xs text-muted-foreground">
                MailMaster v1.0.0
              </div>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset className="flex flex-col">
            <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
              <SidebarTrigger />
              <div className="flex-1">
                <h1 className="text-lg font-semibold">
                  {activeTab === "templates"
                    ? "Gestión de Templates"
                    : activeTab === "stats"
                    ? "Estadísticas"
                    : activeTab === "iam"
                    ? "Gestión de Usuarios IAM"
                    : ""}
                </h1>
              </div>
              <UserNav />
            </header>
            <main className="flex-1 overflow-auto p-6">
              {activeTab === "templates" || activeTab === "stats" ? (
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="mb-6">
                    <TabsTrigger value="templates">Templates</TabsTrigger>
                    <TabsTrigger value="stats">Estadísticas</TabsTrigger>
                  </TabsList>
                  <TabsContent value="templates">
                    <TemplateList searchQuery={searchQuery} />
                  </TabsContent>
                  <TabsContent value="stats">
                    <TemplateStats />
                  </TabsContent>
                </Tabs>
              ) : activeTab === "iam" ? (
                <IamUsersList />
              ) : null}
            </main>
          </SidebarInset>
        </div>

        {/* Modal para configurar credenciales de AWS */}
        <AwsCredentialsModal
          open={isAwsModalOpen}
          onOpenChange={(open) => {
            // Solo permitimos cerrar el modal si ya hay credenciales
            if (!open && !hasCredentials) {
              return;
            }
            setIsAwsModalOpen(open);
          }}
          onSuccess={() => {
            setHasCredentials(true);
            setIsAwsModalOpen(false);
          }}
        />
      </SidebarProvider>
    </>
  );
}
