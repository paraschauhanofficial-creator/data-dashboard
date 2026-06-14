"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  project: any;
};

export default function IvionRow({ project }: Props) {
  const [status, setStatus] = useState(project.ivion_status);

  const [bundleSaved, setBundleSaved] = useState(
    project.bundle_saved || false
  );

  const [deletedFromIvion, setDeletedFromIvion] = useState(
    project.deleted_from_ivion || false
  );

  async function handleStatusChange(
    newStatus: string
  ) {
    setStatus(newStatus);

    const { error } = await supabase
      .from("projects")
      .update({
        ivion_status: newStatus,
      })
      .eq("id", project.id);

    if (error) {
      console.error(error);
    }
  }

  return (
    <div className="grid grid-cols-[150px_350px_1fr_200px_120px_100px] gap-5 px-6 py-3 border-b border-[#333333]">

      <div>{project.project_no}</div>

      <div>{project.client}</div>

      <div>{project.project_name}</div>

      <div>
        <select
          value={status}
          onChange={(e) =>
            handleStatusChange(e.target.value)
          }
          className="bg-[#1A1A1A] border border-[#333333] rounded-lg px-3 py-1"
        >
          <option value="Pending">
            Pending
          </option>

          <option value="Incoming">
            Incoming
          </option>

          <option value="Processed">
            Processed
          </option>

          <option value="Aligned">
            Aligned
          </option>
        </select>
      </div>

      <div className="flex justify-center">
        <input
          type="checkbox"
          checked={bundleSaved}
          disabled={status !== "Aligned"}
          onChange={async (e) => {
            const checked = e.target.checked;

            setBundleSaved(checked);

            if (!checked) {
              setDeletedFromIvion(false);

              await supabase
                .from("projects")
                .update({
                  deleted_from_ivion: false,
                })
                .eq("id", project.id);
            }

            const { error } = await supabase
              .from("projects")
              .update({
                bundle_saved: checked,
              })
              .eq("id", project.id);

            if (error) {
              console.error(error);
            }
          }}
          className="h-4 w-4 accent-[#00B7FF] cursor-pointer disabled:opacity-40"
        />
      </div>

      <div className="flex justify-center">
        <input
          type="checkbox"
          checked={deletedFromIvion}
          disabled={!bundleSaved}
          onChange={async (e) => {
            const checked = e.target.checked;

            setDeletedFromIvion(checked);

            const { error } = await supabase
              .from("projects")
              .update({
                deleted_from_ivion: checked,
              })
              .eq("id", project.id);

            if (error) {
              console.error(error);
            }
          }}
          className="h-4 w-4 accent-red-500 cursor-pointer disabled:opacity-40"
        />
      </div>

    </div>
  );
}