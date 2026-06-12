import { supabase } from "@/lib/supabase";

export default async function DataProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  return (
    <main className="min-h-screen bg-[#1A1A1A] text-white px-8 py-6">
      <h1 className="text-2xl font-semibold mb-2">
        {project?.project_name}
      </h1>

      <p className="text-gray-400">
        {project?.project_no} • {project?.client}
      </p>
    </main>
  );
}