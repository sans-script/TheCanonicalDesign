"use client"

import { useState } from "react"
import { Input } from "@/components/ui/Input"
import { tiposFertilizante, origensETE, culturas, faixasPreco, disponibilidades } from "@/data/mockFertilizantes"

export interface FiltrosState {
  tipos: string[]
  origens: string[]
  culturas: string[]
  precoMin: number
  precoMax: number
  faixaPreco: string
  disponibilidades: string[]
}

interface SidebarLojaProps {
  filtros: FiltrosState
  onFiltrosChange: (filtros: FiltrosState) => void
}

export default function SidebarLoja({ filtros, onFiltrosChange }: SidebarLojaProps) {
  const [precoRange, setPrecoRange] = useState([filtros.precoMin, filtros.precoMax])

  const handleTipoChange = (tipo: string) => {
    const novosTipos = filtros.tipos.includes(tipo) ? filtros.tipos.filter((t) => t !== tipo) : [...filtros.tipos, tipo]
    onFiltrosChange({ ...filtros, tipos: novosTipos })
  }

  const handleOrigemChange = (origem: string) => {
    const novasOrigens = filtros.origens.includes(origem)
      ? filtros.origens.filter((o) => o !== origem)
      : [...filtros.origens, origem]
    onFiltrosChange({ ...filtros, origens: novasOrigens })
  }

  const handleCulturaChange = (cultura: string) => {
    const novasCulturas = filtros.culturas.includes(cultura)
      ? filtros.culturas.filter((c) => c !== cultura)
      : [...filtros.culturas, cultura]
    onFiltrosChange({ ...filtros, culturas: novasCulturas })
  }

  const handleFaixaPrecoChange = (faixa: string) => {
    const faixaSelecionada = faixasPreco.find((f) => f.label === faixa)
    if (faixaSelecionada) {
      onFiltrosChange({
        ...filtros,
        faixaPreco: faixa,
        precoMin: faixaSelecionada.min,
        precoMax: faixaSelecionada.max === Number.POSITIVE_INFINITY ? 1000 : faixaSelecionada.max,
      })
      setPrecoRange([
        faixaSelecionada.min,
        faixaSelecionada.max === Number.POSITIVE_INFINITY ? 1000 : faixaSelecionada.max,
      ])
    }
  }

  const handleDisponibilidadeChange = (disponibilidade: string, checked: boolean) => {
    const novasDisponibilidades = checked
      ? [...filtros.disponibilidades, disponibilidade]
      : filtros.disponibilidades.filter((d) => d !== disponibilidade)

    onFiltrosChange({ ...filtros, disponibilidades: novasDisponibilidades })
  }

  const handlePrecoRangeChange = (values: number[]) => {
    setPrecoRange(values)
    onFiltrosChange({
      ...filtros,
      precoMin: values[0],
      precoMax: values[1],
      faixaPreco: "Personalizado",
    })
  }

  return (
    <aside className="w-80 bg-white border-r border-grey-200 overflow-y-auto flex-shrink-0">
      <div className="p-6 space-y-8">
        {/* Tipo de Fertilizante */}
        <div>
          <h3 className="font-semibold text-grey-900 mb-4 text-sm uppercase tracking-wide">TIPO DE FERTILIZANTE</h3>
          <div className="space-y-3">
            {tiposFertilizante.map((tipo) => (
              <label key={tipo} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={filtros.tipos.includes(tipo)}
                    onChange={() => handleTipoChange(tipo)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      filtros.tipos.includes(tipo)
                        ? "border-primary-main bg-primary-main"
                        : "border-grey-300 bg-white group-hover:border-primary-light"
                    }`}
                  >
                    {filtros.tipos.includes(tipo) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-grey-700">{tipo}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Origem da ETE */}
        <div>
          <h3 className="font-semibold text-grey-900 mb-4 text-sm uppercase tracking-wide">ORIGEM DA ETE</h3>
          <div className="space-y-3">
            {origensETE.map((origem) => (
              <label key={origem} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={filtros.origens.includes(origem)}
                    onChange={() => handleOrigemChange(origem)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      filtros.origens.includes(origem)
                        ? "border-primary-main bg-primary-main"
                        : "border-grey-300 bg-white group-hover:border-primary-light"
                    }`}
                  >
                    {filtros.origens.includes(origem) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-grey-700">{origem}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Específico Para */}
        <div>
          <h3 className="font-semibold text-grey-900 mb-4 text-sm uppercase tracking-wide">ESPECÍFICO PARA</h3>
          <div className="space-y-3">
            {culturas.map((cultura) => (
              <label key={cultura} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={filtros.culturas.includes(cultura)}
                    onChange={() => handleCulturaChange(cultura)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                      filtros.culturas.includes(cultura)
                        ? "border-primary-main bg-primary-main"
                        : "border-grey-300 bg-white group-hover:border-primary-light"
                    }`}
                  >
                    {filtros.culturas.includes(cultura) && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-grey-700">{cultura}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Preço */}
        <div>
          <h3 className="font-semibold text-grey-900 mb-4 text-sm uppercase tracking-wide">PREÇO</h3>

          {/* Slider de preço customizado */}
          <div className="mb-6">
            {/* Container do slider */}
            <div className="relative mb-4 py-3">
              {/* Track de fundo */}
              <div className="h-1 bg-grey-300 rounded-full"></div>

              {/* Track ativo */}
              <div
                className="absolute top-3 h-1 bg-primary-main rounded-full"
                style={{
                  left: `${(precoRange[0] / 1000) * 100}%`,
                  width: `${((precoRange[1] - precoRange[0]) / 1000) * 100}%`,
                }}
              ></div>

              {/* Thumb esquerdo */}
              <div
                className="absolute bottom-1.5 w-4 h-4 bg-white border-2 border-primary-main rounded-full cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                style={{
                  left: `calc(${(precoRange[0] / 1000) * 100}% - 8px)`,
                }}
                onMouseDown={(e) => {
                  const startX = e.clientX
                  const startValue = precoRange[0]
                  const rect = e.currentTarget.parentElement!.getBoundingClientRect()

                  const handleMouseMove = (e: MouseEvent) => {
                    const deltaX = e.clientX - startX
                    const deltaPercent = (deltaX / rect.width) * 100
                    const deltaValue = (deltaPercent / 100) * 1000
                    const newValue = Math.max(0, Math.min(precoRange[1], startValue + deltaValue))
                    handlePrecoRangeChange([Math.round(newValue), precoRange[1]])
                  }

                  const handleMouseUp = () => {
                    document.removeEventListener("mousemove", handleMouseMove)
                    document.removeEventListener("mouseup", handleMouseUp)
                  }

                  document.addEventListener("mousemove", handleMouseMove)
                  document.addEventListener("mouseup", handleMouseUp)
                }}
              ></div>

              {/* Thumb direito */}
              <div
                className="absolute bottom-1.5 w-4 h-4 bg-white border-2 border-primary-main rounded-full cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                style={{
                  left: `calc(${(precoRange[1] / 1000) * 100}% - 8px)`,
                }}
                onMouseDown={(e) => {
                  const startX = e.clientX
                  const startValue = precoRange[1]
                  const rect = e.currentTarget.parentElement!.getBoundingClientRect()

                  const handleMouseMove = (e: MouseEvent) => {
                    const deltaX = e.clientX - startX
                    const deltaPercent = (deltaX / rect.width) * 100
                    const deltaValue = (deltaPercent / 100) * 1000
                    const newValue = Math.max(precoRange[0], Math.min(1000, startValue + deltaValue))
                    handlePrecoRangeChange([precoRange[0], Math.round(newValue)])
                  }

                  const handleMouseUp = () => {
                    document.removeEventListener("mousemove", handleMouseMove)
                    document.removeEventListener("mouseup", handleMouseUp)
                  }

                  document.addEventListener("mousemove", handleMouseMove)
                  document.addEventListener("mouseup", handleMouseUp)
                }}
              ></div>
            </div>

            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Preço Mínimo"
                value={precoRange[0]}
                onChange={(e) => handlePrecoRangeChange([Number(e.target.value), precoRange[1]])}
                className="text-sm"
              />
              <Input
                type="number"
                placeholder="Preço Máximo"
                value={precoRange[1]}
                onChange={(e) => handlePrecoRangeChange([precoRange[0], Number(e.target.value)])}
                className="text-sm"
              />
            </div>
          </div>

          {/* Faixas de preço predefinidas */}
          <div className="space-y-3">
            {faixasPreco.map((faixa) => (
              <label key={faixa.label} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="radio"
                    name="faixaPreco"
                    checked={filtros.faixaPreco === faixa.label}
                    onChange={() => handleFaixaPrecoChange(faixa.label)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      filtros.faixaPreco === faixa.label
                        ? "border-primary-main bg-primary-main"
                        : "border-grey-300 bg-white group-hover:border-primary-light"
                    }`}
                  >
                    {filtros.faixaPreco === faixa.label && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                </div>
                <span className="text-sm text-grey-700">{faixa.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Disponibilidade */}
        <div>
          <h3 className="font-semibold text-grey-900 mb-4 text-sm uppercase tracking-wide">DISPONIBILIDADE</h3>
          <div className="space-y-3">
            {disponibilidades.map((disponibilidade) => (
              <label key={disponibilidade} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={filtros.disponibilidades.includes(disponibilidade)}
                    onChange={(e) => handleDisponibilidadeChange(disponibilidade, e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      filtros.disponibilidades.includes(disponibilidade)
                        ? "border-primary-main bg-primary-main"
                        : "border-grey-300 bg-white group-hover:border-primary-light"
                    }`}
                  >
                    {filtros.disponibilidades.includes(disponibilidade) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-grey-700">{disponibilidade}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
