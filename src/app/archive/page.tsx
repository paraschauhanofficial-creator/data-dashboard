"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import HeaderActions from "@/components/HeaderActions";
import { supabase } from "@/lib/supabase";
import { RotateCcw } from "lucide-react";

export default function ArchivePage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("archived", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setProjects(data || []);
  }

  async function handleRestoreProject(projectId: string) {
    const confirmed = window.confirm(
      "Restore this project?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("projects")
      .update({
        archived: false,
      })
      .eq("id", projectId);

    if (error) {
      console.error(error);
      return;
    }

    await fetchProjects();
  }

  const filteredProjects = projects.filter(
    (project: any) =>
      project.project_no
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      project.client
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      project.project_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#1A1A1A] text-white px-4 md:px-8 py-6">

      <div className="flex justify-between items-start mb-8">

  <div>
    <h1 className="text-2xl font-semibold tracking-wide">
      Archive
    </h1>

    <p className="mt-1 text-sm text-gray-400">
      Manage archived projects.
    </p>
  </div>

  <HeaderActions hideArchive />

</div>

      <div className="mb-8">
        <Navbar />
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search project number, client, or project name..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          className="w-full bg-[#242424] border border-[#333333] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2ABEFF]/40"
        />
      </div>

      <div className="bg-[#242424] border border-[#333333] rounded-2xl overflow-x-auto">

        <div className="min-w-[1000px]">

          <div className="grid grid-cols-[120px_250px_1fr_150px] gap-4 px-6 py-4 border-b border-[#333333] text-xs uppercase tracking-wider text-gray-500">
            <div>Project No.</div>
            <div>Client</div>
            <div>Project Name</div>
            <div>Actions</div>
          </div>

          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="grid grid-cols-[120px_250px_1fr_150px] gap-4 px-6 py-4 border-b border-[#333333] text-gray-500 hover:text-gray-300 transition-colors"
            >
              <div className="text-gray-500">
              {project.project_no}
              </div>

              <div className="text-gray-400">
              {project.client}
              </div>

               <div className="text-gray-400">
               {project.project_name}
               </div>

              <div>
                <button
                  onClick={() =>
                    handleRestoreProject(project.id)
                  }
                  className="text-gray-400 hover:text-[#63D38B]"
                >
                  <RotateCcw size={18} />
                </button>
              </div>
            </div>
          ))}

        </div>

      </div>

    </main>
  );
}