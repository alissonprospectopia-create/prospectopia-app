import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2, Upload, AlertCircle } from "lucide-react";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";

export default function InviteSignup() {
  const [, params] = useRoute("/invite/:token");
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateInvite = trpc.invite.validate.useQuery(
    { token: params?.token || "" },
    { enabled: !!params?.token }
  );

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignup = async () => {
    if (!name.trim()) {
      toast({
        title: "Erro",
        description: "Digite seu nome",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // Armazenar dados temporários e redirecionar para login do Google
    sessionStorage.setItem("pendingEmployeeData", JSON.stringify({
      name,
      photo,
      inviteToken: params?.token,
    }));
    
    window.location.href = getLoginUrl();
  };

  if (!params?.token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <CardTitle>Link Inválido</CardTitle>
            <CardDescription>O link de convite não foi encontrado</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (validateInvite.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!validateInvite.data?.isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <CardTitle>Link Expirado</CardTitle>
            <CardDescription>Este link de convite não é mais válido</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Bem-vindo!</CardTitle>
          <CardDescription>Complete seu cadastro para começar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name">Seu Nome</Label>
            <Input
              id="name"
              placeholder="Digite seu nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSignup();
              }}
            />
          </div>

          {/* Foto */}
          <div className="space-y-2">
            <Label>Sua Foto</Label>
            <div className="flex items-center gap-4">
              {photo ? (
                <img
                  src={photo}
                  alt="Preview"
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="flex-1"
              />
            </div>
          </div>

          {/* Botão de Cadastro */}
          <Button
            onClick={handleSignup}
            disabled={isLoading}
            className="w-full h-12 text-base"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuar com Google
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Você será redirecionado para autenticar com sua conta Google
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
