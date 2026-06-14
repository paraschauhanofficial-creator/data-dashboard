"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import IvionRow from "@/components/ivion/ivionrow";

export default function IvionPage() {
  const [projects, setProjects] = useState<any[]>([]);
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

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search project number, client, or project name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#242424] border border-[#333333] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2ABEFF]/40"
        />
      </div>

      <div className="bg-[#242424] border border-[#333333] rounded-2xl overflow-x-auto">

        <div className="min-w-[900px]">

          <div className="grid grid-cols-[150px_350px_1fr_200px_120px_100px] gap-5 px-6 py-4 border-b border-[#333333] text-xs uppercase tracking-wider text-gray-500">
           <div>Project No.</div>
           <div>Client</div>
           <div>Project Name</div>
           <div>IVION Status</div>
           <div>Bundle Saved</div>
           <div>Deleted</div>
          </div>

          {filteredProjects.map((project) => (
            <IvionRow
              key={project.id}
              project={project}
            />
          ))}

        </div>

      </div>
    </main>
  );
}