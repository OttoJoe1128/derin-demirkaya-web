import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function RootShopDetailPage({ params }: Props) {
  const { id } = await params;
  redirect(`/tr/shop/${id}`);
}
