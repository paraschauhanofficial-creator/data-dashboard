import { supabase } from "@/lib/supabase";

export default async function ProjectDetailsPage({
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
      <h1 className="text-2xl font-semibold mb-6">
        Project Details
      </h1>

      <div className="space-y-4">

  <div>
    <p className="text-sm text-gray-400">Project Number</p>
    <p>{project.project_no}</p>
  </div>

  <div>
    <p className="text-sm text-gray-400">Client</p>
    <p>{project.client}</p>
  </div>

  <div>
    <p className="text-sm text-gray-400">Project Name</p>
    <p>{project.project_name}</p>
  </div>

  <div>
    <p className="text-sm text-gray-400">Data Status</p>
    <p>{project.data_status}</p>
  </div>

  <div>
    <p className="text-sm text-gray-400">IVION Status</p>
    <p>{project.ivion_status}</p>
  </div>

</div>
    </main>
  );
}