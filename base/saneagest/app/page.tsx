"use client";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { User, Factory, ArrowRight, Code } from "lucide-react";

export default function DevProfileSelector() {
  const router = useRouter();

  const profiles = [
    {
      id: "produtor",
      name: "Produtor Rural",
      icon: User,
      route: "/produtor/overview",
      description:
        "Acesse como produtor rural para buscar e solicitar lodo tratado",
      color: "bg-primary-main",
      lightColor: "bg-primary-lighter",
    },
    {
      id: "gestor",
      name: "Gestor de ETE",
      icon: Factory,
      route: "/gestor/overview",
      description:
        "Acesse como gestor de ETE para gerenciar estações e atender solicitações",
      color: "bg-secondary-main",
      lightColor: "bg-secondary-lighter",
    },
  ];

  const handleProfileSelect = (route: string) => {
    router.push(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-grey-100 to-grey-200 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-warning-main flex items-center justify-center">
              <Code className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-grey-900">
              Seletor de Perfil
            </h1>
          </div>
          <p className="text-grey-600 max-w-2xl mx-auto">
            Selecione o perfil para acessar a aplicação.
          </p>
        </div>

        {/* Profile Cards - Layout Flex com larguras iguais */}
        <div className="flex flex-col md:flex-row gap-8 mb-8 justify-center">
          {profiles.map((profile) => {
            const Icon = profile.icon;
            return (
              <div
                key={profile.id}
                className="w-full md:w-[28rem] flex-shrink-0"
              >
                <Card className="h-full p-8 border-grey-200 shadow-lg hover:shadow-xl transition-all duration-300 group flex flex-col">
                  {/* Header do Card - altura fixa com alinhamento preciso */}
                  <div className="flex items-start gap-6 mb-6">
                    <div
                      className={`w-16 h-16 ${profile.color} rounded-xl flex items-center justify-center transition-colors duration-300 flex-shrink-0`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col justify-between h-16">
                      <h3 className="text-2xl font-bold text-grey-900 leading-tight">
                        {profile.name}
                      </h3>
                      <p className="text-grey-600 text-sm leading-tight mt-auto">
                        {profile.description}
                      </p>
                    </div>
                  </div>

                  {/* Espaçador flexível */}
                  <div className="flex-1 mb-8"></div>

                  {/* Button - altura fixa e largura igual */}
                  <div className="h-12">
                    <Button
                      onClick={() => handleProfileSelect(profile.route)}
                      className={`w-full h-full ${profile.color} ${
                        profile.id === "gestor"
                          ? "hover:bg-secondary-dark"
                          : "hover:bg-primary-dark"
                      } text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center`}
                    >
                      <span>Acessar como {profile.name}</span>
                      <ArrowRight className="w-5 h-5 ml-2 flex-shrink-0" />
                    </Button>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-grey-500">
            Selecione um perfil para continuar.
          </p>
        </div>
      </div>
    </div>
  );
}
