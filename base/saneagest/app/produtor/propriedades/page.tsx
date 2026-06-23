"use client"

import React from "react"
import { AlertTriangle, Edit, Trash2, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import Header from "@/components/Header"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/Dialog"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { propriedadesIniciais, type Propriedade } from "@/data/mockPropriedades"

export default function MinhasPropriedades() {
  const [propriedades, setPropriedades] = React.useState<Propriedade[]>(propriedadesIniciais)
  const [search, setSearch] = React.useState("")
  const [editModalOpen, setEditModalOpen] = React.useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false)
  const [selectedPropriedade, setSelectedPropriedade] = React.useState<Propriedade | null>(null)
  const [editValues, setEditValues] = React.useState<Propriedade | null>(null)
  const [propriedadeToDelete, setPropriedadeToDelete] = React.useState<Propriedade | null>(null)

  const handleEditClick = (propriedade: Propriedade) => {
    setSelectedPropriedade(propriedade)
    setEditValues({ ...propriedade })
    setEditModalOpen(true)
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editValues) return
    const { name, value } = e.target
    setEditValues({
      ...editValues,
      [name]: name === "areaHa" ? Number(value) : value,
    })
  }

  const handleEditSave = () => {
    if (!editValues || !selectedPropriedade) return

    setPropriedades((prev) => prev.map((prop) => (prop.id === selectedPropriedade.id ? editValues : prop)))

    setEditModalOpen(false)
    setSelectedPropriedade(null)
    setEditValues(null)
  }

  const handleEditCancel = () => {
    setEditModalOpen(false)
    setSelectedPropriedade(null)
    setEditValues(null)
  }

  const handleDelete = (propriedadeId: string) => {
    const propriedadeToDelete = propriedades.find((prop) => prop.id === propriedadeId)
    if (propriedadeToDelete) {
      setPropriedadeToDelete(propriedadeToDelete)
      setDeleteModalOpen(true)
    }
  }

  const handleDeleteConfirm = () => {
    if (!propriedadeToDelete) return
    setPropriedades((prev) => prev.filter((prop) => prop.id !== propriedadeToDelete.id))
    setDeleteModalOpen(false)
    setPropriedadeToDelete(null)
  }

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false)
    setPropriedadeToDelete(null)
  }

  const propriedadesFiltradas = propriedades.filter((propriedade) =>
    propriedade.nome.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-grey-200">
      <Header title="Minhas Propriedades" searchValue={search} onSearch={setSearch} showIcons={true} />

      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        {/* Header com botão de adicionar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl lg:text-2xl font-bold text-grey-900 truncate">Minhas Propriedades</h1>
            <p className="text-sm text-grey-600 mt-1">Gerencie suas propriedades agrícolas cadastradas</p>
          </div>
          <Button className="bg-primary-main hover:bg-primary-dark text-white px-4 py-2 rounded-xl w-full sm:w-auto flex-shrink-0">
            <Plus className="w-4 h-4 mr-2" />
            Nova Propriedade
          </Button>
        </div>

        {/* Grid de propriedades */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-6">
          {propriedadesFiltradas.map((propriedade) => (
            <Card
              key={propriedade.id}
              className="p-4 lg:p-6 border-grey-200 shadow-md hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="flex-1 flex flex-col min-w-0">
                <h3 className="font-bold text-grey-900 text-lg lg:text-xl line-clamp-2 min-h-[2.5rem] break-words truncate">
                  {propriedade.nome}
                </h3>

                <div className="space-y-2 text-sm mt-2 min-w-0">
                  <div className="min-w-0">
                    <span className="font-semibold text-grey-700">Localização:</span>{" "}
                    <span className="text-grey-600 line-clamp-2 break-words truncate min-w-0">
                      {propriedade.localizacao}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold text-grey-700">Cultura:</span>{" "}
                    <span className="text-grey-600 break-words truncate min-w-0">{propriedade.tipoCultura}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-grey-700">Área:</span>{" "}
                    <span className="text-grey-600">{propriedade.areaHa}ha</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2 mt-auto">
                  <Button
                    size="sm"
                    onClick={() => handleEditClick(propriedade)}
                    className="bg-primary-main hover:bg-primary-dark text-white px-3 py-2 rounded-lg flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(propriedade.id)}
                    className="bg-error-main hover:bg-error-dark text-white px-3 py-2 rounded-lg flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Apagar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Estado vazio */}
        {propriedadesFiltradas.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-grey-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-grey-400" />
            </div>
            <h3 className="text-lg font-semibold text-grey-900 mb-2">
              {search ? "Nenhuma propriedade encontrada" : "Nenhuma propriedade cadastrada"}
            </h3>
            <p className="text-grey-600 max-w-md">
              {search
                ? "Tente ajustar os termos de busca ou limpar o filtro."
                : "Comece cadastrando sua primeira propriedade para gerenciar suas solicitações de lodo."}
            </p>
          </div>
        )}
      </div>

      {/* Modal de Edição */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="bg-white rounded-xl shadow-2xl border border-grey-200 max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-grey-900">Editar Propriedade</DialogTitle>
          </DialogHeader>
          {editValues && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome" className="text-sm font-medium text-grey-700">
                  Nome
                </Label>
                <Input
                  id="nome"
                  name="nome"
                  value={editValues.nome}
                  onChange={handleEditChange}
                  className="mt-1 border-grey-300 focus:border-primary-main focus:ring-primary-main"
                />
              </div>
              <div>
                <Label htmlFor="localizacao" className="text-sm font-medium text-grey-700">
                  Localização
                </Label>
                <Input
                  id="localizacao"
                  name="localizacao"
                  value={editValues.localizacao}
                  onChange={handleEditChange}
                  className="mt-1 border-grey-300 focus:border-primary-main focus:ring-primary-main"
                />
              </div>
              <div>
                <Label htmlFor="tipoCultura" className="text-sm font-medium text-grey-700">
                  Tipo de Cultura
                </Label>
                <Input
                  id="tipoCultura"
                  name="tipoCultura"
                  value={editValues.tipoCultura}
                  onChange={handleEditChange}
                  className="mt-1 border-grey-300 focus:border-primary-main focus:ring-primary-main"
                />
              </div>
              <div>
                <Label htmlFor="areaHa" className="text-sm font-medium text-grey-700">
                  Área (ha)
                </Label>
                <Input
                  id="areaHa"
                  name="areaHa"
                  type="number"
                  min="0"
                  step="0.1"
                  value={editValues.areaHa}
                  onChange={handleEditChange}
                  className="mt-1 border-grey-300 focus:border-primary-main focus:ring-primary-main"
                />
              </div>
            </div>
          )}
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleEditCancel}
              className="border-grey-300 text-grey-700 hover:bg-grey-50 bg-transparent w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleEditSave}
              className="bg-primary-main hover:bg-primary-dark text-white w-full sm:w-auto"
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="bg-white rounded-xl shadow-2xl border border-grey-200 max-w-md mx-4">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-error-lighter rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-error-main" />
            </div>
            <DialogTitle className="text-lg font-semibold text-grey-900">Confirmar Exclusão</DialogTitle>
            <DialogDescription className="text-sm text-grey-600">
              Tem certeza que deseja excluir a propriedade <strong>{propriedadeToDelete?.nome}</strong>? Esta ação não
              pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleDeleteCancel}
              className="border-grey-300 text-grey-700 hover:bg-grey-50 bg-transparent w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              className="bg-error-main hover:bg-error-dark text-white w-full sm:w-auto"
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
