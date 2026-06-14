"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="mb-6 text-gray-400 hover:text-[#00B7FF] transition-colors"
    >
      ← Back
    </button>
  );
}