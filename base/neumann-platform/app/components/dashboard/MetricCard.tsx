import {
  LucideIcon,
  TrendingUp,
  TrendingDown,
  Minus,
  HelpCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MetricCardProps {
  title: string;
  value: string;
  unit?: string;
  change?: number;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  description?: string;
  helpText?: string;
  className?: string;
  gradient?: boolean;
}

export function MetricCard({
  title,
  value,
  unit,
  change,
  changeType = "neutral",
  icon: Icon,
  description,
  helpText,
  className,
  gradient = false,
}: MetricCardProps) {
  const getTrendIcon = () => {
    switch (changeType) {
      case "positive":
        return <TrendingUp className="h-3 w-3" />;
      case "negative":
        return <TrendingDown className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  const getTrendColor = () => {
    switch (changeType) {
      case "positive":
        return "text-green-600";
      case "negative":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card
      className={cn(
        "transition-smooth hover:shadow-card border-0 shadow-card",
        gradient && "bg-gradient-to-br from-card to-muted/20",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {title}
          {helpText && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
                  <HelpCircle className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-xs">{helpText}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1">
            <div className="text-2xl font-bold">{value}</div>
            {unit && (
              <span className="text-sm text-muted-foreground">{unit}</span>
            )}
          </div>
          {change !== undefined && (
            <div
              className={cn("flex items-center gap-1 text-xs", getTrendColor())}
            >
              {getTrendIcon()}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
