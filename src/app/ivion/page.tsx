"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import HeaderActions from "@/components/HeaderActions";
import IvionRow from "@/components/ivion/ivionrow";

export default function IvionPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [sortBy, setSortBy] = useState("newest");
const [statusFilter, setStatusFilter] = useState("all");

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

  const filteredProjects = [...projects]
  .filter((project: any) => {
    const matchesSearch =
      project.project_no
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      project.client
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      project.project_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      project.ivion_status === statusFilter;

    return matchesSearch && matchesStatus;
  })
  .sort((a: any, b: any) => {
    switch (sortBy) {
      case "az":
        return a.project_name.localeCompare(b.project_name);

      case "za":
        return b.project_name.localeCompare(a.project_name);

      case "projectAsc":
        return a.project_no.localeCompare(b.project_no);

      case "projectDesc":
        return b.project_no.localeCompare(a.project_no);

      case "oldest":
        return (
          new Date(a.created_at).getTime() -
          new Date(b.created_at).getTime()
        );

      case "newest":
      default:
        return (
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
        );
    }
  });








  return (
    <main className="min-h-screen bg-[#1A1A1A] text-white px-4 md:px-8 py-6">
      <div className="flex justify-between items-start mb-8">

  <div>
    <h1 className="text-2xl font-semibold tracking-wide">
      IVION
    </h1>

    <p className="mt-1 text-sm text-gray-400">
      IVION workflow management.
    </p>
  </div>

  <HeaderActions />

</div>

      <div className="mb-8">
        <Navbar />
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">

  <input
    type="text"
    placeholder="Search project number, client, or project name..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="flex-1 bg-[#242424] border border-[#333333] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2ABEFF]/40"
  />

  <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    className="bg-[#242424] border border-[#333333] rounded-xl px-4 py-3 text-sm"
  >
    <option value="newest">Newest First</option>
    <option value="oldest">Oldest First</option>
    <option value="az">Project Name A-Z</option>
    <option value="za">Project Name Z-A</option>
    <option value="projectAsc">Project No Asc</option>
    <option value="projectDesc">Project No Desc</option>
  </select>

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="bg-[#242424] border border-[#333333] rounded-xl px-4 py-3 text-sm"
  >
    <option value="all">All Statuses</option>
    <option value="Incoming">Incoming</option>
    <option value="Processed">Processed</option>
    <option value="Aligned">Aligned</option>
    <option value="Pending">Pending</option>
  </select>

</div>

      <div className="bg-[#242424] border border-[#333333] rounded-2xl overflow-x-auto overflow-y-auto max-h-[70vh]">

        <div className="min-w-[900px]">

          <div className="sticky top-0 z-20 grid grid-cols-[150px_350px_1fr_200px_120px_100px] gap-5 px-6 py-4 border-b border-[#333333] bg-[#242424] text-xs uppercase tracking-wider text-gray-500">
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