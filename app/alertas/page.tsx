"use client";

import { AlertasContent } from "@/components/alertas-content";
import { useFrutmaxData } from "@/hooks/use-frutmax-data";

export default function AlertasPage() {
    const { frutas } = useFrutmaxData();

    return <AlertasContent frutas={frutas} />;
}
