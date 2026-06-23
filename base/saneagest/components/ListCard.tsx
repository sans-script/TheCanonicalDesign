"use client"

import React from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import type { LucideIcon } from "lucide-react"

interface ListCardProps {
  title: string
  subtitle: string
  status: string
  statusColor: string
  icon: LucideIcon
  iconColor: string
  iconBgColor: string
  actions: {
    label: string
    icon?: LucideIcon
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    className?: string
    onClick?: () => void
  }[]
  children: React.ReactNode
}

export function ListCard({
  title,
  subtitle,
  status,
  statusColor,
  icon: Icon,
  iconColor,
  iconBgColor,
  actions,
  children,
}: ListCardProps) {
  return (
    <Card className="p-6 border-grey-200 shadow-md hover:shadow-lg transition-shadow flex flex-col">
      {/* Header do Card */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`w-12 h-12 ${iconBgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-grey-900 text-lg truncate">{title}</h3>
            <p className="text-sm text-grey-600 truncate">{subtitle}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium flex-shrink-0 ${statusColor}`}>
          {status}
        </span>
      </div>

      {/* Conteúdo Detalhado */}
      <div className="flex-1 mb-4">{children}</div>

      {/* Ações */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-grey-200">
        {actions.map((action, index) => {
          const ActionIcon = action.icon
          return (
            <Button
              key={index}
              size="sm"
              variant={action.variant || "default"}
              onClick={action.onClick}
              className={`flex-1 ${action.className || ""}`}
            >
              {ActionIcon && <ActionIcon className="w-4 h-4 mr-2" />}
              {action.label}
            </Button>
          )
        })}
      </div>
    </Card>
  )
}