"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ServiceIdentityCard } from "@/components/ServiceIdentityCard";
import {
  Plus,
  Trash2,
  Pencil,
  FileText,
  X,
  Loader2,
  ShieldCheck,
  Award,
  Package,
  Save,
  Upload,
  Eye,
  Camera,
  RefreshCw,
  ZoomIn,
  Smartphone,
} from "lucide-react";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { guardsService } from "@/services/guards.service";
import { settingsService } from "@/services/settings.service";
import type { SignatureConfig } from "@/lib/types";
import { AuthenticatedImage } from "@/components/AuthenticatedImage";
import { SignatureDialog } from "@/components/SignatureDialog";

const isValidCPF = (cpf: string) => {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11 || /^(\d)\1+$/.test(digits)) return false;

  let sum = 0;
  for (let i = 1; i <= 9; i++)
    sum += parseInt(digits.substring(i - 1, i)) * (11 - i);
  let rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(digits.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++)
    sum += parseInt(digits.substring(i - 1, i)) * (12 - i);
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(digits.substring(10, 11))) return false;

  return true;
};

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import type {
  Guard,
  Certificate,
  Equipment,
  PsychologicalEvaluation,
} from "@/lib/types";
import Link from "next/link";
import { cn, formatDate } from "@/lib/utils";

interface GuardFormProps {
  guard?: Guard;
  isEditing?: boolean;
}

interface GuardFormData {
  name: string;
  registrationNumber: string;
  admissionDate: string;
  role: string;
  rank: string;
  cardIssuingPlace: string;
  cardIssuingDate: string;
  serial: string;
  sinarmNumber: string;
  expirationDate: string;
  birthPlace: string;
  state: string;
  birthDate: string;
  bloodType: string;
  rg: string;
  cpf: string;
  filiation1: string;
  filiation2: string;
  status: string;
  weaponCarryStatus: string;
  photoUrl: string;
  signatureUrl: string | null;
  signatureX?: number;
  signatureY?: number;
  signatureScale?: number;
  cep: string;
  address: string;
  emergencyContact: string;
  bootSize: string;
  shirtSize: string;
  notes: string;
}

