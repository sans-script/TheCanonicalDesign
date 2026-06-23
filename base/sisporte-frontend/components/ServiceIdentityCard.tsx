import React from "react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";
import { AuthenticatedImage } from "./AuthenticatedImage";

export interface GuardData {
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
  filiation?: {
    fatherName: string;
    motherName: string;
  };
  fatherName?: string;
  motherName?: string;
  photoUrl?: string;
  qrCodeUrl: string;
  weaponCarryStatus?: string;
  signatureUrl?: string | null; // Secretary signature
  serverSignatureUrl?: string | null; // Guard signature
  signatureX?: number;
  signatureY?: number;
  signatureScale?: number;
  serverSignatureX?: number;
  serverSignatureY?: number;
  serverSignatureScale?: number;
}

interface ServiceIdentityCardProps {
  data: GuardData;
  isFlipped?: boolean;
  variant?: "stacked" | "flip";
  scale?: number;
  screenLayout?: "row" | "column";
  qrCodeColorOverride?: string;
  isPublic?: boolean;
  printLayout?: "single" | "batch";
}

const CARD_WIDTH = 540;
const CARD_HEIGHT = 340;
const SCREEN_CARD_GAP = 32;

const abbreviateName = (name: string) => {
  if (!name) return "";
  const parts = name
    .split(" ")
    .filter((part) => part.length > 2 || part.toUpperCase() === part);
  if (parts.length <= 1) return name;

  const firstName = parts[0];
  const remaining = parts.slice(1).map((part) => `${part[0]}.`);

  return [firstName, ...remaining].join(" ");
};

const maskDocument = (doc: string) => {
  if (!doc) return "";
  const digits = doc.replace(/\D/g, "");
  if (digits.length === 11) {
    return `${doc.slice(0, 3)}.***.***-${doc.slice(-2)}`;
  }

  if (doc.length > 4) {
    return `${doc.slice(0, 2)}******${doc.slice(-2)}`;
  }
  return doc;
};

const maskDate = (date: string) => {
  if (!date) return "";

  const parts = date.split("/");
  if (parts.length === 3) {
    return `**${parts[2]}`;
  }
  return "******";
};

const formatDateLocal = (dateStr: string) => {
  if (!dateStr) return "";
  try {
    if (dateStr.includes("/")) return dateStr;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    });
  } catch (e) {
    return dateStr;
  }
};

const Field = ({
  label,
  value,
  className = "",
  valueClassName = "",
  children,
}: any) => (
  <div
    className={`bg-white border-[1.5px] border-[#4a5568] rounded-[4px] flex flex-col relative pt-[14px] pb-[2px] px-[10px] overflow-hidden ${className}`}
  >
    <div className="text-[7px] font-extrabold text-black absolute top-[5px] left-[10px] uppercase tracking-wide leading-none">
      {label}
    </div>
    {children ? (
      children
    ) : (
      <div
        className={`flex-1 flex items-center justify-start text-left font-extrabold uppercase leading-tight whitespace-nowrap overflow-hidden ${valueClassName}`}
      >
        {value}
      </div>
    )}
  </div>
);

