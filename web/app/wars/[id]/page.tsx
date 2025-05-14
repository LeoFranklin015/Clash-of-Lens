import { notFound } from "next/navigation"
import WarDetail from "@/components/war-detail"

interface WarPageProps {
  params: {
    id: string
  }
}

export default function WarPage({ params }: WarPageProps) {
  // In a real app, you would fetch the war data based on the ID
  // For now, we'll just check if the ID follows our pattern
  if (!params.id.startsWith("war-")) {
    notFound()
  }

  return <WarDetail warId={params.id} />
}
