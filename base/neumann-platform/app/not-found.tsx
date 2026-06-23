"use client";

import Link from "next/link";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="-m-6 w-[calc(100%+3rem)] min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-background p-4 overflow-hidden relative">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Blob 1 */}
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-80 animate-moveBlob1"
          style={{
            background: "linear-gradient(45deg, hsl(204, 93%, 51%), hsl(194, 100%, 63%), hsl(204, 100%, 85%))",
            left: "10%",
            top: "20%",
          }}
        />
        {/* Blob 2 */}
        <div
          className="absolute w-80 h-80 rounded-full blur-3xl opacity-70 animate-moveBlob2"
          style={{
            background: "linear-gradient(135deg, hsl(194, 100%, 63%), hsl(204, 93%, 51%))",
            right: "5%",
            top: "10%",
          }}
        />
        {/* Blob 3 */}
        <div
          className="absolute w-72 h-72 rounded-full blur-3xl opacity-75 animate-moveBlob3"
          style={{
            background: "linear-gradient(225deg, hsl(204, 100%, 85%), hsl(204, 93%, 51%))",
            left: "30%",
            bottom: "15%",
          }}
        />
        {/* Blob 4 */}
        <div
          className="absolute w-64 h-64 rounded-full blur-3xl opacity-70 animate-moveBlob4"
          style={{
            background: "linear-gradient(90deg, hsl(204, 93%, 51%), hsl(194, 100%, 63%))",
            right: "20%",
            bottom: "10%",
          }}
        />
        {/* Blob 5 */}
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-60 animate-moveBlob5"
          style={{
            background: "radial-gradient(circle, hsl(204, 100%, 85%), hsl(204, 93%, 51%))",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)"
          }}
        />
        {/* Blob 6 */}
        <div
          className="absolute w-40 h-40 rounded-full blur-2xl opacity-80 animate-moveBlob6"
          style={{
            background: "linear-gradient(180deg, hsl(194, 100%, 63%), hsl(204, 100%, 85%))",
            left: "5%",
            bottom: "5%",
          }}
        />
      </div>

      <div className="relative z-10 max-w-md w-full text-center space-y-8">
        {/* Icon Container */}
        {/* <div className="mx-auto w-32 h-32 relative flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
          <div className="absolute inset-2 bg-background rounded-full shadow-card flex items-center justify-center">
            <div className="h-16 w-16 gradient-neumann rounded-xl flex items-center justify-center transform rotate-12 transition-transform hover:rotate-0 duration-300">
              <FileQuestion className="h-8 w-8 text-white" />
            </div>
          </div>
        </div> */}

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-8xl font-bold gradient-text tracking-tighter">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-foreground">
            Página não encontrada
          </h2>
          <p className="text-muted-foreground">
            A página que você está procurando pode ter sido removida, renomeada ou
            está temporariamente indisponível.
          </p>
        </div>

        {/* Actions - Using native anchor for now if Button component complicates things, 
            but usually we wrap Link around Button or use Button asChild */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link href="/">
            <Button className="gap-2 min-w-[140px]">
              <Home className="h-4 w-4" />
              Início
            </Button>
          </Link>

          <Button variant="outline" className="gap-2 min-w-[140px]" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>

        <div className="pt-12 text-xs text-muted-foreground">
          Neumann Platform • Healthcare Intelligence
        </div>
      </div>
    </div>
  );
}