const CardFront = ({
  data,
  qrCodeColor = "#94a3b8",
  isPublic = false,
  isPrinting = false,
}: {
  data: GuardData;
  qrCodeColor?: string;
  isPublic?: boolean;
  isPrinting?: boolean;
}) => (
  <div
    className={cn(
      "w-[540px] h-[340px] flex flex-col shrink-0 p-4 relative overflow-hidden",
      isPrinting
        ? "rounded-none border-[1.5px] border-black border-r-0"
        : "rounded-[12px] overflow-hidden",
    )}
    style={{
      backgroundColor: "#e2e8f0",
      boxSizing: "border-box",
      boxShadow: isPrinting ? "none" : "0 15px 15px -6px rgba(0, 0, 0, 0.25)",
      zIndex: 1,
    }}
  >
    {isPrinting && (
      <div className="absolute top-0 bottom-0 -right-[0.75px] border-r-[2px] border-dashed border-black z-50 opacity-80" />
    )}

    <div className="flex items-start justify-center pt-1 relative min-h-[70px]">
      <div className="absolute left-1 top-0 w-[80px] h-[90px] flex items-center justify-center">
        <Image
          src="/brasaoprefeitura.png"
          alt="Brasao de Sao Luis"
          width={80}
          height={90}
          className="object-contain"
          style={{ width: "auto", height: "100%" }}
          priority
        />
      </div>
      <div className="flex flex-col items-center justify-center pt-1.5 text-center z-10 w-[320px]">
        <div className="text-[13px] font-black text-[#1a1a1a] tracking-tight leading-tight">
          PREFEITURA MUNICIPAL DE SÃO LUÍS-MA
        </div>
        <div className="text-[10px] font-bold text-[#1a1a1a] tracking-tight leading-tight mt-[1px]">
          SECRETARIA MUNICIPAL DE SEGURANÇA COM CIDADANIA
        </div>
        <div className="text-[11px] font-black text-[#1a1a1a] tracking-tight leading-tight mt-[1px]">
          GUARDA MUNICIPAL DE SÃO LUÍS-MA
        </div>
      </div>
      <div className="absolute right-1 top-0 w-[90px] h-[95px] flex items-center justify-center">
        <Image
          src="/brasaoguarda.png"
          alt="Brasao da Guarda Municipal"
          width={90}
          height={95}
          className="object-contain"
          style={{ width: "auto", height: "100%" }}
          priority
        />
      </div>
    </div>

    <div className="text-center text-[16px] font-black text-[#222] tracking-wide mt-3 mb-3">
      CARTEIRA DE IDENTIFICAÇÃO FUNCIONAL
    </div>

    <div className="flex gap-3 flex-1 px-1 pb-1">
      <div className="w-[144px] h-[192px] shrink-0">
        <div
          className="w-full h-full rounded-[4px] flex items-center justify-center overflow-hidden bg-white relative"
          style={{ border: "1.5px solid #4a5568" }}
        >
          {data.photoUrl ? (
            <AuthenticatedImage
              src={data.photoUrl}
              alt={`Foto de ${data.name}`}
              fill
              className="object-cover"
              priority
              unoptimized
            />
          ) : (
            <Image
              src="/placeholder.png"
              alt="Avatar Placeholder"
              fill
              priority
              className="object-cover opacity-50"
            />
          )}
        </div>
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <Field
          label="NOME"
          value={isPublic ? abbreviateName(data.name) : data.name}
          className="h-[43px]"
          valueClassName={cn(
            "truncate",
            (isPublic ? abbreviateName(data.name) : data.name).length > 38
              ? "text-[10px]"
              : "text-[13px] tracking-tight"
          )}
        />
        <div className="flex gap-2 h-[43px]">
          <Field
            label="MATRÍCULA"
            value={data.registrationNumber}
            className="flex-[1.3] min-w-0"
            valueClassName="text-[15px]"
          />
          <Field
            label="ADMISSÃO"
            value={formatDateLocal(data.admissionDate)}
            className="flex-[0.7] min-w-0"
            valueClassName="text-[14px]"
          />
        </div>
        <div className="flex gap-2 h-[43px]">
          <Field
            label="FUNÇÃO"
            value={data.role}
            className="flex-[1.3] min-w-0"
            valueClassName="text-[14px]"
          />
          <Field
            label="CLASSE"
            value={data.rank}
            className="flex-[0.7] min-w-0"
            valueClassName="text-[12px]"
          />
        </div>
        <div className="flex gap-2 h-[43px]">
          <Field
            label="LOCAL E DATA DE EXPEDIÇÃO"
            value={`${data.cardIssuingPlace}, ${formatDateLocal(data.cardIssuingDate)}`}
            className="flex-[1.3] min-w-0"
            valueClassName="text-[14px] font-black truncate"
          />
          <Field
            label="SERIAL"
            value={data.serial}
            className="flex-[0.7] min-w-0"
            valueClassName="text-[13px]"
          />
        </div>
      </div>
    </div>
  </div>
);

