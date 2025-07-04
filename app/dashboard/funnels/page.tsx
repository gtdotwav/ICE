import { FunnelsHeader } from "@/components/dashboard/funnels/funnels-header"
import { FunnelsTable } from "@/components/dashboard/funnels/funnels-table"

export default function FunnelsPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <FunnelsHeader />
      <FunnelsTable />
    </main>
  )
}
