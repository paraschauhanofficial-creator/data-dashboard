
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [rememberMe, setRememberMe] = useState(true);

  async function handleLogin() {
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#1A1A1A] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-24 items-center">

        <div>
          <div className="max-w-lg">
            <h1 className="text-5xl font-bold tracking-wide">
              DATA MANAGEMENT
            </h1>

            <p className="mt-6 text-lg text-gray-400">
              Centralized project tracking and workflow management.
            </p>

            <div className="mt-12 space-y-8">

              <div>
                <h3 className="text-[#00B7FF] font-medium text-lg">
                  Project Tracking
                </h3>

                <p className="text-gray-400 text-sm mt-2">
                  Manage active projects from creation to delivery.
                </p>
              </div>

              <div>
                <h3 className="text-[#00B7FF] font-medium text-lg">
                  IVION Workflow
                </h3>

                <p className="text-gray-400 text-sm mt-2">
                  Track processing, alignment, and bundle backups.
                </p>
              </div>

              <div>
                <h3 className="text-[#00B7FF] font-medium text-lg">
                  Archive Management
                </h3>

                <p className="text-gray-400 text-sm mt-2">
                  Restore archived projects anytime.
                </p>
              </div>

              <div>
                <h3 className="text-[#00B7FF] font-medium text-lg">
                  Queue Monitoring
                </h3>

                <p className="text-gray-400 text-sm mt-2">
                  Monitor active tasks and project bottlenecks.
                </p>
              </div>

            </div>

            <div className="mt-16 text-xs text-gray-600">
              Version 1.0
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-md bg-[#242424] border border-[#333333] rounded-3xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.25)]">

            <h2 className="text-4xl font-semibold">
              Welcome Back
            </h2>

            <p className="mt-2 text-gray-400">
              Sign in to continue.
            </p>

            
<div className="mt-8 space-y-4">

  <input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="Email Address"
    className="w-full bg-[#1A1A1A] border border-[#333333] rounded-xl px-4 py-3 outline-none focus:border-[#00B7FF]"
  />

  <input
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Password"
    className="w-full bg-[#1A1A1A] border border-[#333333] rounded-xl px-4 py-3 outline-none focus:border-[#00B7FF]"
  />

</div>

<div className="mt-4 flex items-center">


          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
    <input
      type="checkbox"
      checked={rememberMe}
      onChange={(e) => setRememberMe(e.target.checked)}
      className="h-4 w-4 accent-[#00B7FF]"
    />
    Remember Me
  </label>
</div>

{error && (
              <p className="mt-4 text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full mt-6 bg-[#00B7FF] text-black font-medium py-3 rounded-xl hover:opacity-90 transition shadow-[0_0_20px_rgba(0,183,255,0.20)] disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Login"}
            </button>

          </div>
        </div>

      </div>
    </main>
  );
}