export const CardBack = ({
  data,
  qrCodeColor = "#94a3b8",
  isPublic = false,
  isPrinting = false,
}: {
  data: GuardData;
  qrCodeColor?: string;
  isPublic?: boolean;
  isPrinting?: boolean;
}) => {
  const sigX = data.signatureX ?? 270;
  const sigY = data.signatureY ?? 290;
  const sigScale = data.signatureScale ?? 1.0;

  const serverSigX = data.serverSignatureX ?? 360; // default for 67% of 540
  const serverSigY = data.serverSignatureY ?? 220;
  const serverSigScale = data.serverSignatureScale ?? 1.0;

  return (
    <div
      className={cn(
        "w-[540px] h-[340px] flex flex-col shrink-0 p-4 relative overflow-hidden",
        isPrinting
          ? "rounded-none border-[1.5px] border-black border-l-0"
          : "rounded-[12px]",
      )}
      style={{
        backgroundColor: "#e2e8f0",
        boxShadow: isPrinting ? "none" : "0 15px 15px -6px rgba(0, 0, 0, 0.25)",
        boxSizing: "border-box",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-10">
        <Image
          src="/brasaoguarda.png"
          alt="Marca d'agua"
          width={340}
          height={360}
          className="object-contain"
          style={{ width: "auto", height: "100%" }}
        />
      </div>
      <div className="bg-white border-[1.5px] border-[#4a5568] rounded-[4px] px-[10px] py-[6px] pt-5 mb-2 shrink-0 relative flex flex-col h-[75px] z-10">
        <div className="text-[7px] font-extrabold text-black absolute top-[6px] left-[10px] uppercase">
          PORTE DE ARMA:
        </div>
        {data.weaponCarryStatus === "active" ? (
          <>
            <div className="text-[8.5px] font-bold text-[#cc0000] leading-[1.2] text-justify tracking-tight">
              O PORTADOR DESTE DOCUMENTO TEM DIREITO A PORTAR ARMA DE FOGO, DE
              PROPRIEDADE PARTICULAR OU FORNECIDA PELA GUARDA MUNICIPAL DE SÃO
              LUÍS, NOS LIMITES DO ESTADO DO MARANHÃO, EM SERVIÇO OU FORA DELE.
            </div>
            <div className="flex justify-around items-center mt-auto pb-1">
              <div className="font-extrabold text-[9.5px] text-[#cc0000]">
                PORTE SINARM: {" "}
                <span className="text-black">{data.sinarmNumber}</span>
              </div>
              <div className="font-black text-[9px] text-[#cc0000]">
                VALIDADE: {" "}
                <span className="text-black">
                  {formatDateLocal(data.expirationDate)}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col h-full pt-1">
            <div className="flex justify-around items-center mt-auto pb-1">
              <div className="font-extrabold text-[9.5px] invisible">
                PORTE SINARM: <span>{data.sinarmNumber || "0000000"}</span>
              </div>
              <div className="font-black text-[9px] text-[#cc0000]">
                {/* VALIDADE hidden when porte inactive */}
                {null}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-2 mb-2 h-[43px] shrink-0 relative z-10">
        <Field
          label="NATURALIDADE / UF"
          value={`${data.birthPlace} - ${data.state}`}
          className="flex-[1.8]"
          valueClassName="text-[14px] pt-1"
        />
        <Field
          label="DATA DE NASCIMENTO"
          value={
            isPublic
              ? maskDate(formatDateLocal(data.birthDate))
              : formatDateLocal(data.birthDate)
          }
          className="flex-[1.2]"
          valueClassName="text-[14px] pt-1"
        />
        <Field
          label="TIPO SANGUÍNEO"
          value={data.bloodType}
          className="w-[90px]"
          valueClassName="text-[16px] pt-1"
        />
      </div>
      <div className="flex gap-3 flex-1 mb-1 relative z-10 w-full">
        <div className="w-[125px] mb-[12px] bg-white border-[1.5px] border-[#4a5568] rounded-[4px] flex flex-col shrink-0 overflow-hidden relative">
          <div
            className="w-full text-white text-[8px] font-black text-center py-1 absolute top-0 left-0 tracking-wider"
            style={{
              backgroundColor: "#1e3a5f",
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
            }}
          >
            AUTENTICAÇÃO DIGITAL
          </div>
          <div className="flex-1 flex items-center justify-center p-2 pt-6">
            <div style={{ color: qrCodeColor }}>
              <QRCodeSVG
                value={data.qrCodeUrl}
                size={110}
                level="H"
                includeMargin={false}
                style={{ color: qrCodeColor }}
              />
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex gap-2 h-[34px] mb-[6px]">
            <Field
              label="RG"
              value={isPublic ? maskDocument(data.rg) : data.rg}
              className="flex-1 pt-[10px] min-w-0"
              valueClassName="text-[13px]"
            />
            <Field
              label="CPF"
              value={isPublic ? maskDocument(data.cpf) : data.cpf}
              className="flex-1 pt-[10px] min-w-0"
              valueClassName="text-[13px]"
            />
          </div>
          <Field label="FILIAÇÃO" className="h-[44px] pt-[10px]">
            <div className="flex-1 flex flex-col items-start justify-center text-left font-black uppercase leading-tight w-full overflow-hidden">
              {(() => {
                const mother = isPublic
                  ? abbreviateName(data.filiation?.motherName || data.motherName || "")
                  : data.filiation?.motherName || data.motherName || "";
                const father = isPublic
                  ? abbreviateName(data.filiation?.fatherName || data.fatherName || "")
                  : data.filiation?.fatherName || data.fatherName || "";
                
                return (
                  <>
                    {mother && (
                      <div className={cn("w-full truncate", mother.length > 42 ? "text-[8.5px]" : mother.length > 32 ? "text-[9.5px]" : "text-[11px]")}>
                        {mother}
                      </div>
                    )}
                    {father && (
                      <div className={cn("w-full truncate", father.length > 42 ? "text-[8.5px]" : father.length > 32 ? "text-[9.5px]" : "text-[11px]")}>
                        {father}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </Field>
          <div className="flex-1 flex flex-col items-center w-full">
            <div className="flex-[2.5] w-full min-h-[20px]"></div>
            <div className="w-[85%] mx-auto border-t-[1px] border-black flex items-center justify-center pt-[2px]">
              <span className="text-[7px] font-black uppercase tracking-tight text-center text-black">
                ASSINATURA DO SERVIDOR
              </span>
            </div>
            <div className="flex-[1.8] w-full min-h-[20px] relative"></div>
            <div className="w-[85%] mx-auto border-t-[1px] border-black flex items-center justify-center pt-[2px]">
              <span className="text-[7px] font-black uppercase tracking-tight text-center text-black">
                SECRETÁRIO MUNICIPAL DE SEGURANÇA COM CIDADANIA
              </span>
            </div>
          </div>
        </div>
      </div>

      {data.signatureUrl && (
        <AuthenticatedImage
          src={data.signatureUrl}
          alt="Assinatura do Secretário"
          style={{
            position: "absolute",
            left: sigX,
            top: sigY,
            height: "48px",
            transform: `translate(-50%, -50%) scale(${sigScale})`,
            objectFit: "contain",
            zIndex: 20,
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
            pointerEvents: "none",
          }}
        />
      )}

      {data.serverSignatureUrl && (
        <AuthenticatedImage
          src={data.serverSignatureUrl}
          alt="Assinatura do Servidor"
          style={{
            position: "absolute",
            left: serverSigX,
            top: serverSigY,
            height: "40px",
            transform: `translate(-50%, -50%) scale(${serverSigScale})`,
            objectFit: "contain",
            zIndex: 20,
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
};

export function ServiceIdentityCard({
  data,
  isFlipped = false,
  variant = "stacked",
  scale: externalScale,
  screenLayout = "row",
  isPublic = false,
  printLayout = "single",
}: ServiceIdentityCardProps) {
  const scale = externalScale ?? 1;
  const screenBaseWidth =
    screenLayout === "column" ? CARD_WIDTH : CARD_WIDTH * 2 + SCREEN_CARD_GAP;
  const screenBaseHeight =
    screenLayout === "column" ? CARD_HEIGHT * 2 + SCREEN_CARD_GAP : CARD_HEIGHT;

  if (variant === "flip") {
    return (
      <div
        className="relative overflow-visible"
        style={{
          width: 540 * scale,
          height: 340 * scale,
          perspective: "1000px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div
          style={{
            width: "540px",
            height: "340px",
            transformOrigin: "top left",
            transform: `scale(${scale})`,
            perspective: "1000px",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "540px",
              height: "340px",
              transformStyle: "preserve-3d",
              transition: "transform 0.7s ease",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <CardFront data={data} isPublic={isPublic} />
            </div>

            <div
              style={{
                position: "absolute",
                inset: 0,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <CardBack data={data} isPublic={isPublic} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "font-sans select-none",
        printLayout === "batch" && "batch-print-mode",
      )}
    >
      <style jsx global>{`
        .print-only {
          display: none !important;
        }

        .batch-print-mode .print-only {
          display: block !important;
          width: 172mm !important;
          margin-bottom: 1.2mm !important;
          page-break-inside: avoid !important;
          break-inside: avoid-page !important;
        }

        .batch-print-mode .screen-viewer {
          display: none !important;
        }

        .card-container {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          justify-content: flex-start !important;
          gap: 0 !important;
          width: 171.4mm !important;
          height: 53.98mm !important;
          margin: 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
        }

        .card-side {
          width: 85.7mm !important;
          height: 53.98mm !important;
          overflow: hidden !important;
          position: relative !important;
          flex: 0 0 85.7mm !important;
          margin: 0 !important;
          padding: 0 !important;
          background: transparent !important;
        }

        .card-side:first-child {
          border-right: none !important;
          z-index: 10;
        }

        .print-only .card-side > div {
          transform: scale(0.6) !important;
          transform-origin: top left !important;
          width: 540px !important;
          height: 340px !important;
          position: absolute !important;
          top: 0;
          left: 0;
        }

        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            display: block !important;
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
          }
          body * {
            visibility: hidden;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-only,
          .print-only * {
            visibility: visible;
          }
          .print-only {
            display: block !important;
            margin: 0 auto !important;
            position: relative !important;
            top: 0 !important;
            width: 172mm !important;
            height: 53.98mm !important;
            page-break-inside: avoid !important;
          }

          .font-sans:not(.batch-print-mode) .print-only {
            margin-top: 0 !important;
          }
        }
      `}</style>

      {printLayout !== "batch" && (
        <div
          className="screen-viewer-frame print:hidden mx-auto overflow-visible"
          style={{
            width: screenBaseWidth * scale,
            height: screenBaseHeight * scale,
          }}
        >
          <div
            className={cn(
              "screen-viewer flex items-start justify-center gap-8",
              screenLayout === "column" ? "flex-col" : "flex-row",
            )}
            style={{
              width: screenBaseWidth,
              height: screenBaseHeight,
              transform: scale !== 1 ? `scale(${scale})` : "none",
              transformOrigin: "top left",
            }}
          >
            <CardFront data={data} isPublic={isPublic} isPrinting={false} />
            <CardBack data={data} isPublic={isPublic} isPrinting={false} />
          </div>
        </div>
      )}

      <div className="print-only">
        <div className="card-container">
          <div className="card-side">
            <CardFront data={data} isPublic={isPublic} isPrinting={true} />
          </div>

          <div className="card-side">
            <CardBack data={data} isPublic={isPublic} isPrinting={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
