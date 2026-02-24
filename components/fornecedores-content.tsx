"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Users, MoreVertical, Pencil, Trash2, Mail, Phone, MapPin } from "lucide-react";
import type { Fornecedor } from "@/lib/api";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FornecedoresContentProps {
    fornecedores: Fornecedor[];
    onAdd: (data: Partial<Fornecedor>) => Promise<any>;
    onUpdate: (id: number, data: Partial<Fornecedor>) => Promise<any>;
    onDelete: (id: number) => Promise<any>;
}

export function FornecedoresContent({
    fornecedores,
    onAdd,
    onUpdate,
    onDelete
}: FornecedoresContentProps) {
    const [formOpen, setFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Fornecedor | null>(null);
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [endereco, setEndereco] = useState("");
    const [loading, setLoading] = useState(false);

    const handleOpenAdd = () => {
        setEditingItem(null);
        setNome("");
        setEmail("");
        setTelefone("");
        setEndereco("");
        setFormOpen(true);
    };

    const handleOpenEdit = (item: Fornecedor) => {
        setEditingItem(item);
        setNome(item.nome);
        setEmail(item.email || "");
        setTelefone(item.telefone);
        setEndereco(item.endereco);
        setFormOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = { nome, email: email || null, telefone, endereco };
            if (editingItem) {
                await onUpdate(editingItem.id, data);
                toast.success("Fornecedor atualizado com sucesso!");
            } else {
                await onAdd(data);
                toast.success("Fornecedor criado com sucesso!");
            }
            setFormOpen(false);
        } catch (error) {
            toast.error("Erro ao salvar fornecedor.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("Deseja realmente excluir este fornecedor?")) {
            try {
                await onDelete(id);
                toast.success("Fornecedor excluído com sucesso!");
            } catch (error) {
                toast.error("Erro ao excluir fornecedor.");
            }
        }
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">
                        Fornecedores
                    </h2>
                    <p className="mt-1 text-muted-foreground">
                        Gerencie os fornecedores de frutas do seu estoque.
                    </p>
                </div>
                <Button onClick={handleOpenAdd} className="w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Fornecedor
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {fornecedores.map((item) => (
                    <div
                        key={item.id}
                        className="group relative flex flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md hover:border-primary/50"
                    >
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-primary/10 p-2.5 transition-colors group-hover:bg-primary/20">
                                <Users className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="font-semibold text-card-foreground line-clamp-1">
                                {item.nome}
                            </h3>
                        </div>

                        <div className="flex flex-col gap-2 pt-2">
                            {item.email && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Mail className="h-4 w-4 shrink-0" />
                                    <span className="truncate">{item.email}</span>
                                </div>
                            )}
                            {item.telefone && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Phone className="h-4 w-4 shrink-0" />
                                    <span>{item.telefone}</span>
                                </div>
                            )}
                            {item.endereco && (
                                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                                    <span className="line-clamp-2">{item.endereco}</span>
                                </div>
                            )}
                        </div>

                        <div className="absolute right-3 top-3">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleOpenEdit(item)}>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => handleDelete(item.id)}
                                        className="text-destructive focus:text-destructive"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Excluir
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                ))}

                {fornecedores.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
                        <Users className="h-12 w-12 text-muted-foreground/30" />
                        <h3 className="mt-4 font-semibold text-muted-foreground">Nenhum fornecedor encontrado</h3>
                        <p className="text-sm text-muted-foreground">Comece cadastrando seus parceiros.</p>
                    </div>
                )}
            </div>

            <Dialog open={formOpen} onOpenChange={setFormOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl">
                            {editingItem ? "Editar Fornecedor" : "Novo Fornecedor"}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
                        <div className="grid gap-2">
                            <Label htmlFor="forn-nome">Nome do Fornecedor</Label>
                            <Input
                                id="forn-nome"
                                placeholder="Ex: Fazenda Boa Fruta"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="forn-email">E-mail</Label>
                                <Input
                                    id="forn-email"
                                    type="email"
                                    placeholder="exemplo@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="forn-tel">Telefone</Label>
                                <Input
                                    id="forn-tel"
                                    placeholder="(00) 00000-0000"
                                    value={telefone}
                                    onChange={(e) => setTelefone(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="forn-end">Endereço</Label>
                            <Textarea
                                id="forn-end"
                                placeholder="Rua, Número, Bairro, Cidade..."
                                value={endereco}
                                onChange={(e) => setEndereco(e.target.value)}
                                rows={3}
                            />
                        </div>
                        <DialogFooter className="mt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setFormOpen(false)}
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Salvando..." : editingItem ? "Salvar Alterações" : "Criar Fornecedor"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
