"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import CardFertilizante from "@/components/CardFertilizante";
import SidebarLoja, { type FiltrosState } from "@/components/SidebarLoja";
import { Button } from "@/components/ui/Button";
import { Search } from "lucide-react";
import { mockFertilizantes } from "@/data/mockFertilizantes";

export default function LojaFertilizantes() {
  const [search, setSearch] = useState("");
  const [filtros, setFiltros] = useState<FiltrosState>({
    tipos: [],
    origens: [],
    culturas: [],
    precoMin: 0,
    precoMax: 1000,
    faixaPreco: "Todos os preços",
    disponibilidades: [],
  });

  // Filtrar produtos
  const produtosFiltrados = useMemo(() => {
    return mockFertilizantes.filter((produto) => {
      // Filtro de busca
      const matchesSearch =
        search === "" ||
        produto.nome.toLowerCase().includes(search.toLowerCase()) ||
        produto.especificoPara.some((cultura) =>
          cultura.toLowerCase().includes(search.toLowerCase())
        );

      // Filtro de tipo
      const matchesTipo =
        filtros.tipos.length === 0 || filtros.tipos.includes(produto.tipo);

      // Filtro de origem
      const matchesOrigem =
        filtros.origens.length === 0 ||
        filtros.origens.includes(produto.origem);

      // Filtro de cultura
      const matchesCultura =
        filtros.culturas.length === 0 ||
        produto.especificoPara.some((cultura) =>
          filtros.culturas.includes(cultura)
        );

      // Filtro de preço
      const matchesPreco =
        produto.preco >= filtros.precoMin && produto.preco <= filtros.precoMax;

      // Filtro de disponibilidade
      const matchesDisponibilidade =
        filtros.disponibilidades.length === 0 ||
        filtros.disponibilidades.includes(produto.disponibilidade);

      return (
        matchesSearch &&
        matchesTipo &&
        matchesOrigem &&
        matchesCultura &&
        matchesPreco &&
        matchesDisponibilidade
      );
    });
  }, [search, filtros]);

  // Filtros ativos para exibição
  const filtrosAtivos = useMemo(() => {
    const ativos = [];

    filtros.tipos.forEach((tipo) => ativos.push({ tipo: "tipo", valor: tipo }));
    filtros.origens.forEach((origem) =>
      ativos.push({ tipo: "origem", valor: origem })
    );
    filtros.culturas.forEach((cultura) =>
      ativos.push({ tipo: "cultura", valor: cultura })
    );
    filtros.disponibilidades.forEach((disp) =>
      ativos.push({ tipo: "disponibilidade", valor: disp })
    );

    if (filtros.faixaPreco !== "Todos os preços") {
      ativos.push({ tipo: "preco", valor: filtros.faixaPreco });
    }

    return ativos;
  }, [filtros]);

  const removerFiltro = (tipoFiltro: string, valor: string) => {
    switch (tipoFiltro) {
      case "tipo":
        setFiltros((prev) => ({
          ...prev,
          tipos: prev.tipos.filter((t) => t !== valor),
        }));
        break;
      case "origem":
        setFiltros((prev) => ({
          ...prev,
          origens: prev.origens.filter((o) => o !== valor),
        }));
        break;
      case "cultura":
        setFiltros((prev) => ({
          ...prev,
          culturas: prev.culturas.filter((c) => c !== valor),
        }));
        break;
      case "disponibilidade":
        setFiltros((prev) => ({
          ...prev,
          disponibilidades: prev.disponibilidades.filter((d) => d !== valor),
        }));
        break;
      case "preco":
        setFiltros((prev) => ({
          ...prev,
          faixaPreco: "Todos os preços",
          precoMin: 0,
          precoMax: 1000,
        }));
        break;
    }
  };

  const limparFiltros = () => {
    setFiltros({
      tipos: [],
      origens: [],
      culturas: [],
      precoMin: 0,
      precoMax: 1000,
      faixaPreco: "Todos os preços",
      disponibilidades: [],
    });
  };

  const handleAddToCart = (id: string) => {
    // TODO: Implementar adicionar ao carrinho
    console.log(`Adicionar produto ${id} ao carrinho`);
  };

  return (
    <div className="flex flex-col h-full"> {/* Alterado de h-screen bg-grey-200 para h-full */}
      {/* Header */}
      <Header
        title="Loja"
        searchValue={search}
        onSearch={setSearch}
        showIcons={true}
        showBackButton={true}
        backUrl="/produtor/overview"
      />

      {/* Título da página */}
      <div className="bg-white px-6 py-4">
        <h1 className="text-2xl font-bold text-grey-900">
          Loja de Fertilizantes Tratados
        </h1>
      </div>

      {/* Conteúdo principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar da Loja */}
        <SidebarLoja filtros={filtros} onFiltrosChange={setFiltros} />

        {/* Área de conteúdo */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Campo de busca alinhado com TIPO DE FERTILIZANTE */}
          <div className="flex justify-end mb-6">
            <div className="relative w-80">
              <input
                type="text"
                placeholder="Buscar por nome, cultura indicada..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-grey-300 rounded-full bg-grey-100 focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-primary-main focus:bg-white transition-all"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-grey-400 w-5 h-5" />
            </div>
          </div>

          {/* Filtros Ativos - sempre ocupa espaço */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-3">
              <span className="text-sm font-medium text-grey-600">
                Filtros Ativos
              </span>
              <div className="flex flex-wrap gap-2">
                {filtrosAtivos.length > 0 ? (
                  filtrosAtivos.map((filtro, index) => (
                    <span
                      key={index}
                      className="bg-primary-lighter text-primary-dark text-sm px-3 py-1.5 rounded-full border border-primary-light"
                    >
                      {filtro.valor}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-grey-400">
                    Nenhum filtro ativo
                  </span>
                )}
              </div>
              {filtrosAtivos.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={limparFiltros}
                  className="text-primary-main hover:text-primary-dark text-xs ml-auto"
                >
                  Limpar todos
                </Button>
              )}
            </div>
          </div>

          {/* Contador de resultados */}
          <div className="flex justify-end items-center mb-6">
            <span className="text-sm text-grey-600">
              <strong>{produtosFiltrados.length}</strong> Resultados
            </span>
          </div>

          {/* Grid de Produtos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {produtosFiltrados.map((produto) => (
              <CardFertilizante
                key={produto.id}
                fertilizante={produto}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          {/* Estado vazio */}
          {produtosFiltrados.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-grey-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-grey-400" />
              </div>
              <h3 className="text-lg font-semibold text-grey-900 mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-grey-600 max-w-md">
                Tente ajustar os filtros ou termos de busca para encontrar os
                produtos desejados.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}