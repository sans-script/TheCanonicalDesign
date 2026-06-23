import { AlertTriangle, CheckCircle, XCircle, Clock, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  type: "critical" | "warning" | "info" | "success";
  title: string;
  description: string;
  employee?: string;
  time: string;
  confidence?: number;
}

interface AlertCardProps {
  alert: Alert;
  onAction?: (alertId: string, action: "view" | "dismiss" | "escalate") => void;
}

const alertConfig = {
  critical: {
    icon: XCircle,
    color: "text-[var(--color-error-main)]",
    bgColor:
      "bg-[var(--color-error-transparent-8)] border-[var(--color-error-transparent-16)]",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-[var(--color-warning-dark)]",
    bgColor:
      "bg-[var(--color-warning-transparent-8)] border-[var(--color-warning-transparent-16)]",
  },
  info: {
    icon: Info,
    color: "text-[var(--color-info-main)]",
    bgColor:
      "bg-[var(--color-info-transparent-8)] border-[var(--color-info-transparent-16)]",
  },
  success: {
    icon: CheckCircle,
    color: "text-[var(--color-success-main)]",
    bgColor:
      "bg-[var(--color-success-transparent-8)] border-[var(--color-success-transparent-16)]",
  },
};

export function AlertCard({ alert, onAction }: AlertCardProps) {
  const config = alertConfig[alert.type];
  const Icon = config.icon;

  const getHoverClasses = (type: string) => {
    switch (type) {
      case "critical":
        return "hover:bg-[var(--color-error-transparent-12)] hover:text-[var(--color-error-main)] hover:border-[var(--color-error-main)]";
      case "warning":
        return "hover:bg-[var(--color-warning-transparent-12)] hover:text-[var(--color-warning-dark)] hover:border-[var(--color-warning-dark)]";
      case "info":
        return "hover:bg-[var(--color-info-transparent-12)] hover:text-[var(--color-info-main)] hover:border-[var(--color-info-main)]";
      case "success":
        return "hover:bg-[var(--color-success-transparent-12)] hover:text-[var(--color-success-main)] hover:border-[var(--color-success-main)]";
      default:
        return "hover:bg-muted hover:text-foreground";
    }
  };

  const getBadgeClasses = (type: string) => {
    switch (type) {
      case "critical":
        return "bg-[var(--color-error-main)] text-white border-[var(--color-error-main)]";
      case "warning":
        return "bg-[var(--color-warning-dark)] text-white border-[var(--color-warning-dark)]";
      case "info":
        return "bg-[var(--color-info-main)] text-white border-[var(--color-info-main)]";
      case "success":
        return "bg-[var(--color-success-main)] text-white border-[var(--color-success-main)]";
      default:
        return "bg-muted text-muted-foreground border-muted";
    }
  };

  const getConfidenceBadgeClasses = (type: string) => {
    switch (type) {
      case "critical":
        return "border-[var(--color-error-main)] text-[var(--color-error-main)] bg-[var(--color-error-transparent-4)] hover:bg-[var(--color-error-transparent-8)]";
      case "warning":
        return "border-[var(--color-warning-main)] text-[var(--color-warning-main)] bg-[var(--color-warning-transparent-4)] hover:bg-[var(--color-warning-transparent-8)]";
      case "info":
        return "border-[var(--color-info-main)] text-[var(--color-info-main)] bg-[var(--color-info-transparent-4)] hover:bg-[var(--color-info-transparent-8)]";
      case "success":
        return "border-[var(--color-success-main)] text-[var(--color-success-main)] bg-[var(--color-success-transparent-4)] hover:bg-[var(--color-success-transparent-8)]";
      default:
        return "border-muted text-muted-foreground bg-muted/20 hover:bg-muted/40";
    }
  };

  return (
    <Card className={cn("transition-smooth hover:shadow-card", config.bgColor)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex justify-center flex-col gap-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Icon className={cn("h-5 w-5", config.color)} />
                {alert.title}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={cn("text-xs", getBadgeClasses(alert.type))}>
                  {alert.type.toUpperCase()}
                </Badge>
                {alert.confidence && (
                  <Badge
                    className={cn(
                      "text-xs",
                      getConfidenceBadgeClasses(alert.type)
                    )}
                  >
                    Confiança: {alert.confidence}%
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex pt-0.5 min-w-14 justify-start items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mt-0.5" />
            <span>Há {alert.time}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-foreground mb-2">{alert.description}</p>
        {alert.employee && (
          <p className="text-xs text-muted-foreground mb-3">
            Funcionário: <span className="font-medium">{alert.employee}</span>
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            className={cn(
              "border",
              getConfidenceBadgeClasses(alert.type),
              getHoverClasses(alert.type)
            )}
            onClick={() => onAction?.(alert.id, "view")}
          >
            Ver Detalhes
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className={getHoverClasses(alert.type)}
            onClick={() => onAction?.(alert.id, "dismiss")}
          >
            Dispensar
          </Button>
          {alert.type === "critical" && (
            <Button
              size="sm"
              variant="destructive"
              className="hover:bg-destructive/80"
              onClick={() => onAction?.(alert.id, "escalate")}
            >
              Escalar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
