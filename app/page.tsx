"use client";

import { DashboardContent } from "@/components/dashboard-content";
import { useFrutmaxData } from "@/hooks/use-frutmax-data";

export default function Page() {
  const { dashboard, frutas } = useFrutmaxData();

  return <DashboardContent dashboard={dashboard} frutas={frutas} />;
}
