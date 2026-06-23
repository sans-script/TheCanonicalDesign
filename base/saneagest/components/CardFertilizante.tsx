"use client";

import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { Fertilizante } from "@/data/mockFertilizantes";
import Image from "next/image";

interface CardFertilizanteProps {
  fertilizante: Fertilizante;
  onAddToCart?: (id: string) => void;
}

export default function CardFertilizante({
  fertilizante,
  onAddToCart,
}: CardFertilizanteProps) {
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? "text-warning-main fill-warning-main"
            : "text-grey-300"
        }`}
      />
    ));
  };

  return (
    <Card className="p-4 border-grey-200 hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
      {/* Imagem do produto */}
      <div className="aspect-square bg-grey-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
        {fertilizante.imagem ? (
          <Image
            src={fertilizante.imagem}
            alt={fertilizante.nome}
            width={200}
            height={200}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="text-grey-400 text-sm text-center p-4">
            Imagem do
            <br />
            Produto
          </div>
        )}
      </div>

      {/* Avaliação */}
      <div className="flex items-center gap-1 mb-2">
        {renderStars(fertilizante.avaliacao)}
        <span className="text-sm text-grey-500 ml-1">
          ({fertilizante.numeroAvaliacoes})
        </span>
      </div>

      {/* Nome do produto */}
      <h3 className="font-semibold text-grey-900 text-sm mb-2 line-clamp-2 flex-1">
        {fertilizante.nome}
      </h3>

      {/* Preço */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-lg font-bold text-success-main">
          R$ {fertilizante.preco.toFixed(2)}
        </span>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            fertilizante.disponibilidade === "Em estoque"
              ? "bg-success-lighter text-success-dark"
              : "bg-warning-lighter text-warning-dark"
          }`}
        >
          {fertilizante.disponibilidade}
        </span>
      </div>

      {/* Botão de adicionar ao carrinho */}
      <Button
        onClick={() => onAddToCart?.(fertilizante.id)}
        className="w-full bg-primary-main hover:bg-primary-dark text-white"
        size="sm"
      >
        <ShoppingCart className="w-4 h-4 mr-2" />
        Adicionar
      </Button>
    </Card>
  );
}
