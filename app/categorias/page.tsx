"use client";

import { CategoriasContent } from "@/components/categorias-content";
import { useFrutmaxData } from "@/hooks/use-frutmax-data";

export default function CategoriasPage() {
    const {
        categorias,
        addCategoria,
        updateCategoria,
        deleteCategoria
    } = useFrutmaxData();

    return (
        <CategoriasContent
            categorias={categorias}
            onAdd={addCategoria}
            onUpdate={updateCategoria}
            onDelete={deleteCategoria}
        />
    );
}
