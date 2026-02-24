"use client";

import { FornecedoresContent } from "@/components/fornecedores-content";
import { useFrutmaxData } from "@/hooks/use-frutmax-data";

export default function FornecedoresPage() {
    const {
        fornecedores,
        addFornecedor,
        updateFornecedor,
        deleteFornecedor
    } = useFrutmaxData();

    return (
        <FornecedoresContent
            fornecedores={fornecedores}
            onAdd={addFornecedor}
            onUpdate={updateFornecedor}
            onDelete={deleteFornecedor}
        />
    );
}
