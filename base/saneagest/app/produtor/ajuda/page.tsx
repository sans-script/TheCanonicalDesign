"use client"

import React from "react"
import Header from "@/components/Header"
import { Card } from "@/components/ui/Card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion"
import { Search, Phone, Mail } from "lucide-react"
import { perguntasFrequentes, guiasTutoriais } from "@/data/mockAjuda"

export default function Ajuda() {
  const [search, setSearch] = React.useState("")

  const filtrarConteudo = (texto: string, keywords: string[]) => {
    if (!search.trim()) return true
    const termoBusca = search.toLowerCase().trim()
    const textoCompleto = texto.toLowerCase()
    const keywordsTexto = keywords.join(" ").toLowerCase()
    return (
      textoCompleto.includes(termoBusca) ||
      keywordsTexto.includes(termoBusca) ||
      keywords.some((keyword) => keyword.toLowerCase().includes(termoBusca)) ||
      termoBusca.split(" ").some((termo) => textoCompleto.includes(termo) || keywordsTexto.includes(termo))
    )
  }

  const perguntasFiltradas = perguntasFrequentes.filter((item) =>
    filtrarConteudo(item.pergunta + " " + item.resposta, item.keywords),
  )

  const guiasFiltrados = guiasTutoriais.filter((item) =>
    filtrarConteudo(item.titulo + " " + item.conteudo, item.keywords),
  )

  const hasResults = perguntasFiltradas.length > 0 || guiasFiltrados.length > 0
  const hasSearch = search.trim().length > 0

  return (
    <div className="flex flex-col h-screen bg-grey-200">
      <div className="flex-shrink-0">
        <Header title="Central de Ajuda" searchValue={search} onSearch={setSearch} showIcons={true} />
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-6">
          {/* Card de Contato */}
          <Card className="mb-8 p-6 rounded-xl border-grey-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary-transparent-8 rounded-lg">
                <Search className="w-5 h-5 text-primary-main" />
              </div>
              <h2 className="text-xl font-semibold text-grey-900">Precisa de Ajuda?</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-info-transparent-8 rounded-lg">
                  <Phone className="w-5 h-5 text-info-main" />
                </div>
                <div>
                  <div className="font-medium text-grey-900 mb-1">Telefone</div>
                  <div className="text-sm text-grey-600">(98) 3000-0000</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary-transparent-8 rounded-lg">
                  <Mail className="w-5 h-5 text-secondary-main" />
                </div>
                <div>
                  <div className="font-medium text-grey-900 mb-1">Email</div>
                  <div className="text-sm text-grey-600">suporte@saneagest.com.br</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Estado Vazio - Nenhum resultado */}
          {hasSearch && !hasResults && (
            <div className="flex flex-col items-center justify-center py-12 px-8">
              <div className="w-20 h-20 mb-6 rounded-full bg-grey-100 flex items-center justify-center">
                <Search className="w-10 h-10 text-grey-400" />
              </div>
              <h3 className="text-xl font-semibold text-grey-900 mb-3 text-center">Nenhum resultado encontrado</h3>
              <p className="text-grey-600 text-center max-w-md">
                Tente usar termos diferentes ou verifique a ortografia das palavras. Você também pode entrar em contato
                conosco pelos canais acima.
              </p>
            </div>
          )}

          {/* Perguntas Frequentes */}
          {perguntasFiltradas.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-grey-900 mb-4">Perguntas Frequentes</h2>
              <Accordion type="single" collapsible className="w-full space-y-3">
                {perguntasFiltradas.map((item) => (
                  <AccordionItem
                    key={item.id}
                    value={`faq-${item.id}`}
                    className="border border-grey-200 rounded-xl bg-white shadow-sm overflow-hidden"
                  >
                    <AccordionTrigger className="px-6 py-4 text-sm font-medium text-grey-900 hover:no-underline hover:bg-grey-50 transition-colors [&[data-state=open]>svg]:rotate-180">
                      {item.pergunta}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-sm text-grey-600 leading-relaxed">
                      {item.resposta}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

          {/* Guias e Tutoriais */}
          {guiasFiltrados.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-grey-900 mb-4">Guias e Tutoriais</h2>
              <Accordion type="single" collapsible className="w-full space-y-3">
                {guiasFiltrados.map((item) => (
                  <AccordionItem
                    key={item.id}
                    value={`guide-${item.id}`}
                    className="border border-grey-200 rounded-xl bg-white shadow-sm overflow-hidden"
                  >
                    <AccordionTrigger className="px-6 py-4 text-sm font-medium text-grey-900 hover:no-underline hover:bg-grey-50 transition-colors [&[data-state=open]>svg]:rotate-180">
                      {item.titulo}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-sm text-grey-600 leading-relaxed">
                      <div className="whitespace-pre-line">{item.conteudo}</div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
