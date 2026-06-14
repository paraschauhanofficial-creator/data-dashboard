"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, User, LogOut, Settings } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Props = {
  hideArchive?: boolean;
};

export default function HeaderActions({
  hideArchive = false,
}: Props) {
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();

    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2 relative">

      {!hideArchive && (
        <Link
          href="/archive"
          className="h-8 w-8 flex items-center justify-center rounded-lg border border-[#333333] hover:border-[#00B7FF] hover:text-[#00B7FF] transition"
        >
          <Archive size={14} />
        </Link>
      )}

      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="h-8 w-8 flex items-center justify-center rounded-lg border border-[#333333] hover:border-[#00B7FF] hover:text-[#00B7FF] transition"
      >
        <User size={14} />
      </button>

      {menuOpen && (
        <div className="absolute top-10 right-0 w-44 bg-[#242424] border border-[#333333] rounded-xl shadow-lg overflow-hidden z-50">

          <Link
            href="/admin"
            className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-[#2E2E2E] transition border-b border-[#333333]"
            onClick={() => setMenuOpen(false)}
          >
            <Settings size={14} />
            Admin Panel
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-[#2E2E2E] transition"
          >
            <LogOut size={14} />
            Logout
          </button>

        </div>
      )}

    </div>
  );
}
