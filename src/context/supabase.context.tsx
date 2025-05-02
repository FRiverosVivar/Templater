import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { Session, User } from "@supabase/supabase-js";
import supabase from "@/lib/supabase";

// Definir tipos para el contexto
interface SupabaseAuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{
    error: Error | null;
    data: { user: User | null; session: Session | null } | null;
  }>;
  signOut: () => Promise<{ error: Error | null }>;
}

// Definir tipos para las props del provider
interface SupabaseAuthProviderProps {
  children: ReactNode;
  dashboardPath?: string; // Ruta a la que redirigir cuando hay sesión
  loginPath?: string; // Ruta a la que redirigir cuando no hay sesión (opcional)
  redirectOnSession?: boolean; // Si debe redirigir automáticamente cuando detecta sesión
}

// Crear el contexto
const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(
  undefined
);

// Hook para usar el contexto
export const useSupabaseAuth = (): SupabaseAuthContextType => {
  const context = useContext(SupabaseAuthContext);
  if (context === undefined) {
    throw new Error(
      "useSupabaseAuth debe ser usado dentro de un SupabaseAuthProvider"
    );
  }
  return context;
};

export const SupabaseAuthProvider = ({
  children,
  dashboardPath = "/dashboard",
  loginPath = "/login",
  redirectOnSession = true,
}: SupabaseAuthProviderProps) => {
  // Inicializar el cliente de Supabase

  // Estados para manejar la autenticación
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Para manejar redirecciones
  const navigate = useNavigate();

  // Función para iniciar sesión
  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  // Función para cerrar sesión
  const signOut = async () => {
    return await supabase.auth.signOut();
  };

  // Detectar cambios en la sesión
  useEffect(() => {
    // Obtener la sesión actual al cargar el componente
    const getInitialSession = async () => {
      setIsLoading(true);

      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user || null);

        // Redirigir al dashboard si hay sesión y está habilitada la redirección
        if (data.session && redirectOnSession) {
          navigate(dashboardPath);
        }
      } catch (error) {
        console.error("Error al obtener la sesión inicial:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Suscribirse a cambios en el estado de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user || null);

      if (event === "SIGNED_IN" && redirectOnSession) {
        navigate(dashboardPath);
      } else if (event === "SIGNED_OUT") {
        if (loginPath) {
          navigate(loginPath);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, navigate, dashboardPath, loginPath, redirectOnSession]);

  // Valor del contexto
  const value: SupabaseAuthContextType = {
    session,
    user,
    isLoading,
    signIn,
    signOut,
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};

export default SupabaseAuthProvider;
