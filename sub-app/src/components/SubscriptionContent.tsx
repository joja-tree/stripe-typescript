"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SubscriptionContent() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<null | "checking" | "active" | "inactive">(null);
  const router = useRouter();

  const checkAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("checking");
    // Optionally, you can check access here before routing
    router.push(`/profile?email=${encodeURIComponent(email)}`);
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Access Subscriber Content</h2>
      <form onSubmit={checkAccess} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 15 }}
        />
        <button type="submit" style={{ background: '#635bff', color: '#fff', border: 'none', borderRadius: 6, padding: 12, fontWeight: 600, fontSize: 16 }}>
          {status === "checking" ? "Checking..." : "Check Access"}
        </button>
      </form>
    </div>
  );
}
