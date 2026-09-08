import MaterialDetailPage from "@/components/pages/MaterialDetailPage";

export default async function MaterialDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MaterialDetailPage materialId={id} />;
}
