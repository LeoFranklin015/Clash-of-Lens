"use client";
import { useParams } from "next/navigation";
import WarDetail from "@/components/war-detail";

export default function WarPage() {
  const { id: warId } = useParams();
  // In a real app, you would fetch the war data based on the ID
  // For now, we'll just check if the ID follows our pattern

  return <WarDetail warId={warId as string} />;
}
