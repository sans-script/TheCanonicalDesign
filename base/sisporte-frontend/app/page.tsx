"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff, Loader2, AlertCircle, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [isBanned, setIsBanned] = useState(false);
  const [banMessage, setBanMessage] = useState("");

  useEffect(() => {
    const checkBan = async () => {
      try {
        await authService.checkStatus();
        if (authService.isAuthenticated()) {
          router.push("/dashboard");
        } else {
          setIsChecking(false);
        }
      } catch (err: any) {
        if (err.response?.status === 403) {
          setIsBanned(true);
          setBanMessage(err.response?.data?.message || "");
        }
        setIsChecking(false);
      }
    };
    
    checkBan();
  }, [router]);

  const handleLogout = () => {
    authService.logout();
    setIsBanned(false);
    window.location.reload();
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isBanned && banMessage === "Acesso permanentemente bloqueado por segurança.") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 text-center">
        <div className="max-w-md w-full space-y-8">
          <div className="flex flex-col items-center space-y-6">
            <div className="bg-slate-200/50 p-6 rounded-full shadow-inner">
              <AlertCircle className="w-20 h-20 text-[#050656]" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold text-[#050656] tracking-tight">
                Acesso Bloqueado
              </h1>
              <div className="h-1 w-20 bg-[#050656]/20 mx-auto rounded-full" />
            </div>

            <p className="text-slate-600 font-medium leading-relaxed text-lg">
              Este dispositivo foi permanentemente banido do sistema devido a múltiplas tentativas de acesso suspeitas.
            </p>

            <div className="space-y-4 py-4">
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
                Por motivos de segurança, sua conexão foi encerrada. Se você acredita que isso foi um erro, entre em contato com o administrador da rede.
              </p>
              <p className="font-bold uppercase text-[10px] tracking-[0.2em] text-[#050656]/40">
                Protocolo de Segurança SISPORTE
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "E-mail é obrigatório";
    if (!password) newErrors.password = "Senha é obrigatória";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await authService.login({ email, password });
      router.push("/dashboard");
    } catch (err: any) {
      const backendMsg = err.response?.data?.message;
      let msg = "Credenciais inválidas. Verifique seu e-mail e senha.";
      
      if (backendMsg === "Invalid credentials") {
        msg = "Credenciais inválidas. Tente novamente.";
      } else if (backendMsg) {
        msg = backendMsg;
      }

      if (msg !== loginError) {
        setLoginError(msg);
      }

      if (msg === "Acesso permanentemente bloqueado por segurança.") {
        setIsBanned(true);
        setBanMessage(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#050656]">
        <Image
          src="/guardamunicipal.jpeg"
          alt="Guarda Municipal"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050656] via-[#050656]/40 to-transparent" />

        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white text-center">
          <div className="mb-8 p-4">
            <Image
              src="/brasaoguarda.png"
              alt="Brasão da Guarda Municipal"
              width={220}
              height={220}
              className="w-54 h-auto object-contain"
              style={{ width: "auto", height: "auto" }}
              priority
            />
          </div>
          <h1 className="text-4xl font-bold mb-4 tracking-tight [text-shadow:_0_0_20px_rgba(255,255,255,0.6)]">
            Guarda Municipal de São Luí­s
          </h1>
          <p className="text-xl text-white/80 max-w-sm leading-relaxed drop-shadow-md">
            Sistema de Identificação e Porte de Arma da Guarda Municipal
          </p>

          <div className="absolute bottom-8 text-white/40 text-sm">
            Prefeitura de São Luí­s - SEMUSC
          </div>
        </div>
      </div>

      {}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-4 sm:p-8 md:p-16 lg:p-24 bg-slate-50">
        <div className="w-full max-w-md space-y-8">
          {}
          <div className="lg:hidden text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/brasaoguarda.png"
                alt="Brasão da Guarda Municipal"
                width={64}
                height={64}
                className="w-16 h-auto"
                style={{ height: "auto" }}
              />
            </div>
            <h2 className="text-xl font-bold text-[#050656]">
              Guarda Municipal
            </h2>
            <p className="text-slate-500 text-sm">Acesso ao Sistema</p>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-[#050656] hidden lg:block">
              Acesse sua conta
            </h2>
            <p className="text-slate-500 hidden lg:block">
              Entre com suas credenciais para gerenciar o sistema
            </p>
          </div>

          <Card className="border-0 shadow-2xl bg-white lg:bg-transparent lg:shadow-none lg:p-0 overflow-hidden rounded-md py-0">
            <CardHeader className="p-0 lg:hidden overflow-hidden rounded-t-md">
              <div className="h-2 bg-gradient-to-r from-[#050656] to-[#3E4084]" />
            </CardHeader>
            <CardContent className="p-5 sm:p-8 lg:p-0">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex flex-col">
                  <label htmlFor="email" className="text-sm font-medium text-slate-700 ml-0.5 mb-1">
                    E-mail
                  </label>
                  <Input
                    id="email"
                    type="email"
                    maxLength={100}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    placeholder="seu@email.com.br"
                    className={cn(
                      "h-10 px-3 rounded-md border-slate-300 focus:border-primary focus:ring-0 transition-all bg-slate-50 shadow-sm",
                      errors.email && "border-red-500 focus:border-red-500 bg-red-50/30"
                    )}
                  />
                  <div className="min-h-[16px] mt-1">
                    {errors.email && (
                      <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block">
                        {errors.email}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center justify-between ml-0.5 mb-1">
                    <label htmlFor="password" className="text-sm font-medium text-slate-700">
                      Senha
                    </label>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      maxLength={50}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors({ ...errors, password: undefined });
                      }}
                      placeholder="••••••••"
                      className={cn(
                        "h-10 px-3 pr-10 rounded-md border-slate-300 focus:border-primary focus:ring-0 transition-all bg-slate-50 shadow-sm",
                        errors.password && "border-red-500 focus:border-red-500 bg-red-50/30"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-primary transition-colors"
                      title={showPassword ? "Ocultar senha" : "Exibir senha"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" strokeWidth={1.5} />
                      ) : (
                        <Eye className="h-4 w-4" strokeWidth={1.5} />
                      )}
                    </button>
                  </div>
                  <div className="min-h-[16px] mt-1">
                    {errors.password && (
                      <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block">
                        {errors.password}
                      </span>
                    )}
                  </div>
                </div>

                <div className="min-h-[85px] flex items-center">
                  {loginError && (
                    <div className="w-full flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                      <svg className="w-4 h-4 mt-0.5 shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">{loginError}</span>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full font-semibold"
                  disabled={isLoading}
                >
                  {isLoading && !loginError ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Aguarde...
                    </span>
                  ) : (
                    "Entrar no Sistema"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="pt-8 text-center border-t border-slate-200 lg:border-0 lg:pt-0 lg:text-left">
            <p className="text-xs text-slate-400 text-center">
              SEMUSC - Secretaria Municipal de Segurança com Cidadania
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

