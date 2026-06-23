"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Shield,
  User,
  Loader2,
  Check,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { authService } from "@/services/auth.service";
import { usersService } from "@/services/users.service";
import { UserAccount } from "@/lib/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const colWidths = ["w-[40%]", "w-[25%]", "w-[20%]", "w-[15%]"];

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [originalRole, setOriginalRole] = useState<string | null>(null);
  const [adminConfirmPassword, setAdminConfirmPassword] = useState("");

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserAccount | null>(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hasPasswordError, setHasPasswordError] = useState(false);

  const [currentUser, setCurrentUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "OPERA" as "ADMIN" | "OPERA",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = authService.getCurrentUser();
      setCurrentUser(user);
      if (!user || user.role !== "ADMIN") {
        router.push("/dashboard");
      }
    }
  }, [router]);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setIsLoading(true);
    try {
      const data = await usersService.getAll();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users", error);
      toast.error("Erro ao carregar usuários.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "OPERA",
    });
    setShowPassword(false);
    setHasPasswordError(false);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (user: UserAccount) => {
    setEditingUser(user);
    setOriginalRole(user.role);
    setAdminConfirmPassword("");
    setFormData({
      name: user.name || "",
      email: user.email,
      password: "",
      role: user.role,
    });
    setShowPassword(false);
    setHasPasswordError(false);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (formData.name.trim().length < 3) {
      toast.error("O nome deve ter pelo menos 3 caracteres.");
      setIsSubmitting(false);
      return;
    }

    if (!editingUser && formData.password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      setIsSubmitting(false);
      return;
    }

    if (editingUser && formData.password && formData.password.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres.");
      setIsSubmitting(false);
      return;
    }

    try {
      if (editingUser) {
        const hasChanges =
          formData.name !== (editingUser.name || "") ||
          formData.email !== editingUser.email ||
          formData.role !== editingUser.role ||
          formData.password !== "";

        if (!hasChanges) {
          setIsDialogOpen(false);
          setIsSubmitting(false);
          return;
        }

        const payload: any = { ...formData };
        if (!payload.password) delete payload.password;

        const confirmPass = adminConfirmPassword;

        await usersService.update(editingUser.id, payload, confirmPass);
        toast.success(
          "Usuário atualizado. O usuário deve realizar um novo login para que as alterações de nível de acesso entrem em vigor.",
        );
      } else {
        if (!formData.password) {
          toast.error("A senha é obrigatória para novos usuários.");
          setIsSubmitting(false);
          return;
        }
        const payload = { ...formData };
        await usersService.create(payload as any);
        toast.success("Usuário criado com sucesso.");
      }
      setIsDialogOpen(false);
      loadUsers();
    } catch (error: any) {
      console.error("Failed to save user", error);
      if (error.response?.status === 403) {
        setHasPasswordError(true);
      }
      toast.error(error.response?.data?.message || "Erro ao salvar usuário.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (e?: React.MouseEvent) => {
    if (!userToDelete) return;

    if (!confirmPassword) {
      toast.error(
        "A senha de confirmação é necessária para remover um usuário.",
      );
      return;
    }

    try {
      await usersService.delete(userToDelete.id, confirmPassword);
      toast.success("Usuário removido com sucesso.");
      loadUsers();
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Failed to delete user", error);
      toast.error(error.response?.data?.message || "Erro ao remover usuário.");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="lg:h-[calc(100vh-140px)] flex flex-col space-y-6 overflow-hidden">
      <div className="shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Usuários</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl font-bold text-primary">
            Gerenciamento de Usuários
          </h1>
          <p className="text-muted-foreground text-sm">
            Controle quem tem acesso ao sistema e suas permissões
          </p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      <div className="shrink-0">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
          <label htmlFor="userSearch" className="sr-only">
            Pesquisar por nome ou e-mail
          </label>
          <Input
            id="userSearch"
            name="userSearch"
            autoComplete="off"
            data-form-type="other"
            placeholder="Pesquisar por nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            maxLength={100}
            className="pl-9 bg-white"
          />
        </div>
      </div>

      <Card className="shadow-sm border-slate-200 overflow-hidden flex-1 flex flex-col min-h-0">
        <CardHeader className="bg-white pt-4 pb-2 shrink-0">
          <CardTitle className="text-primary text-base">
            Usuários do Sistema ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-hidden flex-1 flex flex-col min-h-0">
          <div className="w-full overflow-x-auto flex-1 flex flex-col min-h-0">
            <div className="h-[506px] lg:h-auto lg:flex-1 overflow-y-auto min-h-0">
              <Table className="table-fixed min-w-[800px] w-full border-separate border-spacing-0">
              <TableHeader className="sticky top-0 z-10 bg-slate-50/50">
                <TableRow className="h-9">
                  <TableHead
                    className={cn(
                      colWidths[0],
                      "uppercase text-[11px] tracking-wider font-bold pl-6 text-slate-900 text-center border-b border-slate-100",
                    )}
                  >
                    Usuário
                  </TableHead>
                  <TableHead
                    className={cn(
                      colWidths[1],
                      "uppercase text-[11px] tracking-wider font-bold text-slate-900 text-center border-b border-slate-100",
                    )}
                  >
                    Nível de Acesso
                  </TableHead>
                  <TableHead
                    className={cn(
                      colWidths[2],
                      "uppercase text-[11px] tracking-wider font-bold text-slate-900 text-center border-b border-slate-100",
                    )}
                  >
                    Data de Criação
                  </TableHead>
                  <TableHead
                    className={cn(
                      colWidths[3],
                      "uppercase text-[11px] tracking-wider font-bold pr-6 text-slate-900 text-center border-b border-slate-100",
                    )}
                  >
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow className="hover:bg-transparent h-[470px]">
                    <TableCell colSpan={4} className="text-center border-b border-slate-100">
                      <div className="flex flex-col items-center justify-center h-full">
                        <Loader2 className="w-12 h-12 animate-spin text-primary opacity-20 mb-4" />
                        <p className="text-[10px] font-bold text-primary tracking-[0.3em] uppercase opacity-40">
                          Buscando Usuários...
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {filteredUsers.length === 0 ? (
                      <TableRow className="hover:bg-transparent h-[470px]">
                        <TableCell
                          colSpan={4}
                          className="text-center text-muted-foreground border-b border-slate-100"
                        >
                          <div className="flex flex-col items-center justify-center h-full">
                            <User className="w-12 h-12 text-slate-200 mb-2" />
                            <p className="text-sm font-medium text-slate-400">
                              Nenhum usuário encontrado
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {filteredUsers.map((user) => (
                          <TableRow
                            key={user.id}
                            className="hover:bg-slate-50/50 transition-colors h-[47px]"
                          >
                            <TableCell
                              className={cn(
                                colWidths[0],
                                "pl-6 py-1 border-b border-slate-100",
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-white text-xs font-medium shrink-0 shadow-sm shadow-primary/20">
                                  {user.name?.charAt(0) || "U"}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-bold text-slate-900 text-sm truncate">
                                    {user.name || "Sem nome"}
                                  </div>
                                  <div className="text-[10px] text-slate-500 font-medium leading-none lowercase truncate">
                                    {user.email}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell
                              className={cn(
                                colWidths[1],
                                "py-1 border-b border-slate-100 text-center",
                              )}
                            >
                              <div className="flex items-center justify-center text-[13px]">
                                {user.role === "ADMIN" ? (
                                  <span className="flex items-center text-primary font-bold">
                                    <Shield className="w-3.5 h-3.5 mr-2 opacity-70" />
                                    Administrador
                                  </span>
                                ) : (
                                  <span className="flex items-center text-slate-500 font-medium">
                                    <User className="w-3.5 h-3.5 mr-2 opacity-60" />
                                    Operador
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell
                              className={cn(
                                colWidths[2],
                                "text-slate-600 text-[13px] font-medium py-1 border-b border-slate-100 text-center",
                              )}
                            >
                              {new Date(user.createdAt).toLocaleDateString(
                                "pt-BR",
                              )}
                            </TableCell>
                            <TableCell
                              className={cn(
                                colWidths[3],
                                "pr-6 py-1 border-b border-slate-100 text-center",
                              )}
                            >
                              <TooltipProvider delayDuration={300}>
                                <div className="flex justify-center gap-0.5">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-slate-400 hover:text-primary transition-colors"
                                        onClick={() => handleOpenEdit(user)}
                                      >
                                        <Edit className="w-3.5 h-3.5" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">
                                      Editar usuário
                                    </TooltipContent>
                                  </Tooltip>

                                  {!(currentUser && currentUser.id === user.id) && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-7 w-7 text-slate-400 hover:text-rose-600 transition-colors"
                                          onClick={() => {
                                            setUserToDelete(user);
                                            setIsDeleteDialogOpen(true);
                                          }}
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent side="top">
                                        Excluir usuário
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                </div>
                              </TooltipProvider>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredUsers.length < 10 &&
                          Array.from({ length: 10 - filteredUsers.length }).map(
                            (_, i) => (
                              <TableRow
                                key={`empty-${i}`}
                                className="h-[47px] hover:bg-transparent"
                              >
                                <TableCell
                                  colSpan={4}
                                  className="border-b border-transparent"
                                />
                              </TableRow>
                            ),
                          )}
                      </>
                    )}
                  </>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Editar Usuário" : "Novo Usuário"}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? "Atualize os dados e o nível de acesso do usuário."
                : "Crie uma nova conta de acesso para o sistema."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label
                htmlFor="userName"
                className="text-sm font-semibold text-slate-700"
              >
                Nome
              </label>
              <Input
                id="userName"
                placeholder="Nome do usuário"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                maxLength={100}
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="userEmail"
                className="text-sm font-semibold text-slate-700"
              >
                E-mail
              </label>
              <Input
                id="userEmail"
                type="email"
                placeholder="email@sicaf.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value.toLowerCase(),
                  })
                }
                maxLength={100}
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="userPassword"
                id="userPasswordLabel"
                className="text-sm font-semibold text-slate-700"
              >
                Nova Senha
              </label>
              <div className="relative">
                <Input
                  id="userPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder={
                    editingUser ? "Deixe em branco para manter" : "••••••••"
                  }
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  maxLength={50}
                  required={!editingUser}
                  className="pr-10"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Nível de Acesso
              </label>
              <Select
                value={formData.role}
                onValueChange={(v: any) =>
                  setFormData({ ...formData, role: v })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um nível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPERA">
                    Operador (Acesso às Carteiras)
                  </SelectItem>
                  <SelectItem value="ADMIN">
                    Administrador (Acesso Total)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {editingUser && (
              <div className="h-[165px] flex items-center">
                <div className="w-full bg-slate-50 p-5 rounded-lg border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Confirmação de Segurança
                  </span>

                  <div className="space-y-4">
                    <label
                      htmlFor="adminConfirmPassword"
                      className="text-sm font-semibold text-slate-700 block"
                    >
                      {editingUser?.role === "ADMIN"
                        ? "Para alterar os dados de outro Administrador, insira a SENHA DELE:"
                        : "Para alterar os dados deste Operador, insira a SUA SENHA de administrador:"}
                    </label>
                    <div className="relative">
                      <Input
                        id="adminConfirmPassword"
                        type={showPassword ? "text" : "password"}
                        maxLength={50}
                        placeholder={
                          editingUser?.role === "ADMIN"
                            ? "Senha do administrador alvo"
                            : "Sua senha de administrador"
                        }
                        value={adminConfirmPassword}
                        onChange={(e) => {
                          setAdminConfirmPassword(e.target.value);
                          setHasPasswordError(false);
                        }}
                        required
                        className={cn(
                          "bg-white h-11",
                          hasPasswordError &&
                            "border-rose-500 focus-visible:ring-rose-500 bg-rose-50/30",
                        )}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="pt-4 flex flex-col-reverse sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="sm:flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="sm:flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                    Salvando...
                  </>
                ) : (
                  "Salvar Usuário"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl text-slate-900">
              Confirmar exclusão
            </AlertDialogTitle>

            <AlertDialogDescription asChild>
              <div className="text-muted-foreground text-sm space-y-4 pt-2">
                <div className="text-slate-600">
                  Tem certeza que deseja remover o usuário{" "}
                  <span className="font-bold text-slate-900">
                    {userToDelete?.name}
                  </span>
                  ? Esta ação revogará imediatamente o acesso dele ao sistema.
                </div>

                <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 space-y-5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Confirmação de Segurança
                  </span>

                  <div className="space-y-4">
                    <label
                      htmlFor="deleteConfirmPassword"
                      className="text-sm font-semibold text-slate-700 block"
                    >
                      {userToDelete?.role === "ADMIN"
                        ? "Para remover outro Administrador, insira a SENHA DELE:"
                        : "Para remover este Operador, insira a SUA SENHA de administrador:"}
                    </label>
                    <div className="relative">
                      <Input
                        id="deleteConfirmPassword"
                        name="deleteConfirmPassword"
                        autoComplete="new-password"
                        data-form-type="other"
                        type={showPassword ? "text" : "password"}
                        maxLength={50}
                        placeholder={
                          userToDelete?.role === "ADMIN"
                            ? "Senha do administrador alvo"
                            : "Sua senha de administrador"
                        }
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-white h-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel
              onClick={() => {
                setConfirmPassword("");
                setUserToDelete(null);
                setIsDeleteDialogOpen(false);
              }}
            >
              Cancelar
            </AlertDialogCancel>
            <Button
              onClick={(e) => handleDelete(e)}
              disabled={!confirmPassword}
              className="bg-rose-600 hover:bg-rose-700"
            >
              Remover Usuário
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
