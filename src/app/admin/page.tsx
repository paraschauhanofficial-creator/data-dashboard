"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import HeaderActions from "@/components/HeaderActions";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: string;
  full_name: string | null;
  email: string;
  role: string;
  is_active: boolean;
};

export default function AdminPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    setUsers(data || []);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <Navbar />

      <main className="p-6 md:p-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Admin Panel
            </h1>

            <p className="text-gray-400 mt-1">
              Manage users and permissions.
            </p>
          </div>

          <HeaderActions />
        </div>

        <div className="bg-[#242424] border border-[#333333] rounded-2xl overflow-hidden">

          <div className="px-6 py-4 border-b border-[#333333]">
            <h2 className="font-semibold text-lg">
              Users
            </h2>
          </div>

          {loading ? (
            <div className="p-6">
              Loading...
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-[#333333] text-gray-400 text-sm">
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-[#2E2E2E]"
                  >
                    <td className="px-6 py-4">
                      {user.email}
                    </td>

                    <td className="px-6 py-4">
                      {user.role}
                    </td>

                    <td className="px-6 py-4">
                      {user.is_active
                        ? "Active"
                        : "Inactive"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </div>

      </main>
    </div>
  );
}