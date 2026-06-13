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
  const [showAlignmentModal, setShowAlignmentModal] = useState(false);

  const [selectedEntryId, setSelectedEntryId] = useState("");
  const [revitVersion, setRevitVersion] = useState("");
  const [alignmentRemarks, setAlignmentRemarks] = useState("");
  const [showQcModal, setShowQcModal] = useState(false);

  const [selectedQcEntryId, setSelectedQcEntryId] = useState("");
  const [qcIssue, setQcIssue] = useState("None");
  const [qcRemarks, setQcRemarks] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState("");

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

    await updateProjectStatus();



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
    


async function handleSaveAlignment() {
  if (!selectedEntryId) {
    alert("Select a Point Cloud entry.");
    return;
  }

  const { error } = await supabase
    .from("data_entries")
    
    .update({
  revit_version: revitVersion,
  alignment_remarks: alignmentRemarks,
  alignment_done: true,
  alignment_date: new Date().toISOString().split("T")[0],
})


    .eq("id", selectedEntryId);


  if (error) {
    alert(error.message);
    return;
  }





await updateProjectStatus();





  setSelectedEntryId("");
  setRevitVersion("2025");
  setAlignmentRemarks("");

  setShowAlignmentModal(false);

  window.location.reload();
}


async function updateProjectStatus() {
  const { data: entries, error } = await supabase
    .from("data_entries")
    .select("*")
    .eq("project_id", project.id)
    .order("received_date", { ascending: false })
    .limit(1);

  if (error || !entries?.length) return;

  const latest = entries[0];

  let status = "Pending Alignment";

  if (latest.alignment_done) {
    status = "Pending QC";
  }

  if (
    latest.qc_done &&
    latest.qc_issues &&
    latest.qc_issues !== "None"
  ) {
    status = latest.qc_issues;
  }

  if (
    latest.qc_done &&
    latest.qc_issues === "None"
  ) {
    status = "Ready for Handover";
  }

  await supabase
    .from("projects")
    .update({
      data_status: status,
    })
    .eq("id", project.id);
}



async function handleSaveQc() {
  if (!selectedQcEntryId) {
    alert("Please select a Point Cloud entry.");
    return;
  }

  const { error } = await supabase
    .from("data_entries")
    
    
    .update({
  qc_issues: qcIssue,
  qc_remarks: qcRemarks,
  qc_done: true,
  qc_date: new Date().toISOString().split("T")[0],
})


    .eq("id", selectedQcEntryId);

   

  if (error) {
    alert(error.message);
    return;
  }



  await updateProjectStatus();



  setSelectedQcEntryId("");
  setQcIssue("None");
  setQcRemarks("");

  setShowQcModal(false);

  window.location.reload();
}


function handleEdit(entry: any) {
  setEditingEntryId(entry.id);

  setReceivedDate(entry.received_date || "");
  setDataType(entry.data_type || "VLX");
  setScanCount(String(entry.scan_count || ""));

  setRevitVersion(entry.revit_version || "2025");
  setAlignmentRemarks(entry.alignment_remarks || "");

  setQcIssue(entry.qc_issues || "None");
  setQcRemarks(entry.qc_remarks || "");

  setShowEditModal(true);
}



