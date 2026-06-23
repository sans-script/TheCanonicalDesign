'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      {...props}
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        ...props.toastOptions,
        classNames: {
          ...props.toastOptions?.classNames,
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg items-start py-4",
          title: "group-[.toast]:font-bold group-[.toast]:text-[15px] group-[.toast]:leading-none",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-[12px] mt-1.5 leading-relaxed",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      style={{
        '--normal-bg': 'var(--popover)',
        '--normal-text': 'var(--popover-foreground)',
        '--normal-border': 'var(--border)',
        '--toast-border-radius': '0.375rem',
        ...props.style,
      } as React.CSSProperties}
    />
  )
}

export { Toaster }
