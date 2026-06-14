import EditProjectForm from "@/components/projects/EditProjectForm";
import { supabase } from "@/lib/supabase";
import BackButton from "@/components/BackButton";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !project) {
    return (
      <main className="min-h-screen bg-[#1A1A1A] text-white p-8">
        Project not found
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#1A1A1A] text-white p-8">
      <BackButton />

      <h1 className="text-2xl font-semibold mb-6">
        Edit Project
      </h1>

      <EditProjectForm project={project} />
    </main>
  );
}