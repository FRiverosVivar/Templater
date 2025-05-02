import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import supabase from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function SignUpForm() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [signUpError, setSignUpError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const signUp = async () => {
    setIsLoading(true);
    setSignUpError("");

    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
      });
      if (error) {
        setSignUpError(error.message);
      }

      if (data.user) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      setSignUpError("An error occurred while signing up.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to create to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button className="w-full" onClick={signUp}>
          {isLoading ? <Loader2 className="animate-spin" /> : "Sign Up"}
        </Button>
      </div>
    </div>
  );
}
