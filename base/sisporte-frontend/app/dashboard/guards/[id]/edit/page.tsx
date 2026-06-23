"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import { GuardForm } from "@/components/GuardForm";
import { guardsService } from "@/services/guards.service";
import { Loader2 } from "lucide-react";
import type { Guard } from "@/lib/types";

export default function EditGuardPage() {
  const params = useParams();
  const id = params.id as string;
  const [guard, setGuard] = useState<Guard | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadGuard() {
      try {
        const data = await guardsService.getById(id);
        setGuard(data);
      } catch (error) {
        console.error("Failed to load guard", error);
        setGuard(null);
      } finally {
        setIsLoading(false);
      }
    }
    if (id) loadGuard();
  }, [id]);

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#050656] mb-4" />
        <p className="text-sm font-bold text-[#050656] tracking-[0.2em] uppercase opacity-50">
          Carregando dados...
        </p>
      </div>
    );
  }

  if (!guard) {
    notFound();
  }

  return <GuardForm guard={guard} isEditing />;
}
