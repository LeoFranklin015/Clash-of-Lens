import ClanProfile from "@/components/clan-profile"

interface ClanPageProps {
  params: {
    id: string
  }
}

export default function ClanPage({ params }: ClanPageProps) {
  // In a real app, you would fetch the clan data based on the ID
  // For now, we'll just check if the ID follows our pattern

  return <ClanProfile clanId={params.id} />
}
