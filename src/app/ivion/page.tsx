import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import IvionRow from "@/components/ivion/ivionrow";

export default async function IvionPage() {
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("archived", false)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-[#1A1A1A] text-white p-8">
        Failed to load projects
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#1A1A1A] text-white px-8 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-wide">
          IVION
        </h1>

        <p className="mt-1 text-sm text-gray-400">
          IVION workflow management.
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

        {projects?.map((project) => (
  <IvionRow
    key={project.id}
    project={project}
  />
))}
      </div>
    </main>
  );
}