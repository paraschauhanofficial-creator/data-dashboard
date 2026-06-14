"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import HeaderActions from "@/components/HeaderActions";
import { supabase } from "@/lib/supabase";
import { Check, X } from "lucide-react";

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
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
    getCurrentUser();
  }, []);

  async function getCurrentUser() {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();
      setCurrentUser(profile);
    }
  }

  async function loadUsers() {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    setUsers(data || []);
    setLoading(false);
  }




  

  async function updateUserRole(userId: string, newRole: string) {
  setUpdating(userId);

  const { error } = await supabase.rpc('update_user_role', {
    user_id: userId,
    new_role: newRole,
  });

  setUpdating(null);

  if (error) {
    setSuccess(`error: ${error.message}`);
    return;
  }

  setSuccess("Role updated successfully");
  await loadUsers();
  setTimeout(() => setSuccess(null), 3000);
}





  async function toggleUserStatus(userId: string, currentStatus: boolean) {
    // Check if current user is admin
    if (currentUser?.role !== "admin") {
      setSuccess("error: Only admins can change status");
      return;
    }

    setUpdating(userId);

    const { error } = await supabase
      .from("profiles")
      .update({ is_active: !currentStatus })
      .eq("id", userId);

    setUpdating(null);

    if (error) {
      setSuccess(`error: ${error.message}`);
      return;
    }

    setSuccess("Status updated successfully");
    await loadUsers();
    setTimeout(() => setSuccess(null), 3000);
  }







  
  return (
    <main className="min-h-screen bg-[#1A1A1A] text-white px-4 md:px-8 py-6">
      
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-wide">
            Admin Panel
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Manage users and permissions.
          </p>
        </div>
        <HeaderActions />
      </div>

      <div className="mb-8">
        <Navbar />
      </div>

      {success && (
        <div className={`mb-6 p-4 rounded-lg ${
          success.startsWith("error") 
            ? "bg-red-500/10 border border-red-500/20 text-red-400"
            : "bg-green-500/10 border border-green-500/20 text-green-400"
        }`}>
          {success}
        </div>
      )}

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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-[#333333] text-gray-400 text-sm">
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-[#2E2E2E] hover:bg-[#2E2E2E]/50 transition"
                  >
                    <td className="px-6 py-4">
                      {user.email}
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                        disabled={currentUser?.role !== "admin" || updating === user.id}
                        className="bg-[#1A1A1A] border border-[#333333] rounded-lg px-3 py-2 text-sm cursor-pointer hover:border-[#00B7FF] transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleUserStatus(user.id, user.is_active)}
                        disabled={currentUser?.role !== "admin" || updating === user.id}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                          user.is_active
                            ? "bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20"
                            : "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {user.is_active ? (
                          <>
                            <Check size={14} />
                            Active
                          </>
                        ) : (
                          <>
                            <X size={14} />
                            Inactive
                          </>
                        )}
                      </button>
                    </td>

                    <td className="px-6 py-4">
                      {updating === user.id ? (
                        <span className="text-gray-500 text-sm">Updating...</span>
                      ) : currentUser?.role !== "admin" ? (
                        <span className="text-gray-600 text-sm">No permission</span>
                      ) : (
                        <span className="text-green-400 text-sm">Can edit</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </main>
  );
}