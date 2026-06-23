"use client";

import { GSRMonitor } from "@/components/dashboard/GSRMonitor";
import { Brain } from "lucide-react";

export default function GSRPage() {
  return (
    <>
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
              Monitor GSR Neumann
            </h1>
            <p className="mt-1">
              Monitoramento psicofisiológico • Condutância da pele • Sensor
              biométrico Neumann
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-muted-foreground pb-1">
                Sensor Neumann Ativo
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* GSR Monitor Component */}
      <GSRMonitor />
    </>
  );
}
