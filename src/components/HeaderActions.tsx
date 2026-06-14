"use client";

import Link from "next/link";
import { Archive, User } from "lucide-react";

type Props = {
  hideArchive?: boolean;
};

export default function HeaderActions({
  hideArchive = false,
}: Props) {
  return (
    <div className="flex items-center gap-2">

      {!hideArchive && (
        <Link
          href="/archive"
          className="h-8 w-8 flex items-center justify-center rounded-lg border border-[#333333] hover:border-[#00B7FF] hover:text-[#00B7FF] transition"
        >
          <Archive size={14} />
        </Link>
      )}

      <button
        className="h-8 w-8 flex items-center justify-center rounded-lg border border-[#333333] hover:border-[#00B7FF] hover:text-[#00B7FF] transition"
      >
        <User size={14} />
      </button>

    </div>
  );
}