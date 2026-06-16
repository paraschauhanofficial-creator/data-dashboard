"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import HeaderActions from "@/components/HeaderActions";
import { supabase } from "@/lib/supabase";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState("");
const [newEmail, setNewEmail] = useState("");
const [newPassword, setNewPassword] = useState("");
const [newRole, setNewRole] = useState("staff");
const [creatingUser, setCreatingUser] = useState(false);

const [authLoading, setAuthLoading] = useState(true);
const router = useRouter();

  useEffect(() => {
  checkAuth();
}, []);





async function checkAuth() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    router.push("/login");
    return;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    router.push("/");
    return;
  }

  await loadUsers();
  await getCurrentUser();

  setAuthLoading(false);
}



async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();

  if (!data.user) return;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  setCurrentUser(profile);
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







async function createUser() {
  try {
    setCreatingUser(true);

    const response = await fetch(
      "/api/admin/create-user",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: newEmail,
          password: newPassword,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      setSuccess(`error: ${result.error}`);
      setCreatingUser(false);
      return;
    }

    const userId = result.user.id;

    await supabase
      .from("profiles")
      .update({
        full_name: newName,
        role: newRole,
      })
      .eq("id", userId);

    await loadUsers();

    setShowCreateModal(false);

    setNewName("");
    setNewEmail("");
    setNewPassword("");
    setNewRole("staff");

    setSuccess("User created successfully");

    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  } catch {
    setSuccess("error: Failed to create user");
  } finally {
    setCreatingUser(false);
  }
}



if (authLoading) {
  return (
    <main className="min-h-screen bg-[#1A1A1A] flex items-center justify-center text-white">
      Loading...
    </main>
  );
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
        
        <div className="px-6 py-4 border-b border-[#333333] flex items-center justify-between">
  <h2 className="font-semibold text-lg">
    Users
  </h2>

  <button
    onClick={() => setShowCreateModal(true)}
    className="px-4 py-2 bg-[#00B7FF] text-black rounded-lg font-medium hover:opacity-90 transition"
  >
    + Add User
  </button>
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
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
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



    {showCreateModal && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="w-full max-w-md bg-[#242424] border border-[#333333] rounded-2xl p-6">

      <h2 className="text-xl font-semibold mb-6">
        Create User
      </h2>

      <div className="space-y-4">

        <input
  value={newName}
  onChange={(e) => setNewName(e.target.value)}
  placeholder="Full Name"
  className="w-full bg-[#1A1A1A] border border-[#333333] rounded-lg px-4 py-3"
/>

        <input
  value={newEmail}
  onChange={(e) => setNewEmail(e.target.value)}
  placeholder="Email Address"
  className="w-full bg-[#1A1A1A] border border-[#333333] rounded-lg px-4 py-3"
/>

        

        <input
  type="password"
  value={newPassword}
  onChange={(e) => setNewPassword(e.target.value)}
  placeholder="Temporary Password"
  className="w-full bg-[#1A1A1A] border border-[#333333] rounded-lg px-4 py-3"
/>

<select
  value={newRole}
  onChange={(e) => setNewRole(e.target.value)}
  className="w-full bg-[#1A1A1A] border border-[#333333] rounded-lg px-4 py-3"
>
  <option value="staff">Staff</option>
  <option value="admin">Admin</option>
</select>

      </div>

      <div className="flex justify-end gap-3 mt-6">

        <button
          onClick={() => setShowCreateModal(false)}
          className="px-4 py-2 border border-[#333333] rounded-lg"
        >
          Cancel
        </button>

        <button
  onClick={createUser}
  disabled={creatingUser}
  className="px-4 py-2 bg-[#00B7FF] text-black rounded-lg font-medium disabled:opacity-50"
>
  {creatingUser ? "Creating..." : "Create User"}
</button>

      </div>

    </div>
  </div>
  
)}






    </main>
  );
}