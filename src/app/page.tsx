import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Eye, Check } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#1A1A1A] text-white px-8 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-wide">
          Data Management
        </h1>

        <p className="mt-1 text-sm text-gray-400">
          Data updates and tracking.
        </p>
      </div>

      <div className="flex items-center justify-between mb-8">
  <Navbar />

  <Button>Add Project</Button>
</div>
      <div className="grid grid-cols-5 gap-4">
  <Card
    title="New Projects Incoming"
    value={24}
    bgColor="#1B2D3A"
    borderColor="#2F4E68"
  />

  <Card
    title="Active on IVION"
    value={87}
    bgColor="#1E3326"
    borderColor="#2E5B3D"
  />

  <Card
    title="Pending Revit Alignment"
    value={12}
    bgColor="#3A2A1E"
    borderColor="#6B4A2A"
  />

  <Card
    title="Pending Scan QC"
    value={8}
    bgColor="#3A2A1E"
    borderColor="#6B4A2A"
  />

  <Card
    title="Pending Ivion Deletion"
    value={3}
    bgColor="#3A1F1F"
    borderColor="#6A3030"
  />
</div>
<div className="grid grid-cols-2 gap-6 mt-8">
  {/* Project Pipeline */}

  <div className="bg-[#242424] border border-[#333333] rounded-2xl p-6 h-[500px] flex flex-col">
    <h2 className="text-lg font-semibold mb-6">
      Task Distribution
    </h2>

    <div className="flex flex-col items-center justify-center flex-1">

  <div className="relative flex items-center justify-center">

    <div className="w-64 h-64 rounded-full border-[36px] border-[#2F4E68]" />

    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <span className="text-4xl font-bold">
        23
      </span>

      <span className="text-sm text-gray-400">
        Open Tasks
      </span>
    </div>

  </div>

  <div className="mt-8 grid grid-cols-2 gap-x-10 gap-y-4 text-sm max-w-md">

    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-[#63D38B]" />
      <span>Active in IVION (3)</span>
    </div>

    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-[#D89B52]" />
      <span>RVT Alignment (12)</span>
    </div>

    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-[#D89B52]" />
      <span>Scan QC (8)</span>
    </div>

    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-[#E57373]" />
      <span>IVION Deletion (3)</span>
    </div>

  </div>

</div>

  </div>

  {/* Active Queue */}

<div className="bg-[#242424] border border-[#333333] rounded-2xl p-6 h-[500px] flex flex-col">
  <h2 className="text-base font-semibold tracking-wide mb-4">
  Active Queue
</h2>

<div className="grid grid-cols-[65px_45px_120px_1fr_120px_60px] gap-4 px-1 pb-3 text-[11px] uppercase tracking-wider text-gray-500 border-b border-[#333333]">

  <div>Source</div>
  <div>ID</div>
  <div>Client</div>
  <div>Project</div>
  <div>Task</div>
  <div></div>

</div>

<div className="overflow-y-auto flex-1">

  {/* Task 1 */}

  <div className="grid grid-cols-[60px_50px_120px_1fr_140px_60px] gap-4 items-center py-3 border-b border-[#333333]">

  <div className="text-[#B88A4A] text-[10px] uppercase tracking-[0.15em]">
    REVIT
  </div>

  <div className="text-gray-500">
    004
  </div>

  <div className="text-gray-300">
    Siemens
  </div>

  <div className="truncate">
    Stroke MRI Analysis
  </div>

  <div>
    <span className="px-2 py-1 rounded-md border border-[#6B4A2A] text-[#D89B52] text-xs">
      RVT Alignment
    </span>
  </div>

  <div className="flex justify-end gap-2">
    <button className="text-gray-400 hover:text-[#00B7FF] hover:scale-110 transition-all">
  <Eye size={15} />
</button>

<button className="text-gray-400 hover:text-[#00FF99] hover:scale-110 transition-all">
  <Check size={15} />
</button>
  </div>

</div>

  {/* Task 2 */}

  <div className="grid grid-cols-[60px_50px_120px_1fr_140px_60px] gap-4 items-center py-3 border-b border-[#333333]">

  <div className="text-[#B88A4A] text-[10px] uppercase tracking-[0.15em]">
    REVIT
  </div>

  <div className="text-gray-500">
    005
  </div>

  <div className="text-gray-300">
    Philips
  </div>

  <div className="truncate">
    Neuro CT Dataset
  </div>

  <div>
    <span className="px-2 py-1 rounded-md border border-[#6B4A2A] text-[#D89B52] text-xs">
      Scan QC
    </span>
  </div>

  <div className="flex justify-end gap-2">
    <button className="text-gray-400 hover:text-[#00B7FF] hover:scale-110 transition-all">
  <Eye size={15} />
</button>

<button className="text-gray-400 hover:text-[#00FF99] hover:scale-110 transition-all">
  <Check size={15} />
</button>
  </div>

</div>

  {/* Task 3 */}

  <div className="grid grid-cols-[60px_50px_120px_1fr_140px_60px] gap-4 items-center py-3 border-b border-[#333333]">

  <div className="text-[#4FA36B] text-[10px] uppercase tracking-[0.15em]">
    IVION
  </div>

  <div className="text-gray-500">
    006
  </div>

  <div className="text-gray-300">
    Canon
  </div>

  <div className="truncate">
    Lung Screening Study
  </div>

  <div>
    <span className="px-2 py-1 rounded-md border border-[#6A3030] text-[#E57373] text-xs">
      IVION Deletion
    </span>
  </div>

  <div className="flex justify-end gap-2">
    <button className="text-gray-400 hover:text-[#00B7FF] hover:scale-110 transition-all">
  <Eye size={15} />
</button>

<button className="text-gray-400 hover:text-[#00FF99] hover:scale-110 transition-all">
  <Check size={15} />
</button>
  </div>

</div>

</div>
</div>
</div>
    </main>
  );
}