"use client";

import { EstoqueContent } from "@/components/estoque-content";
import { useFrutmaxData } from "@/hooks/use-frutmax-data";

export default function EstoquePage() {
    const {
        frutas,
        categorias,
        fornecedores,
        addFruta,
        updateFruta,
        deleteFruta,
        getFruta
    } = useFrutmaxData();

    return (
        <EstoqueContent
            frutas={frutas}
            categorias={categorias}
            fornecedores={fornecedores}
            onAdd={addFruta}
            onUpdate={updateFruta}
            onDelete={deleteFruta}
            getFruta={getFruta}
        />
    );
}