async function handleUpdateEntry() {
  const { error } = await supabase
    .from("data_entries")
    .update({
  received_date: receivedDate,
  data_type: dataType,
  scan_count: Number(scanCount),

  revit_version: revitVersion || null,
  alignment_remarks: alignmentRemarks,

  alignment_done: !!revitVersion,
  alignment_date: revitVersion
    ? new Date().toISOString().split("T")[0]
    : null,

  qc_issues: qcIssue || null,
  qc_remarks: qcRemarks,

  qc_done: !!qcIssue,
  qc_date: qcIssue
    ? new Date().toISOString().split("T")[0]
    : null,
})
    .eq("id", editingEntryId);

  if (error) {
    alert(error.message);
    return;
  }



  await updateProjectStatus();



  alert("Entry updated successfully!");

  setEditingEntryId("");

  setReceivedDate("");
  setDataType("VLX");
  setScanCount("");

  setRevitVersion("2025");
  setAlignmentRemarks("");

  setQcIssue("None");
  setQcRemarks("");

  setShowEditModal(false);

  window.location.reload();

  }





  async function handleDeleteEntry(id: string) {
  const confirmed = window.confirm(
    "Delete this entry?"
  );

  if (!confirmed) return;

  const { error } = await supabase
    .from("data_entries")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Entry deleted successfully!");

  window.location.reload();
}






  return (
    <>
      <div className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-[#333333] items-center">

        <div>{project.project_no}</div>

        <div>{project.client}</div>

        <div className="col-span-2">
          {project.project_name}
        </div>

        <div className="flex items-center justify-end whitespace-nowrap">

  <div className="flex items-center gap-6">

    <button
      onClick={() => setShowModal(true)}
      className="text-sm text-[#00B7FF] hover:text-[#33C7FF]"
    >
      + Point Cloud
    </button>

    <button
       onClick={() => setShowAlignmentModal(true)}
       className="text-sm text-[#00B7FF] hover:text-[#33C7FF]"
>
       + Alignment
    </button>

    <button
  onClick={() => setShowQcModal(true)}
  className="text-sm text-[#00B7FF] hover:text-[#33C7FF]"
>
  + QC Issues
</button>

  </div>

  <div className="ml-12 flex items-center gap-4">

    <span className="text-[#333333]">|</span>

    <span className="text-sm text-gray-400">
  
  
  Revit{" "}



{
  project.data_entries
    ?.filter((entry: any) => entry.revit_version)
    ?.sort(
      (a: any, b: any) =>
        Number(b.revit_version) -
        Number(a.revit_version)
    )[0]?.revit_version || "-"
}



</span>

<span className="text-sm text-gray-400">
  {project.data_entries?.length || 0} Entries
</span>

    <button
      onClick={() => setExpanded(!expanded)}
      className="text-gray-400 hover:text-[#00B7FF]"
    >
      {expanded ? "▼" : "▶"}
    </button>

  </div>

</div>

      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          expanded
            ? "max-h-[600px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-[#1F1F1F] px-6 py-3 border-b border-[#333333]">

          <div className="flex items-center justify-between">

            <div>

  {project.data_entries?.length ? (

    <div className="space-y-2">

      <div className="space-y-2">


  <div className="grid grid-cols-[1.2fr_1fr_0.8fr_0.8fr_1fr_1.2fr_1fr_1fr] gap-4 text-xs uppercase tracking-wider text-gray-500 pb-2 border-b border-[#333333]">
  <div>Date</div>
  <div>Type</div>
  <div>Scans</div>
  <div>Revit</div>
  <div>Align Date</div>
  <div>QC Issue</div>
  <div>QC Date</div>
  <div className="text-center">Edit / Delete</div>
</div>


  {[...project.data_entries]
  .sort(
    (a: any, b: any) =>
      new Date(b.received_date).getTime() -
      new Date(a.received_date).getTime()
  )
  .map((entry: any) => (


  <div
    key={entry.id}
    className="grid grid-cols-[1.2fr_1fr_0.8fr_0.8fr_1fr_1.2fr_1fr_1fr] gap-4 py-3 text-sm items-center border-b border-[#2A2A2A]"
  >
    <div>{entry.received_date}</div>

    <div>{entry.data_type}</div>

    <div>{entry.scan_count}</div>

    <div>
      {entry.revit_version || (
        <span className="text-gray-500">
          Pending
        </span>
      )}
    </div>

    <div>
      {entry.alignment_date || (
        <span className="text-gray-500">
          -
        </span>
      )}
    </div>

    <div>
      {entry.qc_issues || (
        <span className="text-gray-500">
          Pending
        </span>
      )}
    </div>




    <div>
      {entry.qc_date || (
        <span className="text-gray-500">
          -
        </span>
      )}
    </div>



    <div className="flex items-center justify-center gap-6">

  <button
    onClick={() => handleEdit(entry)}
    className="text-[#00B7FF] hover:text-[#33C7FF] text-base"
    title="Edit"
  >
    ✎
  </button>

  <button
    onClick={() => handleDeleteEntry(entry.id)}
    className="text-red-400 hover:text-red-300 text-base"
    title="Delete"
  >
    🗑
  </button>

</div>




  </div>
))}



</div>

    </div>

  ) : (

    <div className="text-sm text-gray-400">
      No data entries yet
    </div>

  )}

</div>

            

          </div>

        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="w-[700px] max-h-[90vh] overflow-y-auto bg-[#242424] border border-[#333333] rounded-2xl p-6">

            <h2 className="text-xl font-semibold mb-6">
              Add Point Cloud
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
      {showAlignmentModal && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

    <div className="w-[700px] bg-[#242424] border border-[#333333] rounded-2xl p-6">

      <h2 className="text-xl font-semibold mb-6">
        Add Alignment
      </h2>

      <div className="space-y-5">

        <div>
          <label className="block text-sm font-medium mb-2">
            Select Point Cloud Entry
          </label>

          <select
            value={selectedEntryId}
            onChange={(e) => setSelectedEntryId(e.target.value)}
            className="w-full bg-[#1A1A1A] border border-[#333333] rounded-xl px-4 py-3"
          >
            <option value="">
              Select Entry
            </option>

            {project.data_entries?.map((entry: any) => (
              <option
                key={entry.id}
                value={entry.id}
              >
                {entry.received_date} | {entry.data_type} | {entry.scan_count} scans
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Revit Version
          </label>

          <select
            value={revitVersion}
            onChange={(e) => setRevitVersion(e.target.value)}
            className="w-full bg-[#1A1A1A] border border-[#333333] rounded-xl px-4 py-3"
          >
            <option value="">Not Aligned Yet</option>
            <option>2020</option>
            <option>2021</option>
            <option>2022</option>
            <option>2023</option>
            <option>2024</option>
            <option>2025</option>
            <option>2026</option>
            <option>2027</option>
            <option>2028</option>
            <option>2029</option>
            <option>2030</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Alignment Remarks
          </label>

          <textarea
            value={alignmentRemarks}
            onChange={(e) => setAlignmentRemarks(e.target.value)}
            placeholder="Optional alignment notes..."
            className="w-full h-24 resize-none bg-[#1A1A1A] border border-[#333333] rounded-xl px-4 py-3"
          />
        </div>

      </div>

      <div className="flex justify-end gap-3 mt-6">

        <button
          onClick={() => setShowAlignmentModal(false)}
          className="px-4 py-2 text-gray-400"
        >
          Cancel
        </button>

        <button
          onClick={handleSaveAlignment}
          className="px-4 py-2 text-[#00B7FF]"
        >
          Save
        </button>

      </div>

    </div>

  </div>
)}



{showQcModal && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

    <div className="w-[700px] bg-[#242424] border border-[#333333] rounded-2xl p-6">

      <h2 className="text-xl font-semibold mb-6">
        Add QC Issues
      </h2>

      <div className="space-y-5">

        <div>
          <label className="block text-sm font-medium mb-2">
            Select Point Cloud Entry
          </label>

          <select
            value={selectedQcEntryId}
            onChange={(e) => setSelectedQcEntryId(e.target.value)}
            className="w-full bg-[#1A1A1A] border border-[#333333] rounded-xl px-4 py-3"
          >
            <option value="">
              Select Entry
            </option>

            {project.data_entries?.map((entry: any) => (
              <option
                key={entry.id}
                value={entry.id}
              >
                {entry.received_date} | {entry.data_type} | {entry.scan_count} scans
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            QC Issue
          </label>

          <select
            value={qcIssue}
            onChange={(e) => setQcIssue(e.target.value)}
            className="w-full bg-[#1A1A1A] border border-[#333333] rounded-xl px-4 py-3"
          >
            <option value="">Not QC'd Yet</option>
            <option>None</option>
            <option>Missing Scan</option>
            <option>Missing Area</option>
            <option>Data Slips</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            QC Remarks
          </label>

          <textarea
            value={qcRemarks}
            onChange={(e) => setQcRemarks(e.target.value)}
            placeholder="Optional QC notes..."
            className="w-full h-24 resize-none bg-[#1A1A1A] border border-[#333333] rounded-xl px-4 py-3"
          />
        </div>

      </div>

      <div className="flex justify-end gap-3 mt-6">

        <button
          onClick={() => setShowQcModal(false)}
          className="px-4 py-2 text-gray-400"
        >
          Cancel
        </button>

        <button
          onClick={handleSaveQc}
          className="px-4 py-2 text-[#00B7FF]"
        >
          Save
        </button>

      </div>

    </div>

  </div>
)}




{showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="w-[700px] max-h-[90vh] overflow-y-auto bg-[#242424] border border-[#333333] rounded-2xl p-6">

            <h2 className="text-xl font-semibold mb-6">
              Edit Entry
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




                            <div>
  <label className="block text-sm font-medium mb-2">
    Revit Version
  </label>

  <select
    value={revitVersion}
    onChange={(e) => setRevitVersion(e.target.value)}
    className="w-full bg-[#1A1A1A] border border-[#333333] rounded-xl px-4 py-3"
  >
    <option value="">Not Aligned Yet</option>
    <option>2020</option>
    <option>2021</option>
    <option>2022</option>
    <option>2023</option>
    <option>2024</option>
    <option>2025</option>
    <option>2026</option>
    <option>2027</option>
    <option>2028</option>
    <option>2029</option>
    <option>2030</option>
  </select>
</div>

<div>
  <label className="block text-sm font-medium mb-2">
    Alignment Remarks
  </label>

  <textarea
    value={alignmentRemarks}
    onChange={(e) => setAlignmentRemarks(e.target.value)}
    className="w-full h-24 resize-none bg-[#1A1A1A] border border-[#333333] rounded-xl px-4 py-3"
  />
</div>

<div>
  <label className="block text-sm font-medium mb-2">
    QC Issue
  </label>

  <select
    value={qcIssue}
    onChange={(e) => setQcIssue(e.target.value)}
    className="w-full bg-[#1A1A1A] border border-[#333333] rounded-xl px-4 py-3"
  >
    <option value="">Not QC'd Yet</option>
<option>None</option>
<option>Missing Scan</option>
<option>Missing Area</option>
<option>Data Slips</option>
  </select>
</div>

<div>
  <label className="block text-sm font-medium mb-2">
    QC Remarks
  </label>

  <textarea
    value={qcRemarks}
    onChange={(e) => setQcRemarks(e.target.value)}
    className="w-full h-24 resize-none bg-[#1A1A1A] border border-[#333333] rounded-xl px-4 py-3"
  />
</div>






            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-400"
              >
                Cancel
              </button>

              <button
               onClick={handleUpdateEntry}
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