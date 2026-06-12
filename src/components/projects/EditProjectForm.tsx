"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Button from "@/components/ui/Button";

type Props = {
  project: {
    id: string;
    project_no: string;
    client: string;
    project_name: string;
  };
};

export default function EditProjectForm({ project }: Props) {
  const [projectNo, setProjectNo] = useState(project.project_no);
  const [client, setClient] = useState(project.client);
  const [projectName, setProjectName] = useState(project.project_name);

  const router = useRouter();

  async function handleSave() {
    const { error } = await supabase
      .from("projects")
      .update({
        project_no: projectNo,
        client,
        project_name: projectName,
      })
      .eq("id", project.id);

    if (error) {
      console.error(error);
      alert("Failed to update project");
      return;
    }

    router.push(`/projects/${project.id}`);
  }

  return (
    <div className="space-y-4">
      <input
        value={projectNo}
        onChange={(e) => setProjectNo(e.target.value)}
        className="w-full bg-[#242424] border border-[#333333] rounded-xl px-4 py-3"
      />

      <input
        value={client}
        onChange={(e) => setClient(e.target.value)}
        className="w-full bg-[#242424] border border-[#333333] rounded-xl px-4 py-3"
      />

      <input
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        className="w-full bg-[#242424] border border-[#333333] rounded-xl px-4 py-3"
      />

      <Button onClick={handleSave}>
       Save Changes
      </Button>
    </div>
  );
}