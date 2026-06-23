import { Card } from "@/components/ui/Card"
import type { LucideIcon } from "lucide-react"

interface MetricCardProps {
  value: string
  label: string
  icon: LucideIcon
  iconColor: string
  iconBgColor: string
  trend?: string
  trendColor?: string
}

export function MetricCard({
  value,
  label,
  icon: Icon,
  iconColor,
  iconBgColor,
  trend,
  trendColor = "text-grey-400",
}: MetricCardProps) {
  return (
    <Card className="p-6 border-grey-200 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${iconBgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-grey-900 mb-1">{value}</p>
        <p className="text-sm text-grey-500 mb-2">{label}</p>
        {trend && <p className={`text-xs font-medium ${trendColor}`}>{trend}</p>}
      </div>
    </Card>
  )
}
