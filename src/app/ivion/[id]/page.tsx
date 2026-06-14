import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import IvionRow from "@/components/ivion/ivionrow";

export default async function Page({
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

  if (!project) {
    return (
      <main className="min-h-screen bg-[#1A1A1A] text-white p-8">
        Project not found
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#1A1A1A] text-white px-4 md:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">
          {project.project_name}
        </h1>

        <p className="text-gray-400">
          {project.project_no} • {project.client}
        </p>
      </div>

      <div className="mb-8">
        <Navbar />
      </div>

      <div className="bg-[#242424] border border-[#333333] rounded-2xl overflow-hidden">
        <div className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-[#333333] text-xs uppercase tracking-wider text-gray-500">
          <div>Project No.</div>
          <div>Client</div>
          <div>Project Name</div>
          <div>IVION Status</div>
          <div>Bundle Saved</div>
        </div>

        <IvionRow project={project} />
      </div>
    </main>
  );
}