const formatToDisplayDate = (dateStr: string | undefined | null): string => {
  if (!dateStr) return "";

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return dateStr;

  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    return `${day}/${month}/${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
};

const isExpired = (dateStr: string | undefined | null): boolean => {
  if (!dateStr) return false;

  let date: Date | null = null;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split("/").map(Number);
    date = new Date(year, month - 1, day);
  } else {
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      date = parsed;
    }
  }

  if (!date || isNaN(date.getTime())) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date < today;
};

export function GuardForm({ guard, isEditing = false }: GuardFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentGuard, setCurrentGuard] = useState<Guard | undefined>(guard);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSigDialogOpen, setIsSigDialogOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string) => {
    if (name === "cpf") {
      if (value && !isValidCPF(value)) {
        setErrors((prev) => ({ ...prev, cpf: "CPF inválido" }));
      } else {
        setErrors((prev) => {
          const { cpf, ...rest } = prev;
          return rest;
        });
      }
    } else if (name === "birthDate") {
      if (value && value.length !== 10) {
        setErrors((prev) => ({
          ...prev,
          birthDate: "Data inválida (DD/MM/AAAA)",
        }));
      } else {
        setErrors((prev) => {
          const { birthDate, ...rest } = prev;
          return rest;
        });
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
  };
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [initialFormData, setInitialFormData] = useState<GuardFormData | null>(
    null,
  );

  const [certModalOpen, setCertModalOpen] = useState(false);
  const [equipModalOpen, setEquipModalOpen] = useState(false);
  const [evalModalOpen, setEvalModalOpen] = useState(false);

  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [editingEquipId, setEditingEquipId] = useState<string | null>(null);
  const [editingEvalId, setEditingEvalId] = useState<string | null>(null);

  const [certErrors, setCertErrors] = useState<Record<string, string>>({});
  const [equipErrors, setEquipErrors] = useState<Record<string, string>>({});
  const [evalErrors, setEvalErrors] = useState<Record<string, string>>({});

  const [newCert, setNewCert] = useState({
    name: "",
    institution: "",
    startDate: "",
    date: "",
    expiryDate: "",
    documentUrl: "",
  });
  const [newEquip, setNewEquip] = useState({
    name: "",
    type: "",
    serialNumber: "",
  });
  const [newEval, setNewEval] = useState({
    title: "",
    evaluationDate: "",
    expirationDate: "",
    status: "fit" as "fit" | "unfit",
    evaluatorInfo: "",
    documentUrl: "",
  });
  const [otherType, setOtherType] = useState("");
  const [certFileName, setCertFileName] = useState("");
  const [evalFileName, setEvalFileName] = useState("");

  const [isDraggingCert, setIsDraggingCert] = useState(false);
  const [isDraggingEval, setIsDraggingEval] = useState(false);

  const certFileInputRef = useRef<HTMLInputElement>(null);
  const evalFileInputRef = useRef<HTMLInputElement>(null);

  const cardContainerRef = useRef<HTMLDivElement>(null);
  const [cardScale, setCardScale] = useState(1);

  useEffect(() => {
    const el = cardContainerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      const available = entry.contentRect.width;
      const scale = Math.min(available / 540, 1);
      setCardScale(scale);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const [sigConfig, setSigConfig] = useState<SignatureConfig | null>(null);

  useEffect(() => {
    settingsService.getSignature().then(setSigConfig).catch(() => setSigConfig(null));
  }, []);

  const [formData, setFormData] = useState<GuardFormData>(() => {
    const defaults: GuardFormData = {
      name: guard?.name || "",
      registrationNumber: guard?.registrationNumber || "",
      admissionDate: formatToDisplayDate(guard?.admissionDate),
      role: guard?.role || "GUARDA MUNICIPAL",
      rank: guard?.rank || "2º CL",
      cardIssuingPlace: guard?.cardIssuingPlace || "SÃO LUÍS",
      cardIssuingDate:
        formatToDisplayDate(guard?.cardIssuingDate) ||
        new Date().toLocaleDateString("pt-BR"),
      serial: guard?.serial || "",
      sinarmNumber: guard?.sinarmNumber || "",
      expirationDate: formatToDisplayDate(guard?.expirationDate),
      birthPlace: guard?.birthPlace || "",
      state: guard?.state || (isEditing ? "MA" : ""),
      birthDate: formatToDisplayDate(guard?.birthDate),
      bloodType: guard?.bloodType || "",
      rg: guard?.rg || "",
      cpf: guard?.cpf || "",
      filiation1: guard?.fatherName || "",
      filiation2: guard?.motherName || "",
      status: guard?.status || (isEditing ? "active" : ""),
      weaponCarryStatus: (guard as any)?.weaponCarryStatus || "inactive",
      photoUrl: guard?.photoUrl || "",
      signatureUrl: guard?.signatureUrl || null,
      signatureX: guard?.signatureX,
      signatureY: guard?.signatureY,
      signatureScale: guard?.signatureScale,
      cep: (guard as any)?.cep || "",
      address: guard?.address || "",
      emergencyContact: guard?.emergencyContact || "",
      bootSize: guard?.bootSize || "",
      shirtSize: guard?.shirtSize || "",
      notes: guard?.notes || "",
    };

    if (typeof window !== "undefined" && !isEditing) {
      const draft = localStorage.getItem("guardFormDraft");
      if (draft) {
        try {
          const parsed = JSON.parse(draft);

          if (parsed.rank === "3ª CL" || !parsed.rank) {
            parsed.rank = "2º CL";
          }
          return { ...defaults, ...parsed };
        } catch (e) {
          console.error("Erro ao carregar o rascunho do formulário", e);
        }
      }
    }
    return defaults;
  });

  useEffect(() => {
    if (guard && !initialFormData) {
      const initial: GuardFormData = {
        name: guard.name || "",
        registrationNumber: guard.registrationNumber || "",
        admissionDate: formatToDisplayDate(guard.admissionDate),
        role: guard.role || "GUARDA MUNICIPAL",
        rank: guard.rank || "2º CL",
        cardIssuingPlace: guard.cardIssuingPlace || "SÃO LUÍS",
        cardIssuingDate: formatToDisplayDate(guard.cardIssuingDate),
        serial: guard.serial || "",
        sinarmNumber: guard.sinarmNumber || "",
        expirationDate: formatToDisplayDate(guard.expirationDate),
        birthPlace: guard.birthPlace || "",
        state: guard.state || "",
        birthDate: formatToDisplayDate(guard.birthDate),
        bloodType: guard.bloodType || "",
        rg: guard.rg || "",
        cpf: guard.cpf || "",
        filiation1: guard.fatherName || "",
        filiation2: guard.motherName || "",
        status: guard.status || "",
        weaponCarryStatus: (guard as any).weaponCarryStatus || "inactive",
        photoUrl: guard?.photoUrl || "",
        signatureUrl: guard?.signatureUrl || null,
        signatureX: guard?.signatureX,
        signatureY: guard?.signatureY,
        signatureScale: guard?.signatureScale,
        cep: guard?.cep || "",
        address: guard.address || "",
        emergencyContact: guard.emergencyContact || "",
        bootSize: guard.bootSize || "",
        shirtSize: guard.shirtSize || "",
        notes: guard.notes || "",
      };
      setInitialFormData(initial);
    }
  }, [guard, initialFormData]);

  useEffect(() => {
    if (!isEditing && typeof window !== "undefined") {
      localStorage.setItem("guardFormDraft", JSON.stringify(formData));
    }
  }, [formData, isEditing]);

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<"user" | "environment">(
    "user",
  );
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  const applyDateMask = (value: string): string => {
    let v = value.replace(/\D/g, "").slice(0, 8);
    if (v.length >= 1) {
      const day = parseInt(v.slice(0, 2));
      if (day > 31) v = "31" + v.slice(2);
    }
    if (v.length >= 3) {
      const month = parseInt(v.slice(2, 4));
      if (month > 12) v = v.slice(0, 2) + "12" + v.slice(4);
    }
    if (v.length >= 5) return `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`;
    if (v.length >= 3) return `${v.slice(0, 2)}/${v.slice(2)}`;
    return v;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    let { name, value } = e.target;

    if (
      [
        "birthDate",
        "admissionDate",
        "expirationDate",
        "cardIssuingDate",
      ].includes(name)
    ) {
      value = applyDateMask(value);
    } else if (name === "cpf") {
      const digits = value.replace(/\D/g, "").slice(0, 11);
      if (digits.length > 9) {
        value = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
      } else if (digits.length > 6) {
        value = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
      } else if (digits.length > 3) {
        value = `${digits.slice(0, 3)}.${digits.slice(3)}`;
      } else {
        value = digits;
      }
    } else if (name === "registrationNumber") {
      const digits = value.replace(/\D/g, "").slice(0, 7);
      if (digits.length > 6) {
        value = `${digits.slice(0, 3)}.${digits.slice(3, 6)}-${digits.slice(6)}`;
      } else if (digits.length > 3) {
        value = `${digits.slice(0, 3)}.${digits.slice(3)}`;
      } else {
        value = digits;
      }
    } else if (name === "rg") {
      value = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    } else if (name === "cep") {
      const digits = value.replace(/\D/g, "").slice(0, 8);
      if (digits.length > 5) {
        value = `${digits.slice(0, 5)}-${digits.slice(5)}`;
      } else {
        value = digits;
      }
    } else if (
      [
        "name",
        "birthPlace",
        "filiation1",
        "filiation2",
        "role",
        "rank",
        "cardIssuingPlace",
        "sinarmNumber",
        "serial",
        "address",
        "emergencyContact",
      ].includes(name)
    ) {
      value = value.toUpperCase();
    }

    setFormData((prev: GuardFormData) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: GuardFormData) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCepBlur = async () => {
    const cep = formData.cep.replace(/\D/g, "");

    if (cep.length !== 8) {
      return;
    }

    setIsCepLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.ok) {
        throw new Error("CEP request failed");
      }

      const data = await response.json();

      if (data.erro) {
        toast.error("CEP não encontrado", {
          description: "Verifique o número informado e tente novamente.",
        });
        return;
      }

      const addressParts = [
        data.logradouro,
        data.bairro,
        data.localidade,
        data.uf,
        cep.replace(/(\d{5})(\d{3})/, "$1-$2"),
      ]
        .filter(Boolean)
        .join(", ");

      setFormData((prev: GuardFormData) => ({
        ...prev,
        address: addressParts || prev.address,
        state: data.uf || prev.state,
      }));
    } catch (error) {
      toast.error("Não foi possível consultar o CEP", {
        description: "Tente novamente em instantes.",
      });
    } finally {
      setIsCepLoading(false);
    }
  };

  const processCertFile = (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Apenas arquivos PDF são aceitos para certificados.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Arquivo muito grande (máximo 5MB)");
      return;
    }
    setCertFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewCert((prev) => ({
        ...prev,
        documentUrl: event.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const processEvalFile = (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Apenas arquivos PDF são aceitos para laudos.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Arquivo muito grande (máximo 5MB)");
      return;
    }
    setEvalFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewEval((prev) => ({
        ...prev,
        documentUrl: event.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const processPhotoFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Apenas arquivos de imagem são aceitos para a foto.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 550;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          setFormData((prev: GuardFormData) => ({
            ...prev,
            photoUrl: dataUrl,
          }));
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processPhotoFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processPhotoFile(file);
    }
  };

  const openCamera = async (facing: "user" | "environment" = cameraFacing) => {
    setCameraError(null);
    setIsCameraLoading(true);
    setIsCameraOpen(true);

    cameraStreamRef.current?.getTracks().forEach((t) => t.stop());
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      cameraStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch {
      setCameraError(
        "Não foi possível acessar a câmera. Verifique as permissões do navegador.",
      );
    } finally {
      setIsCameraLoading(false);
    }
  };

  const closeCamera = () => {
    cameraStreamRef.current?.getTracks().forEach((t) => t.stop());
    cameraStreamRef.current = null;
    setIsCameraOpen(false);
    setCameraError(null);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (cameraFacing === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], "camera-capture.jpg", {
          type: "image/jpeg",
        });
        processPhotoFile(file);
        closeCamera();
        toast.success("Foto capturada com sucesso!");
      },
      "image/jpeg",
      0.85,
    );
  };

  const toggleCameraFacing = () => {
    const next = cameraFacing === "user" ? "environment" : "user";
    setCameraFacing(next);
    openCamera(next);
  };

  const handleFocus = (side: "front" | "back") => {
    setIsFlipped(side === "back");
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const requiredFields = [
      { key: "name", label: "Nome completo" },
      { key: "registrationNumber", label: "Número de matrícula" },
      { key: "admissionDate", label: "Data de admissão" },
      { key: "birthPlace", label: "Naturalidade" },
      { key: "role", label: "Cargo" },
      { key: "rank", label: "Graduação" },
      { key: "birthDate", label: "Data de nascimento" },
      { key: "rg", label: "RG" },
      { key: "cpf", label: "CPF" },
      { key: "status", label: "Status" },
      { key: "filiation2", label: "Nome da mãe" },
      { key: "bloodType", label: "Tipo sanguíneo" },
      { key: "state", label: "UF" },
      { key: "sinarmNumber", label: "SINARM" },
      { key: "expirationDate", label: "Validade" },
      { key: "weaponCarryStatus", label: "Porte de arma" },
      { key: "cep", label: "CEP" },
      { key: "address", label: "Endereço" },
      { key: "photoUrl", label: "Foto 3x4" },
      { key: "signatureUrl", label: "Assinatura do Guarda" },
    ];

    requiredFields.forEach((field) => {
      const value = formData[field.key as keyof typeof formData];
      if (!value) {
        newErrors[field.key] = `${field.label} é obrigatório`;
      } else if (
        typeof value === "string" &&
        value.trim().length < 3 &&
        (field.key === "name" || field.key.startsWith("filiation"))
      ) {
        newErrors[field.key] =
          `${field.label} deve ter pelo menos 3 caracteres`;
      }
    });

    if (formData.cpf && !isValidCPF(formData.cpf)) {
      newErrors.cpf = "CPF inválido";
    }

    if (
      formData.registrationNumber &&
      formData.registrationNumber.replace(/\D/g, "").length < 5
    ) {
      newErrors.registrationNumber = "Matrícula muito curta";
    }

    if (formData.birthDate && formData.birthDate.length !== 10) {
      newErrors.birthDate = "Data de nascimento inválida (DD/MM/AAAA)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCertFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processCertFile(file);
  };

  const handleRemoveCertificate = async (certId: string) => {
    if (!currentGuard?.id) return;
    try {
      await guardsService.removeCertificate(currentGuard.id, certId);
      setCurrentGuard((prev) =>
        prev
          ? {
              ...prev,
              certificates: (prev.certificates || []).filter(
                (c) => c.id !== certId,
              ),
            }
          : undefined,
      );
      toast.success("Certificado removido");
    } catch (error) {
      toast.error("Erro ao remover certificado");
    }
  };

  const validateCertForm = () => {
    const newErrors: Record<string, string> = {};
    if (!newCert.name) newErrors.name = "Nome é obrigatório";
    if (!newCert.institution)
      newErrors.institution = "Instituição é obrigatória";
    if (!newCert.date) newErrors.date = "Data é obrigatória";
    setCertErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEquipForm = () => {
    const newErrors: Record<string, string> = {};
    if (!newEquip.name) newErrors.name = "Nome é obrigatório";
    if (!newEquip.type) newErrors.type = "Tipo é obrigatório";
    setEquipErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEvalForm = () => {
    const newErrors: Record<string, string> = {};
    if (!newEval.evaluationDate)
      newErrors.evaluationDate = "Data é obrigatória";
    if (!newEval.status) newErrors.status = "Status é obrigatório";
    setEvalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddEquipment = async () => {
    if (!currentGuard?.id) return;
    if (!validateEquipForm()) return;
    const finalType = newEquip.type === "OUTROS" ? otherType : newEquip.type;
    if (!newEquip.name || !finalType) return;

    setIsSubmitting(true);
    try {
      if (editingEquipId) {
        const existing = currentGuard?.equipments?.find(
          (e) => e.id === editingEquipId,
        );
        if (existing) {
          const hasChanged =
            existing.name !== newEquip.name ||
            existing.type !== finalType ||
            existing.serialNumber !== newEquip.serialNumber;

          if (!hasChanged) {
            toast.info("Nenhuma alteração no equipamento.");
            setEquipModalOpen(false);
            setIsSubmitting(false);
            return;
          }
        }
        await guardsService.updateEquipment(currentGuard.id, editingEquipId, {
          ...newEquip,
          type: finalType,
        });
        setCurrentGuard((prev) =>
          prev
            ? {
                ...prev,
                equipments: (prev.equipments || []).map((e) =>
                  e.id === editingEquipId
                    ? {
                        ...e,
                        name: newEquip.name,
                        type: finalType,
                        serialNumber: newEquip.serialNumber,
                      }
                    : e,
                ),
              }
            : undefined,
        );
        toast.success("Equipamento atualizado");
        setEditingEquipId(null);
      } else {
        const equip = await guardsService.addEquipment(currentGuard.id, {
          ...newEquip,
          type: finalType,
        });
        setCurrentGuard((prev) =>
          prev
            ? { ...prev, equipments: [...(prev.equipments || []), equip] }
            : undefined,
        );
        toast.success("Equipamento vinculado");
      }
      setEquipModalOpen(false);
      setNewEquip({ name: "", type: "", serialNumber: "" });
      setOtherType("");
    } catch (error) {
      toast.error(
        editingEquipId
          ? "Erro ao atualizar equipamento"
          : "Erro ao vincular equipamento",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveEquipment = async (equipId: string) => {
    if (!currentGuard?.id) return;
    try {
      await guardsService.removeEquipment(currentGuard.id, equipId);
      setCurrentGuard((prev) =>
        prev
          ? {
              ...prev,
              equipments: (prev.equipments || []).filter(
                (e) => e.id !== equipId,
              ),
            }
          : undefined,
      );
      toast.success("Equipamento removido");
    } catch (error) {
      toast.error("Erro ao remover equipamento");
    }
  };

  const handleEvalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processEvalFile(file);
  };

  const handleAddPsychologicalEvaluation = async () => {
    if (!currentGuard?.id) return;
    if (!validateEvalForm()) return;

    setIsSubmitting(true);
    try {
      if (editingEvalId) {
        const existing = currentGuard?.psychologicalEvaluations?.find(
          (e) => e.id === editingEvalId,
        );
        if (existing) {
          const hasChanged =
            existing.title !== newEval.title ||
            formatToDisplayDate(existing.evaluationDate) !==
              newEval.evaluationDate ||
            formatToDisplayDate(existing.expirationDate) !==
              newEval.expirationDate ||
            existing.status !== newEval.status ||
            existing.evaluatorInfo !== newEval.evaluatorInfo ||
            existing.documentUrl !== newEval.documentUrl;

          if (!hasChanged) {
            toast.info("Nenhuma alteração no laudo.");
            setEvalModalOpen(false);
            setIsSubmitting(false);
            return;
          }
        }
        await guardsService.updatePsychologicalEvaluation(
          currentGuard.id,
          editingEvalId,
          newEval,
        );
        setCurrentGuard((prev) =>
          prev
            ? {
                ...prev,
                psychologicalEvaluations: (
                  prev.psychologicalEvaluations || []
                ).map((e) =>
                  e.id === editingEvalId
                    ? { ...e, ...newEval, id: editingEvalId }
                    : e,
                ),
              }
            : undefined,
        );
        toast.success("Laudo atualizado");
        setEditingEvalId(null);
      } else {
        const evaluation = await guardsService.addPsychologicalEvaluation(
          currentGuard.id,
          newEval,
        );
        setCurrentGuard((prev) =>
          prev
            ? {
                ...prev,
                psychologicalEvaluations: [
                  ...(prev.psychologicalEvaluations || []),
                  evaluation,
                ],
              }
            : undefined,
        );
        toast.success("Laudo adicionado");
      }
      setEvalModalOpen(false);
      setNewEval({
        title: "",
        evaluationDate: "",
        expirationDate: "",
        status: "fit",
        evaluatorInfo: "",
        documentUrl: "",
      });
    } catch (error) {
      toast.error(
        editingEvalId ? "Erro ao atualizar laudo" : "Erro ao adicionar laudo",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemovePsychologicalEvaluation = async (evalId: string) => {
    if (!currentGuard?.id) return;
    try {
      await guardsService.removePsychologicalEvaluation(
        currentGuard.id,
        evalId,
      );
      setCurrentGuard((prev) =>
        prev
          ? {
              ...prev,
              psychologicalEvaluations: (
                prev.psychologicalEvaluations || []
              ).filter((e) => e.id !== evalId),
            }
          : undefined,
      );
      toast.success("Laudo removido");
    } catch (error) {
      toast.error("Erro ao remover laudo");
    }
  };

  const handleEditCertificate = (cert: Certificate) => {
    setEditingCertId(cert.id);
    setNewCert({
      name: cert.name,
      institution: cert.institution,
      startDate: formatToDisplayDate(cert.startDate),
      date: formatToDisplayDate(cert.date),
      expiryDate: formatToDisplayDate(cert.expiryDate),
      documentUrl: cert.documentUrl ?? "",
    });
    setCertFileName(cert.documentUrl ? "Documento já anexado" : "");
    setCertModalOpen(true);
  };

  const handleEditEquipment = (equip: Equipment) => {
    setEditingEquipId(equip.id);
    setNewEquip({
      name: equip.name,
      type: equip.type,
      serialNumber: equip.serialNumber ?? "",
    });
    setEquipModalOpen(true);
  };

  const handleEditPsychologicalEvaluation = (
    evalu: PsychologicalEvaluation,
  ) => {
    setEditingEvalId(evalu.id);
    setNewEval({
      title: evalu.title ?? "",
      evaluationDate: formatToDisplayDate(evalu.evaluationDate),
      expirationDate: formatToDisplayDate(evalu.expirationDate ?? ""),
      status: evalu.status,
      documentUrl: evalu.documentUrl ?? "",
      evaluatorInfo: evalu.evaluatorInfo ?? "",
    });
    setEvalFileName(evalu.documentUrl ? "Documento já anexado" : "");
    setEvalModalOpen(true);
  };

  const handleAddCertificate = async () => {
    if (!currentGuard?.id) return;
    if (!validateCertForm()) return;
    setIsSubmitting(true);
    try {
      if (editingCertId) {
        const existing = currentGuard?.certificates?.find(
          (c) => c.id === editingCertId,
        );
        if (existing) {
          const hasChanged =
            existing.name !== newCert.name ||
            existing.institution !== newCert.institution ||
            formatToDisplayDate(existing.startDate) !== newCert.startDate ||
            formatToDisplayDate(existing.date) !== newCert.date ||
            formatToDisplayDate(existing.expiryDate) !== newCert.expiryDate ||
            existing.documentUrl !== newCert.documentUrl;

          if (!hasChanged) {
            toast.info("Nenhuma alteração no certificado.");
            setCertModalOpen(false);
            setIsSubmitting(false);
            return;
          }
        }
        await guardsService.updateCertificate(
          currentGuard.id,
          editingCertId,
          newCert,
        );
        setCurrentGuard((prev) =>
          prev
            ? {
                ...prev,
                certificates: (prev.certificates || []).map((c) =>
                  c.id === editingCertId
                    ? { ...c, ...newCert, id: editingCertId }
                    : c,
                ),
              }
            : undefined,
        );
        toast.success("Certificado atualizado");
        setEditingCertId(null);
      } else {
        const cert = await guardsService.addCertificate(
          currentGuard.id,
          newCert,
        );
        setCurrentGuard((prev) =>
          prev
            ? { ...prev, certificates: [...(prev.certificates || []), cert] }
            : undefined,
        );
        toast.success("Certificado adicionado");
      }
      setCertModalOpen(false);
      setNewCert({
        name: "",
        institution: "",
        startDate: "",
        date: "",
        expiryDate: "",
        documentUrl: "",
      });
    } catch (error) {
      toast.error(
        editingCertId
          ? "Erro ao atualizar certificado"
          : "Erro ao adicionar certificado",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (isEditing && initialFormData) {
      const hasChanged = Object.keys(formData).some(
        (key) =>
          formData[key as keyof GuardFormData] !==
          initialFormData[key as keyof GuardFormData],
      );

      if (!hasChanged) {
        toast.info("Nenhuma alteração detectada.");
        router.push("/dashboard/guards");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const { filiation1, filiation2, ...rest } = formData;
      const payload = {
        ...rest,
        fatherName: filiation1 || null,
        motherName: filiation2 || null,
      };

      if (isEditing && guard?.id) {
        await guardsService.update(guard.id, payload as any);
        toast.success("Atualizado!", {
          description:
            "As informações do guarda foram atualizadas com sucesso.",
        });
      } else {
        await guardsService.create(payload as any);
        toast.success("Cadastrado!", {
          description: "O novo guarda municipal foi registrado no sistema.",
        });
        if (typeof window !== "undefined") {
          localStorage.removeItem("guardFormDraft");
        }
      }

      router.push("/dashboard/guards");
      router.refresh();
    } catch (error: any) {
      console.error("Submission error", error);
      toast.error("Erro no Envio", {
        description:
          error.response?.data?.message ||
          "Não foi possível salvar os dados. Tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-8">
          <div className="space-y-1.5">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/guards">
                    Guardas
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {isEditing ? "Editar Guarda" : "Novo Cadastro"}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-2xl font-bold text-primary">
              {isEditing ? "Editar Guarda" : "Novo Cadastro"}
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              {isEditing
                ? "Atualize as informações do guarda municipal"
                : "Preencha os dados abaixo para registrar um novo guarda"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard/guards">
              <Button
                type="button"
                variant="outline"
                className="h-11 px-6 text-sm font-bold border-slate-300 hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
              >
                CANCELAR
              </Button>
            </Link>
            <Button
              type="submit"
              data-testid="submit-button"
              className="bg-primary hover:bg-primary/90 h-11 px-8 text-sm font-bold shadow-md shadow-primary/20 transition-all cursor-pointer"
              disabled={isSubmitting}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting
                ? "SALVANDO..."
                : isEditing
                  ? "ATUALIZAR"
                  : "CADASTRAR"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_540px] gap-8 relative items-start">
          <div className="flex flex-col gap-6 min-w-0">
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-800">
                  Dados Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-x-4 gap-y-0 xl:grid-cols-2">
                  <div className="xl:col-span-2 flex flex-col">
                    <label
                      htmlFor="name"
                      className="text-sm font-semibold text-slate-600 mb-1"
                    >
                      Nome Completo *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onFocus={() => handleFocus("front")}
                      onChange={handleChange}
                      placeholder="NOME COMPLETO DO GUARDA"
                      maxLength={100}
                      className={cn(
                        "uppercase h-10 text-sm focus-visible:ring-primary",
                        errors.name &&
                          "border-red-500 focus-visible:ring-red-500 bg-red-50/50",
                      )}
                    />
                    <div className="mt-0.5 h-4 flex items-center">
                      {errors.name && (
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter block leading-none">
                          {errors.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="cpf"
                      className="text-sm font-semibold text-slate-600 mb-1"
                    >
                      CPF *
                    </label>
                    <Input
                      id="cpf"
                      name="cpf"
                      value={formData.cpf}
                      onFocus={() => handleFocus("back")}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="000.000.000-00"
                      maxLength={14}
                      className={cn(
                        "h-10 text-sm focus-visible:ring-primary",
                        errors.cpf &&
                          "border-red-500 focus-visible:ring-red-500 bg-red-50/50",
                      )}
                    />
                    <div className="mt-0.5 h-4 flex items-center">
                      {errors.cpf && (
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter block leading-none">
                          {errors.cpf}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="rg"
                      className="text-sm font-semibold text-slate-600 mb-1"
                    >
                      RG *
                    </label>
                    <Input
                      id="rg"
                      name="rg"
                      value={formData.rg}
                      onFocus={() => handleFocus("back")}
                      onChange={handleChange}
                      placeholder="000000000"
                      maxLength={15}
                      className={cn(
                        "h-10 text-sm focus-visible:ring-primary",
                        errors.rg &&
                          "border-red-500 focus-visible:ring-red-500 bg-red-50/50",
                      )}
                    />
                    <div className="mt-0.5 h-4 flex items-center">
                      {errors.rg && (
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter block leading-none">
                          {errors.rg}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="birthDate"
                      className="text-sm font-semibold text-slate-600 mb-1"
                    >
                      Data de Nascimento *
                    </label>
                    <Input
                      id="birthDate"
                      name="birthDate"
                      value={formData.birthDate}
                      onFocus={() => handleFocus("back")}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="DD/MM/AAAA"
                      maxLength={10}
                      className={cn(
                        "h-10 text-sm focus-visible:ring-primary",
                        errors.birthDate &&
                          "border-red-500 focus-visible:ring-red-500 bg-red-50/50",
                      )}
                    />
                    <div className="mt-0.5 h-4 flex items-center">
                      {errors.birthDate && (
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter block leading-none">
                          {errors.birthDate}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-600">
                      Tipo Sanguíneo *
                    </label>
                    <div className="flex flex-col">
                      <Select
                        value={formData.bloodType}
                        onValueChange={(v) =>
                          handleSelectChange("bloodType", v)
                        }
                      >
                        <SelectTrigger
                          className={cn(
                            "w-full h-10 border-slate-300 bg-slate-50 shadow-sm focus:border-primary focus:ring-0 text-[13px] sm:text-sm",
                            errors.bloodType &&
                              "border-red-500 focus:border-red-500 bg-red-50/50",
                          )}
                          onFocus={() => handleFocus("back")}
                        >
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="mt-0.5 h-4 flex items-center">
                        {errors.bloodType && (
                          <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter block leading-none">
                            {errors.bloodType}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="birthPlace"
                      className="text-sm font-semibold text-slate-600 mb-1"
                    >
                      Naturalidade *
                    </label>
                    <Input
                      id="birthPlace"
                      name="birthPlace"
                      value={formData.birthPlace}
                      onFocus={() => handleFocus("back")}
                      onChange={handleChange}
                      placeholder="CIDADE"
                      maxLength={50}
                      className={cn(
                        "uppercase h-10 text-sm focus-visible:ring-primary",
                        errors.birthPlace &&
                          "border-red-500 focus-visible:ring-red-500 bg-red-50/50",
                      )}
                    />
                    <div className="mt-0.5 h-4 flex items-center">
                      {errors.birthPlace && (
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter block leading-none">
                          {errors.birthPlace}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-slate-600 mb-1">
                      UF *
                    </label>
                    <Select
                      value={formData.state}
                      onValueChange={(v) => handleSelectChange("state", v)}
                    >
                      <SelectTrigger
                        className={cn(
                          "w-full h-10 border-slate-300 bg-slate-50 shadow-sm focus:border-primary focus:ring-0",
                          errors.state &&
                            "border-red-500 focus:border-red-500 bg-red-50/50",
                        )}
                        onFocus={() => handleFocus("back")}
                      >
                        <SelectValue placeholder="UF" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "AC",
                          "AL",
                          "AP",
                          "AM",
                          "BA",
                          "CE",
                          "DF",
                          "ES",
                          "GO",
                          "MA",
                          "MT",
                          "MS",
                          "MG",
                          "PA",
                          "PB",
                          "PR",
                          "PE",
                          "PI",
                          "RJ",
                          "RN",
                          "RS",
                          "RO",
                          "RR",
                          "SC",
                          "SP",
                          "SE",
                          "TO",
                        ].map((uf) => (
                          <SelectItem key={uf} value={uf}>
                            {uf}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="mt-0.5 h-4 flex items-center">
                      {errors.state && (
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter block leading-none">
                          {errors.state}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="xl:col-span-2">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-4">
                      <div className="flex flex-col">
                        <label
                          htmlFor="filiation2"
                          className="text-sm font-semibold text-slate-600 mb-1"
                        >
                          Nome da Mãe *
                        </label>
                        <Input
                          id="filiation2"
                          name="filiation2"
                          value={formData.filiation2}
                          onFocus={() => handleFocus("back")}
                          onChange={handleChange}
                          placeholder="NOME DA MÃE"
                          maxLength={100}
                          className={cn(
                            "uppercase h-10 text-sm focus-visible:ring-primary",
                            errors.filiation2 &&
                              "border-red-500 focus-visible:ring-red-500 bg-red-50/50",
                          )}
                        />
                        <div className="mt-0.5 h-4 flex items-center">
                          {errors.filiation2 && (
                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter block leading-none">
                              {errors.filiation2}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label
                          htmlFor="filiation1"
                          className="text-sm font-semibold text-slate-600 mb-1"
                        >
                          Nome do Pai
                        </label>
                        <Input
                          id="filiation1"
                          name="filiation1"
                          value={formData.filiation1}
                          onFocus={() => handleFocus("back")}
                          onChange={handleChange}
                          placeholder="NOME DO PAI"
                          maxLength={100}
                          className={cn(
                            "uppercase h-10 text-sm focus-visible:ring-primary",
                            errors.filiation1 &&
                              "border-red-500 focus-visible:ring-red-500 bg-red-50/50",
                          )}
                        />
                        <div className="mt-0.5 h-4 flex items-center">
                          {errors.filiation1 && (
                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter block leading-none">
                              {errors.filiation1}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="xl:col-span-2 grid grid-cols-1 xl:grid-cols-4 gap-4">
                    <div className="flex flex-col xl:col-span-1">
                      <div className="flex items-center gap-2 mb-1">
                        <label
                          htmlFor="cep"
                          className="text-sm font-semibold text-slate-600"
                        >
                          CEP *
                        </label>
                        {isCepLoading && (
                          <Loader2 className="w-4 h-4 text-primary animate-spin" />
                        )}
                      </div>
                      <Input
                        id="cep"
                        name="cep"
                        value={formData.cep}
                        onChange={handleChange}
                        onBlur={handleCepBlur}
                        placeholder="00000-000"
                        maxLength={9}
                        className={cn(
                          "h-10 text-sm focus-visible:ring-primary",
                          errors.cep &&
                            "border-red-500 focus-visible:ring-red-500 bg-red-50/50",
                        )}
                      />
                      <div className="mt-0.5 h-4 flex items-center">
                        {errors.cep && (
                          <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter block leading-none">
                            {errors.cep}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col xl:col-span-3">
                      <label
                        htmlFor="address"
                        className="text-sm font-semibold text-slate-600 mb-1"
                      >
                        Endereço Completo *
                      </label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="RUA, NÚMERO, BAIRRO, CIDADE - UF"
                        maxLength={80}
                        className={cn(
                          "h-10 text-sm focus-visible:ring-primary uppercase",
                          errors.address &&
                            "border-red-500 focus-visible:ring-red-500 bg-red-50/50",
                        )}
                      />
                      <div className="mt-0.5 h-4 flex items-center">
                        {errors.address && (
                          <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter block leading-none">
                            {errors.address}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-800">
                  Dados Funcionais e da Carteira
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-x-4 gap-y-0 sm:grid-cols-2 xl:grid-cols-3">
                  <div className="flex flex-col">
                    <label
                      htmlFor="registrationNumber"
                      className="text-sm font-semibold text-slate-600 mb-1"
                    >
                      Matrícula *
                    </label>
                    <Input
                      id="registrationNumber"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onFocus={() => handleFocus("front")}
                      onChange={handleChange}
                      placeholder="000.000-0"
                      maxLength={11}
                      className={cn(
                        "h-10 text-sm focus-visible:ring-primary",
                        errors.registrationNumber &&
                          "border-red-500 focus-visible:ring-red-500 bg-red-50/50",
                      )}
                    />
                    <div className="mt-0.5 h-4 flex items-center">
                      {errors.registrationNumber && (
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter block leading-none">
                          {errors.registrationNumber}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-slate-600 mb-1">
                      Data de Admissão *
                    </label>
                    <Input
                      name="admissionDate"
                      value={formData.admissionDate}
                      onFocus={() => handleFocus("front")}
                      onChange={handleChange}
                      placeholder="DD/MM/AAAA"
                      maxLength={10}
                      className={cn(
                        "h-10 text-sm focus-visible:ring-primary",
                        errors.admissionDate &&
                          "border-red-500 focus-visible:ring-red-500 bg-red-50/50",
                      )}
                    />
                    <div className="mt-0.5 h-4 flex items-center">
                      {errors.admissionDate && (
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter block leading-none">
                          {errors.admissionDate}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-slate-600 mb-1">
                      Função
                    </label>
                    <Select
                      value={formData.role}
                      onValueChange={(v) => handleSelectChange("role", v)}
                    >
                      <SelectTrigger
                        className={cn(
                          "w-full h-10 border-slate-300 bg-slate-50 shadow-sm focus:border-primary focus:ring-0",
                          errors.role &&
                            "border-red-500 focus:border-primary focus:ring-0 bg-red-50/50",
                        )}
                        onFocus={() => handleFocus("front")}
                      >
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GUARDA MUNICIPAL">
                          GUARDA MUNICIPAL
                        </SelectItem>
                        <SelectItem value="INSPETOR">INSPETOR</SelectItem>
                        <SelectItem value="SUBINSPETOR">SUBINSPETOR</SelectItem>
                        <SelectItem value="CORREGEDOR">CORREGEDOR</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="mt-0.5 h-4 flex items-center">
                      {errors.role && (
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter block leading-none">
                          {errors.role}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-slate-600 mb-1">
                      Classe
                    </label>
                    <Select
                      value={formData.rank}
                      onValueChange={(v) => handleSelectChange("rank", v)}
                    >
                      <SelectTrigger
                        className={cn(
                          "w-full h-10 border-slate-300 bg-slate-50 shadow-sm focus:border-primary focus:ring-0",
                          errors.rank &&
                            "border-red-500 focus-visible:ring-red-500 bg-red-50/50",
                        )}
                        onFocus={() => handleFocus("front")}
                      >
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2º CL">2º CL (2ª Classe)</SelectItem>
                        <SelectItem value="1º CL">1º CL (1ª Classe)</SelectItem>
                        <SelectItem value="CDA">
                          CDA (Classe Distinta A)
                        </SelectItem>
                        <SelectItem value="CDB">
                          CDB (Classe Distinta B)
                        </SelectItem>
                        <SelectItem value="SUB INSP">
                          SUB INSP (Subinspetor)
                        </SelectItem>
                        <SelectItem value="INSP 2º CL">
                          INSP 2º CL (Inspetor 2ª Classe)
                        </SelectItem>
                        <SelectItem value="INSP 1º CL">
                          INSP 1º CL (Inspetor 1ª Classe)
                        </SelectItem>
                        <SelectItem value="INSP REG">
                          INSP REG (Inspetor Regional)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="mt-0.5 h-4 flex items-center">
                      {errors.rank && (
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter block leading-none">
                          {errors.rank}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-slate-600 mb-1">
                      Status *
                    </label>
                    <Select
                      value={formData.status}
                      onValueChange={(v) => handleSelectChange("status", v)}
                    >
                      <SelectTrigger
                        className={cn(
                          "w-full h-10 border-slate-300 bg-slate-50 shadow-sm focus:border-primary focus:ring-0",
                          errors.status &&
                            "border-red-500 focus-visible:ring-red-500 bg-red-50/50",
                        )}
                        onFocus={() => handleFocus("front")}
                      >
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                        <SelectItem value="onLeave">Afastado</SelectItem>
                        <SelectItem value="retired">Aposentado</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="mt-0.5 h-4 flex items-center">
                      {errors.status && (
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter block leading-none">
                          {errors.status}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-slate-600 mb-1">
                      Porte de Arma *
                    </label>
                    <Select
                      value={formData.weaponCarryStatus}
                      onValueChange={(v) =>
                        handleSelectChange("weaponCarryStatus", v)
                      }
                    >
                      <SelectTrigger
                        className={cn(
                          "w-full h-10 border-slate-300 bg-slate-50 shadow-sm focus:border-primary focus:ring-0 cursor-pointer",
                          errors.weaponCarryStatus &&
                            "border-red-500 focus-visible:ring-red-500 bg-red-50/50",
                        )}
                        onFocus={() => handleFocus("back")}
                      >
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="mt-0.5 h-4 flex items-center">
                      {errors.weaponCarryStatus && (
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter block leading-none">
                          {errors.weaponCarryStatus}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="serial"
                      className="text-sm font-semibold text-slate-600 mb-1"
                    >
                      Serial
                    </label>
                    <Input
                      id="serial"
                      name="serial"
                      value={formData.serial || "Gerado automaticamente"}
                      readOnly
                      disabled
                      className={cn(
                        "h-10 text-sm focus-visible:ring-primary uppercase bg-slate-100 text-slate-500 cursor-not-allowed",
                        errors.serial &&
                          "border-red-500 focus-visible:ring-red-500 bg-red-50/50",
                      )}
                    />
                    <div className="mt-0.5 h-4 flex items-center">
                      {errors.serial && (
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter block leading-none">
                          {errors.serial}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="sinarmNumber"
                      className="text-sm font-semibold text-slate-600 mb-1"
                    >
                      Nº SINARM *
                    </label>
                    <Input
                      id="sinarmNumber"
                      name="sinarmNumber"
                      value={formData.sinarmNumber}
                      onFocus={() => handleFocus("back")}
                      onChange={handleChange}
                      placeholder="000000"
                      maxLength={20}
                      className={cn(
                        "h-10 text-sm focus-visible:ring-primary",
                        errors.sinarmNumber &&
                          "border-red-500 focus-visible:ring-red-500 bg-red-50/50",
                      )}
                    />
                    <div className="mt-0.5 h-4 flex items-center">
                      {errors.sinarmNumber && (
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter block leading-none">
                          {errors.sinarmNumber}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-slate-600 mb-1">
                      Validade do Porte *
                    </label>
                    <Input
                      name="expirationDate"
                      value={formData.expirationDate}
                      onFocus={() => handleFocus("back")}
                      onChange={handleChange}
                      placeholder="DD/MM/AAAA"
                      maxLength={10}
                      className={cn(
                        "h-10 text-sm focus-visible:ring-primary",
                        errors.expirationDate &&
                          "border-red-500 focus-visible:ring-red-500 bg-red-50/50",
                      )}
                    />
                    <div className="mt-0.5 h-4 flex items-center">
                      {errors.expirationDate && (
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter block leading-none">
                          {errors.expirationDate}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:col-span-2 xl:col-span-3 pt-2 w-full">
                    <label
                      htmlFor="notes"
                      className="text-sm font-semibold text-slate-600 mb-1"
                    >
                      Observações
                    </label>
                    <Textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Observações sobre o guarda..."
                      maxLength={500}
                      className="min-h-[100px] max-w-full text-sm focus-visible:ring-primary bg-white border-slate-300 shadow-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 pt-2">
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Certificados
                  </CardTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-primary hover:bg-primary/10"
                    onClick={() => setCertModalOpen(true)}
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Adicionar
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {currentGuard?.certificates &&
                    currentGuard.certificates.length > 0 ? (
                      currentGuard.certificates.map((cert) => (
                        <div
                          key={cert.id}
                          onClick={() => handleEditCertificate(cert)}
                          className="group flex justify-between items-start p-2.5 min-h-27.5 rounded-md border border-slate-200 bg-white shadow-sm hover:border-primary/50 hover:bg-slate-50 transition-all cursor-pointer"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start gap-2">
                              <p className="text-[13px] font-bold text-slate-900 uppercase truncate">
                                {cert.name}
                              </p>
                              {isExpired(cert.expiryDate) && (
                                <span className="mt-0.5 inline-flex items-center rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-tight text-white shadow-sm shadow-rose-500/20">
                                  VENCIDO
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 uppercase">
                              {cert.institution} • {formatDate(cert.date)}
                            </p>
                            {cert.expiryDate && (
                              <p className="text-[11px] text-slate-400 uppercase">
                                Validade: {formatDate(cert.expiryDate)}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            {cert.documentUrl && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-slate-400 hover:text-primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(cert.documentUrl!, "_blank");
                                }}
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                            )}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-slate-400 hover:text-primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditCertificate(cert);
                              }}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-slate-300 hover:text-rose-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveCertificate(cert.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic text-center py-4">
                        Nenhum certificado registrado
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    Equipamentos
                  </CardTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-primary hover:bg-primary/10"
                    onClick={() => setEquipModalOpen(true)}
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Vincular
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {currentGuard?.equipments &&
                    currentGuard.equipments.length > 0 ? (
                      currentGuard.equipments.map((equip) => (
                        <div
                          key={equip.id}
                          onClick={() => handleEditEquipment(equip)}
                          className="group flex justify-between items-start p-2.5 min-h-27.5 rounded-md border border-slate-200 bg-white shadow-sm hover:border-primary/50 hover:bg-slate-50 transition-all cursor-pointer"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-bold text-slate-900 uppercase truncate">
                              {equip.name}
                            </p>
                            <p className="text-[11px] text-slate-500 uppercase">
                              {equip.type}
                              {equip.serialNumber
                                ? ` • S/N: ${equip.serialNumber}`
                                : ""}
                            </p>
                          </div>
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-slate-400 hover:text-primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditEquipment(equip);
                              }}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-slate-300 hover:text-rose-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveEquipment(equip.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic text-center py-4">
                        Nenhum equipamento vinculado
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    Laudos Psicológicos
                  </CardTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-primary hover:bg-primary/10"
                    onClick={() => setEvalModalOpen(true)}
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Adicionar
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {currentGuard?.psychologicalEvaluations &&
                    currentGuard.psychologicalEvaluations.length > 0 ? (
                      currentGuard.psychologicalEvaluations.map((evalu) => (
                        <div
                          key={evalu.id}
                          onClick={() =>
                            handleEditPsychologicalEvaluation(evalu)
                          }
                          className="group flex justify-between items-start p-2.5 min-h-27.5 rounded-md border border-slate-200 bg-white shadow-sm hover:border-primary/50 hover:bg-slate-50 transition-all cursor-pointer"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start gap-2">
                              <p className="text-[13px] font-bold text-slate-900 uppercase truncate">
                                {evalu.title ||
                                  `Laudo de ${formatDate(evalu.evaluationDate)}`}
                              </p>
                              {isExpired(evalu.expirationDate) && (
                                <span className="mt-0.5 inline-flex items-center rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-tight text-white shadow-sm shadow-rose-500/20">
                                  VENCIDO
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col gap-1 mt-1">
                              <div className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    "text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-tight",
                                    evalu.status === "fit"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : "bg-rose-100 text-rose-700",
                                  )}
                                >
                                  {evalu.status === "fit" ? "Apto" : "Inapto"}
                                </span>
                                {isExpired(evalu.expirationDate) && (
                                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-tight bg-rose-500 text-white shadow-sm shadow-rose-500/20">
                                    VENCIDO
                                  </span>
                                )}
                                {evalu.expirationDate && (
                                  <p className="text-[11px] text-slate-400 uppercase">
                                    Validade: {formatDate(evalu.expirationDate)}
                                  </p>
                                )}
                              </div>
                              {evalu.evaluatorInfo && (
                                <p className="text-[11px] text-slate-400 uppercase line-clamp-1">
                                  {evalu.evaluatorInfo}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            {evalu.documentUrl && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-slate-400 hover:text-primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(evalu.documentUrl!, "_blank");
                                }}
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                            )}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-slate-400 hover:text-primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditPsychologicalEvaluation(evalu);
                              }}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-slate-300 hover:text-rose-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemovePsychologicalEvaluation(evalu.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic text-center py-4">
                        Nenhum laudo registrado
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="hidden md:flex flex-col gap-7 md:sticky md:top-6 self-start">
            <div
              ref={cardContainerRef}
              className="w-full max-w-full flex justify-center min-h-[360px] overflow-visible"
            >
              <ServiceIdentityCard
                data={{
                  ...formData,
                  filiation: {
                    fatherName: formData.filiation1,
                    motherName: formData.filiation2,
                  },
                  cardIssuingPlace: "SÃO LUÍS-MA",
                  serverSignatureUrl: formData.signatureUrl,
                  serverSignatureX: formData.signatureX,
                  serverSignatureY: formData.signatureY,
                  serverSignatureScale: formData.signatureScale,
                  signatureUrl: sigConfig?.signatureUrl,
                  signatureX: sigConfig?.x,
                  signatureY: sigConfig?.y,
                  signatureScale: sigConfig?.scale,
                  qrCodeUrl: guard?.token
                    ? `https://sisporte.saoluis.ma.gov.br/validate/${guard.token}`
                    : "",
                }}
                scale={cardScale}
                variant="flip"
                isFlipped={isFlipped}
              />
            </div>

            <Card className="shadow-sm border-slate-200 w-full overflow-hidden">
              <CardContent>
                <div className="mb-4 h-10 flex flex-col justify-start">
                  <p className="text-sm font-bold text-slate-700">Foto 3x4 *</p>
                  <div className="mt-0.5 h-4 flex items-center">
                    {errors.photoUrl && (
                      <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter block leading-none">
                        {errors.photoUrl}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div
                    className={cn(
                      "w-[105px] h-[140px] shrink-0 bg-white rounded-md flex items-center justify-center border-2 border-dashed relative group overflow-hidden cursor-pointer transition-colors",
                      isDragging
                        ? "border-primary bg-primary/10"
                        : "border-slate-300",
                    )}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <AuthenticatedImage
                      src={formData.photoUrl || "/placeholder.png"}
                      alt="Foto do Guarda"
                      width={105}
                      height={140}
                      className={cn(
                        "w-full h-full object-cover rounded-md transition-opacity",
                        formData.photoUrl
                          ? "opacity-100"
                          : "opacity-50 group-hover:opacity-70",
                      )}
                    />
                    {!formData.photoUrl && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5">
                        <Upload className="w-6 h-6 text-slate-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between h-[140px]">
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Envie uma foto com fundo neutro para melhor qualidade na
                      impressão. Use uma imagem clara e centralizada.
                    </p>
                    <div className="flex flex-row gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex-1 h-9 text-xs font-semibold border-slate-300 hover:bg-slate-50 transition-all"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-3.5 h-3.5 mr-2" />
                        {formData.photoUrl ? "ALTERAR" : "SELECIONAR"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex-1 h-9 text-xs font-semibold border-primary/40 text-primary hover:bg-primary/5 transition-all"
                        onClick={() => openCamera()}
                      >
                        <Camera className="w-3.5 h-3.5 mr-2" />
                        CÂMERA
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200 w-full overflow-hidden">
              <CardContent>
                <div className="mb-4 flex justify-between items-start h-10">
                  <div className="flex flex-col justify-start">
                    <p className="text-sm font-bold text-slate-700">
                      Assinatura do Guarda *
                    </p>
                    <div className="mt-0.5 h-4 flex items-center">
                      {errors.signatureUrl && (
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter block leading-none">
                          {errors.signatureUrl}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs font-semibold"
                      onClick={() => setIsSigDialogOpen(true)}
                    >
                      <Pencil className="w-3.5 h-3.5 mr-2" />
                      {formData.signatureUrl ? "REFAZER" : "COLETAR"}
                    </Button>
                    {formData.signatureUrl && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-xs font-semibold text-rose-500 border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        title="Remover assinatura"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            signatureUrl: null,
                            signatureX: undefined,
                            signatureY: undefined,
                            signatureScale: undefined,
                          }));
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-2" />
                        REMOVER
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-center bg-slate-50 border-2 border-dashed border-slate-300 rounded-md p-4 h-[114px] overflow-hidden">
                  {formData.signatureUrl ? (
                    <AuthenticatedImage
                      src={formData.signatureUrl}
                      alt="Assinatura do Guarda"
                      className="max-h-[80px] object-contain"
                    />
                  ) : (
                    <span className="text-xs text-slate-400 italic">
                      Nenhuma assinatura coletada
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
            <SignatureDialog
              open={isSigDialogOpen}
              onOpenChange={setIsSigDialogOpen}
              onSignatureCollected={(base64, x, y, scale) => {
                setFormData((prev) => ({
                  ...prev,
                  signatureUrl: base64,
                  ...(x !== undefined && { signatureX: x }),
                  ...(y !== undefined && { signatureY: y }),
                  ...(scale !== undefined && { signatureScale: scale }),
                }));
              }}
              title="Assinatura do Servidor"
              description="Capture a assinatura do guarda e ajuste o posicionamento no verso da carteira."
              cardData={{
                ...(formData as any),
                motherName: (formData as any).filiation2,
                fatherName: (formData as any).filiation1,
                cardIssuingPlace: "SÃO LUÍS-MA",
                qrCodeUrl: "",
                serverSignatureUrl: formData.signatureUrl,
                serverSignatureX: (formData as any).signatureX,
                serverSignatureY: (formData as any).signatureY,
                serverSignatureScale: (formData as any).signatureScale,
                signatureUrl: sigConfig?.signatureUrl,
                signatureX: sigConfig?.x,
                signatureY: sigConfig?.y,
                signatureScale: sigConfig?.scale,
              }}
            />
            <Dialog
              open={isCameraOpen}
              onOpenChange={(open) => {
                if (!open) closeCamera();
              }}
            >
              <DialogContent className="max-w-sm p-0 overflow-hidden gap-0">
                <DialogHeader className="px-5 pt-5 pb-3">
                  <DialogTitle className="text-base font-semibold flex items-center gap-2">
                    <Camera className="w-4 h-4 text-primary" />
                    Capturar Foto 3x4
                  </DialogTitle>
                </DialogHeader>

                {}
                <div
                  className="relative bg-black w-full overflow-hidden"
                  style={{ aspectRatio: "3/4" }}
                >
                  {isCameraLoading && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <Loader2 className="w-8 h-8 animate-spin text-white/60" />
                    </div>
                  )}
                  {cameraError ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
                      <Camera className="w-10 h-10 text-white/20" />
                      <p className="text-sm text-white/60">{cameraError}</p>
                    </div>
                  ) : (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                      style={
                        cameraFacing === "user"
                          ? { transform: "scaleX(-1)" }
                          : undefined
                      }
                    />
                  )}

                  {!cameraError && !isCameraLoading && (
                    <div className="absolute inset-0 pointer-events-none z-10">
                      <div className="absolute inset-y-0 left-1/3 w-px bg-white/20" />
                      <div className="absolute inset-y-0 left-2/3 w-px bg-white/20" />
                      <div className="absolute inset-x-0 top-1/3 h-px bg-white/20" />
                      <div className="absolute inset-x-0 top-2/3 h-px bg-white/20" />
                    </div>
                  )}
                </div>

                <DialogFooter className="px-5 py-4 flex gap-2 sm:justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeCamera}
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    onClick={capturePhoto}
                    disabled={!!cameraError || isCameraLoading}
                    className="flex-1"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Capturar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Card className="shadow-sm border-slate-200 w-full overflow-hidden">
              <CardContent className="space-y-4">
                <p className="text-sm font-bold text-slate-700">Fardamento</p>
                <div className="grid gap-x-4 gap-y-0 sm:grid-cols-2">
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-slate-600 mb-1">
                      Coturno
                    </label>
                    <Select
                      value={formData.bootSize}
                      onValueChange={(v) => handleSelectChange("bootSize", v)}
                    >
                      <SelectTrigger className="w-full h-10 border-slate-300 bg-slate-50 shadow-sm focus:border-primary focus:ring-0">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="37">
                          Nº 37 (25,0 - 25,3 cm)
                        </SelectItem>
                        <SelectItem value="38">
                          Nº 38 (25,5 - 26,0 cm)
                        </SelectItem>
                        <SelectItem value="39">
                          Nº 39 (26,0 - 26,6 cm)
                        </SelectItem>
                        <SelectItem value="40">
                          Nº 40 (26,5 - 27,3 cm)
                        </SelectItem>
                        <SelectItem value="41">
                          Nº 41 (27,5 - 28,0 cm)
                        </SelectItem>
                        <SelectItem value="42">
                          Nº 42 (28,0 - 28,6 cm)
                        </SelectItem>
                        <SelectItem value="43">
                          Nº 43 (28,5 - 29,3 cm)
                        </SelectItem>
                        <SelectItem value="44">
                          Nº 44 (29,0 - 29,9 cm)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-slate-600 mb-1">
                      Gandola
                    </label>
                    <Select
                      value={formData.shirtSize}
                      onValueChange={(v) => handleSelectChange("shirtSize", v)}
                    >
                      <SelectTrigger className="w-full h-10 border-slate-300 bg-slate-50 shadow-sm focus:border-primary focus:ring-0">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {["P", "M", "G", "GG", "XG"].map((size) => (
                          <SelectItem key={size} value={size}>
                            Tam. {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

      {}
      <Dialog open={certModalOpen} onOpenChange={setCertModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-primary">
              {editingCertId ? "Editar Certificado" : "Novo Certificado"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label
                htmlFor="certName"
                className="text-xs font-bold text-slate-400 uppercase"
              >
                Nome do Curso/Certificado
              </label>
              <Input
                id="certName"
                placeholder="Ex: Treinamento de Armamento e Tiro"
                value={newCert.name}
                maxLength={80}
                className={certErrors.name ? "border-red-500" : ""}
                onChange={(e) =>
                  setNewCert((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              {certErrors.name && (
                <p className="text-xs text-red-500">{certErrors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="certInstitution"
                className="text-xs font-bold text-slate-400 uppercase"
              >
                Instituição
              </label>
              <Input
                id="certInstitution"
                placeholder="Ex: Academia de Polícia"
                value={newCert.institution}
                maxLength={60}
                className={certErrors.institution ? "border-red-500" : ""}
                onChange={(e) =>
                  setNewCert((prev) => ({
                    ...prev,
                    institution: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">
                  Data de Início
                </label>
                <Input
                  placeholder="Ex: 01/05/2024"
                  value={newCert.startDate}
                  maxLength={10}
                  onChange={(e) =>
                    setNewCert((prev) => ({
                      ...prev,
                      startDate: applyDateMask(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">
                  Data de Conclusão
                </label>
                <Input
                  placeholder="Ex: 20/05/2024"
                  value={newCert.date}
                  maxLength={10}
                  onChange={(e) =>
                    setNewCert((prev) => ({
                      ...prev,
                      date: applyDateMask(e.target.value),
                    }))
                  }
                  className={certErrors.date ? "border-red-500" : ""}
                />
                {certErrors.date && (
                  <p className="text-xs text-red-500">{certErrors.date}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">
                Data de Validade/Expiração (Caso Exista)
              </label>
              <Input
                placeholder="Ex: 20/05/2026"
                value={newCert.expiryDate}
                maxLength={10}
                onChange={(e) =>
                  setNewCert((prev) => ({
                    ...prev,
                    expiryDate: applyDateMask(e.target.value),
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase block mb-2">
                Anexar Documento (PDF)
              </label>
              <input
                type="file"
                ref={certFileInputRef}
                onChange={handleCertFileUpload}
                accept="application/pdf"
                className="hidden"
              />
              {newCert.documentUrl ? (
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                    <FileText className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm font-medium truncate text-slate-700 max-w-[240px]">
                      {certFileName || "Certificado Anexado"}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-slate-400 hover:text-red-500"
                    onClick={() => {
                      setNewCert((prev) => ({ ...prev, documentUrl: "" }));
                      setCertFileName("");
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full border-dashed border-2 py-12 flex flex-col gap-3 transition-colors",
                    isDraggingCert
                      ? "border-primary bg-primary/5"
                      : "hover:bg-slate-50",
                  )}
                  onClick={() => certFileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingCert(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDraggingCert(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingCert(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) processCertFile(file);
                  }}
                >
                  <Upload className="h-5 w-5 text-slate-400" />
                  <span className="text-sm font-medium text-slate-600">
                    Anexar Documento (PDF)
                  </span>
                  <span className="text-xs text-slate-400">
                    Clique para selecionar um arquivo
                  </span>
                </Button>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCertModalOpen(false);
                setEditingCertId(null);
                setNewCert({
                  name: "",
                  institution: "",
                  startDate: "",
                  date: "",
                  expiryDate: "",
                  documentUrl: "",
                });
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddCertificate} disabled={isSubmitting}>
              {editingCertId ? "Atualizar" : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={equipModalOpen} onOpenChange={setEquipModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-primary">
              {editingEquipId ? "Editar Equipamento" : "Vincular Equipamento"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label
                htmlFor="equipName"
                className="text-xs font-bold text-slate-400 uppercase"
              >
                Nome do Equipamento
              </label>
              <Input
                id="equipName"
                placeholder="Ex: Pistola Taurus TH40"
                value={newEquip.name}
                maxLength={60}
                onChange={(e) =>
                  setNewEquip((prev) => ({ ...prev, name: e.target.value }))
                }
                className={equipErrors.name ? "border-red-500" : ""}
              />
              {equipErrors.name && (
                <p className="text-xs text-red-500">{equipErrors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">
                Tipo
              </label>
              <Select
                value={newEquip.type}
                onValueChange={(v) =>
                  setNewEquip((prev) => ({ ...prev, type: v }))
                }
              >
                <SelectTrigger
                  className={equipErrors.type ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ARMAMENTO">Armamento</SelectItem>
                  <SelectItem value="MUNIÇÃO">Munição</SelectItem>
                  <SelectItem value="COLETE">Colete Balístico</SelectItem>
                  <SelectItem value="RÁDIO HT">Rádio HT</SelectItem>
                  <SelectItem value="ALGEMA">Algema</SelectItem>
                  <SelectItem value="OUTROS">Outros</SelectItem>
                </SelectContent>
              </Select>
              {equipErrors.type && (
                <p className="text-xs text-red-500">{equipErrors.type}</p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="equipSerial"
                className="text-xs font-bold text-slate-400 uppercase"
              >
                Número de Série
              </label>
              <Input
                id="equipSerial"
                placeholder="Ex: ABC123456"
                value={newEquip.serialNumber}
                maxLength={50}
                onChange={(e) =>
                  setNewEquip((prev) => ({
                    ...prev,
                    serialNumber: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEquipModalOpen(false);
                setEditingEquipId(null);
                setNewEquip({ name: "", type: "", serialNumber: "" });
                setOtherType("");
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddEquipment} disabled={isSubmitting}>
              {editingEquipId ? "Atualizar" : "Vincular"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={evalModalOpen} onOpenChange={setEvalModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-primary">
              {editingEvalId
                ? "Editar Laudo Psicológico"
                : "Novo Laudo Psicológico"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">
                Título do Laudo / Finalidade
              </label>
              <Input
                placeholder="Ex: PORTE DE ARMA, ADMISSIONAL..."
                value={newEval.title}
                maxLength={100}
                onChange={(e) =>
                  setNewEval((prev) => ({
                    ...prev,
                    title: e.target.value.toUpperCase(),
                  }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">
                  Data da Avaliação
                </label>
                <Input
                  placeholder="Ex: 01/05/2024"
                  value={newEval.evaluationDate}
                  maxLength={10}
                  onChange={(e) =>
                    setNewEval((prev) => ({
                      ...prev,
                      evaluationDate: applyDateMask(e.target.value),
                    }))
                  }
                  className={evalErrors.evaluationDate ? "border-red-500" : ""}
                />
                {evalErrors.evaluationDate && (
                  <p className="text-xs text-red-500">
                    {evalErrors.evaluationDate}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">
                  Validade
                </label>
                <Input
                  placeholder="Ex: 01/05/2026"
                  value={newEval.expirationDate}
                  maxLength={10}
                  onChange={(e) =>
                    setNewEval((prev) => ({
                      ...prev,
                      expirationDate: applyDateMask(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">
                Status
              </label>
              <Select
                value={newEval.status}
                onValueChange={(v: "fit" | "unfit") =>
                  setNewEval((prev) => ({ ...prev, status: v }))
                }
              >
                <SelectTrigger
                  className={evalErrors.status ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fit">Apto</SelectItem>
                  <SelectItem value="unfit">Inapto</SelectItem>
                </SelectContent>
              </Select>
              {evalErrors.status && (
                <p className="text-xs text-red-500">{evalErrors.status}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">
                Profissional/Médico
              </label>
              <Input
                placeholder="Ex: DR. RICARDO SILVA (CRP 12/3456)"
                value={newEval.evaluatorInfo}
                maxLength={80}
                onChange={(e) =>
                  setNewEval((prev) => ({
                    ...prev,
                    evaluatorInfo: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase block mb-2">
                Anexar Laudo (PDF)
              </label>
              <input
                type="file"
                ref={evalFileInputRef}
                onChange={handleEvalFileUpload}
                accept="application/pdf"
                className="hidden"
              />
              {newEval.documentUrl ? (
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                    <FileText className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm font-medium truncate text-slate-700 max-w-[240px]">
                      {evalFileName || "Laudo Anexado"}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-slate-400 hover:text-red-500"
                    onClick={() => {
                      setNewEval((prev) => ({ ...prev, documentUrl: "" }));
                      setEvalFileName("");
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full border-dashed border-2 py-12 flex flex-col gap-3 transition-colors",
                    isDraggingEval
                      ? "border-primary bg-primary/5"
                      : "hover:bg-slate-50",
                  )}
                  onClick={() => evalFileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingEval(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDraggingEval(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingEval(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) processEvalFile(file);
                  }}
                >
                  <Upload className="h-5 w-5 text-slate-400" />
                  <span className="text-sm font-medium text-slate-600">
                    Anexar Laudo (PDF)
                  </span>
                  <span className="text-xs text-slate-400">
                    Clique para selecionar um arquivo
                  </span>
                </Button>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEvalModalOpen(false);
                setEditingEvalId(null);
                setNewEval({
                  title: "",
                  evaluationDate: "",
                  expirationDate: "",
                  status: "fit",
                  documentUrl: "",
                  evaluatorInfo: "",
                });
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddPsychologicalEvaluation}
              disabled={isSubmitting}
            >
              {editingEvalId ? "Atualizar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
