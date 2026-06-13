"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Eye, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Home() {
  const [projects, setProjects] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

const [projectNo, setProjectNo] = useState("");
const [client, setClient] = useState("");
const [projectName, setProjectName] = useState("");
  const router = useRouter();

  useEffect(() => {
  fetchProjects();
}, []);

async function handleCreateProject() {
  if (!projectNo || !client || !projectName) return;

  const { error } = await supabase
    .from("projects")
    .insert([
      {
        project_no: projectNo,
        client,
        project_name: projectName,
        data_status: "Pending Alignment",
        ivion_status: "Incoming",
        bundle_saved: false,
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
}

  async function fetchProjects() {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("archived", false);

    setProjects(data || []);
  }



  const pendingAlignment = projects.filter(
  (p) => p.data_status === "Pending Alignment"
).length;

const pendingQc = projects.filter(
  (p) =>
    p.data_status === "Pending Alignment" ||
    p.data_status === "Pending QC" ||
    p.data_status === "Missing Area" ||
    p.data_status === "Missing Scan" ||
    p.data_status === "Data Slips"
).length;

const readyForHandover = projects.filter(
  (p) => p.data_status === "Ready for Handover"
).length;

const qcIssues = projects.filter(
  (p) =>
    p.data_status === "Missing Scan" ||
    p.data_status === "Missing Area" ||
    p.data_status === "Data Slips"
).length;


const activeOnIvion = projects.filter(
  (p) => p.ivion_status === "Aligned"
).length;

const pendingIvionDeletion = projects.filter(
  (p) =>
    p.ivion_status === "Aligned" &&
    p.bundle_saved === true
).length;



const openTasks =
  pendingAlignment +
  pendingQc +
  pendingIvionDeletion;




const queueItems: any[] = [];

projects.forEach((project) => {
  // REVIT TASKS

  if (project.data_status === "Pending Alignment") {
    queueItems.push({
      source: "REVIT",
      project,
      task: "Pending Alignment",
      color: "orange",
    });
  }

  if (
    project.data_status === "Pending QC" ||
    project.data_status === "Missing Area" ||
    project.data_status === "Missing Scan" ||
    project.data_status === "Data Slips"
  ) {
    queueItems.push({
      source: "REVIT",
      project,
      task: project.data_status,
      color: "yellow",
    });
  }

  // IVION TASKS

  if (
    project.ivion_status === "Incoming" ||
    project.ivion_status === "Processed"
  ) {
    queueItems.push({
      source: "IVION",
      project,
      task: "Pending Alignment",
      color: "orange",
    });
  }

  if (
    project.ivion_status === "Aligned" &&
    !project.bundle_saved
  ) {
    queueItems.push({
      source: "IVION",
      project,
      task: "Bundle Backup",
      color: "yellow",
    });
  }

  if (
    project.ivion_status === "Aligned" &&
    project.bundle_saved
  ) {
    queueItems.push({
      source: "IVION",
      project,
      task: "Pending Deletion",
      color: "red",
    });
  }
});





  return (
    <main className="min-h-screen bg-[#1A1A1A] text-white px-4 md:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-wide">
          Data Management
        </h1>

        <p className="mt-1 text-sm text-gray-400">
          Data updates and tracking.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
  <Navbar />

  <Button onClick={() => setShowModal(true)}>
  Add Project
</Button>


</div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
  <Card
  title="Active Projects"
  value={projects.length}
  bgColor="#1B2D3A"
  borderColor="#2F4E68"
/>

  <Card
  title="Active on IVION"
  value={activeOnIvion}
  bgColor="#1E3326"
  borderColor="#2E5B3D"
/>

  <Card
  title="Pending Revit Alignment"
  value={pendingAlignment}
  bgColor="#3A2A1E"
  borderColor="#6B4A2A"
/>

<Card
  title="Pending Scan QC"
  value={pendingQc}
  bgColor="#3A2A1E"
  borderColor="#6B4A2A"
/>

  <Card
  title="Pending IVION Deletion"
  value={pendingIvionDeletion}
  bgColor="#3A1F1F"
  borderColor="#6A3030"
/>


</div>
<div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
  {/* Project Pipeline */}

  <div className="bg-[#242424] border border-[#333333] rounded-2xl p-6 h-[500px] flex flex-col">
    <h2 className="text-lg font-semibold mb-6">
      Task Distribution
    </h2>

    <div className="flex flex-col items-center justify-center flex-1">

  <div className="relative flex items-center justify-center">

    <div
  className="w-64 h-64 rounded-full"
  style={{
    background: `conic-gradient(
      #D89B52 0 ${pendingAlignment * 360 / Math.max(openTasks, 1)}deg,
      #FACC15 ${pendingAlignment * 360 / Math.max(openTasks, 1)}deg ${
        (pendingAlignment + pendingQc) * 360 / Math.max(openTasks, 1)
      }deg,
      #E57373 ${
        (pendingAlignment + pendingQc) * 360 / Math.max(openTasks, 1)
      }deg 360deg
    )`,
  }}
>
  <div className="w-full h-full rounded-full bg-[#242424] scale-[0.72]" />
</div>

    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <span className="text-4xl font-bold">
  {openTasks}
</span>

      <span className="text-sm text-gray-400">
        Open Tasks
      </span>
    </div>

  </div>

  <div className="mt-8 grid grid-cols-2 gap-x-10 gap-y-4 text-sm max-w-md">


    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-[#D89B52]" />
      <span>RVT Alignment ({pendingAlignment})</span>
    </div>

    <div className="flex items-center gap-2">
  <div className="w-2.5 h-2.5 rounded-full bg-[#FACC15]" />
  <span>Scan QC ({pendingQc})</span>
</div>

    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-[#E57373]" />
      <span>IVION Deletion ({pendingIvionDeletion})</span>
    </div>

  </div>

</div>

  </div>

  {/* Active Queue */}

<div className="bg-[#242424] border border-[#333333] rounded-2xl p-6 h-[500px] flex flex-col">
  <h2 className="text-base font-semibold tracking-wide mb-4">
  Active Queue
</h2>



<div className="overflow-x-auto flex-1">

  <div className="min-w-[700px]">

    <div className="grid grid-cols-[65px_45px_120px_1fr_120px_60px] gap-4 px-1 pb-3 text-[11px] uppercase tracking-wider text-gray-500 border-b border-[#333333]">

      <div>Source</div>
      <div>ID</div>
      <div>Client</div>
      <div>Project</div>
      <div>Task</div>
      <div></div>

    </div>

    <div className="overflow-y-auto flex-1">

      {queueItems.map((item, index) => {
        let badgeClass =
          "border-[#6B4A2A] text-[#D89B52]";

        if (item.color === "yellow") {
          badgeClass =
            "border-[#EAB308] text-[#FACC15]";
        }

        if (item.color === "red") {
          badgeClass =
            "border-[#6A3030] text-[#E57373]";
        }

        return (
          <div
            key={index}
            className="grid grid-cols-[60px_50px_120px_1fr_140px_60px] gap-4 items-center py-3 border-b border-[#333333]"
          >
            <div
              className={`text-[10px] uppercase tracking-[0.15em] ${
                item.source === "IVION"
                  ? "text-[#63D38B]"
                  : "text-[#B88A4A]"
              }`}
            >
              {item.source}
            </div>

            <div className="text-gray-500">
              {item.project.project_no}
            </div>

            <div className="text-gray-300">
              {item.project.client}
            </div>

            <div className="truncate">
              {item.project.project_name}
            </div>

            <div>
              <span
                className={`px-2 py-1 rounded-md border text-xs ${badgeClass}`}
              >
                {item.task}
              </span>
            </div>

            <div className="flex justify-end">
              <button className="text-gray-400 hover:text-[#00B7FF]">
                <Eye size={15} />
              </button>
            </div>
          </div>
        );
      })}

    </div>

  </div>


</div>



</div>
</div>


{showModal && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

    <div className="w-[95%] max-w-[500px] bg-[#242424] border border-[#333333] rounded-2xl p-6">

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