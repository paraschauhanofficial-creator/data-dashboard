import BackButton from "@/components/BackButton";
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
        <BackButton />

        <div className="mt-6">
          Project not found
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#1A1A1A] text-white p-8">

      <BackButton />

      <h1 className="text-2xl font-semibold mt-6 mb-6">
        Project Details
      </h1>

      <div className="bg-[#242424] border border-[#333333] rounded-2xl p-6 max-w-3xl">

        <div className="space-y-6">

          <div>
            <p className="text-sm text-gray-400">
              Project Number
            </p>
            <p>{project.project_no}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400">
              Client
            </p>
            <p>{project.client}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400">
              Project Name
            </p>
            <p>{project.project_name}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400">
              Data Status
            </p>
            <p>{project.data_status}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400">
              IVION Status
            </p>
            <p>{project.ivion_status}</p>
          </div>

        </div>

      </div>

    </main>
  );
}