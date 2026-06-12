"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";


import {
  Eye,
  Pencil,
  Archive,
} from "lucide-react";

export default function ProjectsPage() {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);

    const [projects, setProjects] = useState<any[]>([]);
    

    const [projectNo, setProjectNo] = useState("");
    const [client, setClient] = useState("");
    const [projectName, setProjectName] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
   
    useEffect(() => {
    fetchProjects();
                   }, []);

    async function fetchProjects() {
    const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("archived", false)
    .order("created_at", { ascending: false });

    if (error) {
    console.error(error);
    return;
  }

  setProjects(data || []);
}
    const handleCreateProject = async () => {
  if (!projectNo || !client || !projectName) return;

  const { error } = await supabase
    .from("projects")
    .insert([
      {
        project_no: projectNo,
        client,
        project_name: projectName,
        data_status: "Pending",
        ivion_status: "Pending",
        archived: false,
      },
    ]);

  if (error) {
    console.error(error);
    return;
  }

  await fetchProjects();

  setProjectNo("");
  setClient("");
  setProjectName("");
  setShowModal(false);
};
const handleArchiveProject = (indexToRemove: number) => {
  const confirmed = window.confirm(
    "Archive this project?"
  );

  if (!confirmed) return;

  setProjects(
    projects.filter((_, index) => index !== indexToRemove)
  );
};
const filteredProjects = projects.filter((project: any) =>
  project.project_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  project.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  project.project_name?.toLowerCase().includes(searchTerm.toLowerCase())
);
  return (
    <main className="min-h-screen bg-[#1A1A1A] text-white px-8 py-6">

      {/* Page Header */}

      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-wide">
          Projects
        </h1>

        <p className="mt-1 text-sm text-gray-400">
          Manage active projects.
        </p>
      </div>

      {/* Navigation */}

      <div className="flex items-center justify-between mb-8">
        <Navbar />

        <Button onClick={() => setShowModal(true)}>
                Add Project
        </Button>
      </div>
      <div className="mb-6">
  <input
    type="text"
    placeholder="Search project number, client, or project name..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full bg-[#242424] border border-[#333333] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2ABEFF]/40"
  />
</div>

      {/* Projects Table */}

      <div className="bg-[#242424] border border-[#333333] rounded-2xl overflow-hidden">

        {/* Table Header */}

        <div className="grid grid-cols-8 gap-4 px-6 py-4 border-b border-[#333333] text-xs uppercase tracking-wider text-gray-500">

          <div>Project No.</div>
          <div>Client</div>
          <div className="col-span-2">Project Name</div>
          <div>Created</div>
          <div>Data Status</div>
          <div>IVION Status</div>
          <div>Actions</div>

        </div>

        {/* Sample Row */}

        {filteredProjects.map((project, index) => (
  <div
    key={index}
    className="grid grid-cols-8 gap-4 px-6 py-4 items-center border-b border-[#333333] hover:bg-[#2A2A2A] transition-all"
  >
    <div className="font-medium">
      {project.project_no}
    </div>

    <div className="text-gray-300">
      {project.client}
    </div>

    <div className="col-span-2">
      {project.project_name}
    </div>

    <div className="text-gray-400">
      {new Date(project.created_at).toLocaleDateString("en-GB")}
    </div>

    <div>
      <span className="px-2 py-1 rounded-md border border-[#6B4A2A] text-[#D89B52] text-xs">
        {project.data_status}
      </span>
    </div>

    <div>
      <span className="px-2 py-1 rounded-md border border-[#2E5B3D] text-[#63D38B] text-xs">
        {project.ivion_status}
      </span>
    </div>

    <div className="flex items-center gap-4">

      <button
       onClick={() => {
        alert(project.id);
       router.push(`/projects/${project.id}`);
       }}
         className="text-gray-400 hover:text-[#00B7FF]"
        >
       <Eye size={16} />
      </button>

      <button
       onClick={() => router.push(`/projects/${project.id}/edit`)}
       className="text-gray-400 hover:text-[#D89B52]"
      >
  <Pencil size={16} />
</button>

      <button
        onClick={() => handleArchiveProject(index)}
        className="text-gray-400 hover:text-[#E57373]"
      >
       <Archive size={16} />
      </button>

    </div>
  </div>
))}

      </div>
       
       {showModal && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

    <div className="w-[500px] bg-[#242424] border border-[#333333] rounded-2xl p-6">

      <h2 className="text-xl font-semibold mb-6">
        Add Project
      </h2>

      <div className="space-y-4">

        <input
          value={projectNo}
          onChange={(e) => setProjectNo(e.target.value)}
          placeholder="Project Number"
          className="w-full bg-[#1A1A1A] border border-[#333333] rounded-xl px-4 py-3 outline-none"
        />

        <input
         value={client}
           onChange={(e) => setClient(e.target.value)}
           placeholder="Client Name"
          className="w-full bg-[#1A1A1A] border border-[#333333] rounded-xl px-4 py-3 outline-none"
        />

        <input
           value={projectName}
           onChange={(e) => setProjectName(e.target.value)}
           placeholder="Project Name"
          className="w-full bg-[#1A1A1A] border border-[#333333] rounded-xl px-4 py-3 outline-none"
        />

      </div>

      <div className="flex justify-end gap-3 mt-6">

        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 text-gray-400"
        >
          Cancel
        </button>

        <Button onClick={handleCreateProject}>
         Create Project
         </Button>

      </div>

    </div>

  </div>
)}

    </main>
  );
}