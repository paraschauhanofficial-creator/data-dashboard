"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  project: any;
};

export default function DataProjectRow({
  project,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [receivedDate, setReceivedDate] = useState("");
  const [dataType, setDataType] = useState("VLX");
  const [scanCount, setScanCount] = useState("");

  async function handleSaveEntry() {
  try {
    if (!receivedDate || !scanCount) {
      alert("Please complete all fields.");
      return;
    }

    console.log("PROJECT:", project);

    const payload = {
      project_id: project.id,
      received_date: receivedDate,
      data_type: dataType,
      scan_count: Number(scanCount),
    };

    console.log("PAYLOAD:", payload);

    const { data, error } = await supabase
      .from("data_entries")
      .insert([payload])
      .select();

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Entry saved successfully!");

    setReceivedDate("");
    setDataType("VLX");
    setScanCount("");

    setShowModal(false);

    window.location.reload();
  } catch (err) {
    console.error("SAVE ERROR:", err);
    alert("Unexpected error. Check browser console.");
  }
}

  return (
    <>
      <div className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-[#333333] items-center">

        <div>{project.project_no}</div>

        <div>{project.client}</div>

        <div className="col-span-2">
          {project.project_name}
        </div>

        <div className="flex justify-between items-center">

          <span>
           {project.data_entries?.length || 0} Entries
          </span>

          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-400 hover:text-[#00B7FF] transition-all duration-300"
          >
            {expanded ? "▼" : "▶"}
          </button>

        </div>

      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          expanded
            ? "max-h-[600px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-[#1F1F1F] px-12 py-4 border-b border-[#333333]">

          <div className="flex items-center justify-between">

            <div>

  {project.data_entries?.length ? (

    <div className="space-y-2">

      {project.data_entries.map((entry: any) => (

        <div
          key={entry.id}
          className="grid grid-cols-4 gap-4 text-sm py-2 border-b border-[#333333]"
        >
          <div>{entry.received_date}</div>
          <div>{entry.data_type}</div>
          <div>{entry.scan_count} scans</div>
          <div>{entry.status}</div>
        </div>

      ))}

    </div>

  ) : (

    <div className="text-sm text-gray-400">
      No data entries yet
    </div>

  )}

</div>

            <button
              onClick={() => setShowModal(true)}
              className="text-[#00B7FF] hover:text-[#33C7FF]"
            >
              + Add Entry
            </button>

          </div>

        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="w-[700px] max-h-[90vh] overflow-y-auto bg-[#242424] border border-[#333333] rounded-2xl p-6">

            <h2 className="text-xl font-semibold mb-6">
              Add Data Entry
            </h2>

            <div className="space-y-5">

              <div>
                <label className="block text-sm font-medium mb-1">
                  Date Received
                </label>

                <p className="text-xs text-gray-500 mb-2">
                  When this scan package was received from IVION.
                </p>

                <input
                 type="date"
                   value={receivedDate}
                 onChange={(e) => setReceivedDate(e.target.value)}
                 className="w-full bg-[#1A1A1A] border border-[#333333] rounded-xl px-4 py-3"
                 />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Data Type
                </label>

                <p className="text-xs text-gray-500 mb-2">
                  Select the incoming scan source.
                </p>

                <select
                 value={dataType}
                 onChange={(e) => setDataType(e.target.value)}
                 className="w-full bg-[#1A1A1A] border border-[#333333] rounded-xl px-4 py-3"
                >
                  <option>VLX</option>
                  <option>MLX</option>
                  <option>Revo</option>
                  <option>RTC</option>
                  <option>Aerial</option>
                  <option>XGridz</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Scan Count
                </label>

                <p className="text-xs text-gray-500 mb-2">
                  Total number of scans received in this delivery.
                </p>

                <input
                type="number"
                value={scanCount}
                 onChange={(e) => setScanCount(e.target.value)}
                  placeholder="Enter scan count"
                  className="w-full bg-[#1A1A1A] border border-[#333333] rounded-xl px-4 py-3"
                />
              </div>

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-400"
              >
                Cancel
              </button>

              <button
               onClick={handleSaveEntry}
                className="px-4 py-2 text-[#00B7FF]"
              >
             Save
             </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}