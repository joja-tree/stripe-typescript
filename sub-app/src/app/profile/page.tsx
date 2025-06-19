"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface ProfileData {
  email: string;
  subscriptionId: string;
  status: string;
  currentPeriodEnd: string;
}

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const [email, setEmail] = useState(initialEmail);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialEmail) {
      fetchProfileByEmail(initialEmail);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialEmail]);

  const fetchProfileByEmail = async (emailToFetch: string) => {
    setLoading(true);
    setError(null);
    setProfile(null);
    try {
      const res = await fetch("/api/check-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToFetch })
      });
      const data = await res.json();
      if (data.active && data.subscription) {
        setProfile({
          email: emailToFetch,
          subscriptionId: data.subscription.id,
          status: data.subscription.status,
          currentPeriodEnd: new Date(data.subscription.current_period_end * 1000).toLocaleString()
        });
      } else {
        setError("No active subscription found.");
      }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const fetchProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchProfileByEmail(email);
  };

  const handleRenew = () => {
    alert("Renewal flow not implemented. You can add Stripe customer portal or renewal logic here.");
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Profile</h2>
      {!profile ? (
        <form onSubmit={fetchProfile} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 15 }}
          />
          <button type="submit" style={{ background: '#635bff', color: '#fff', border: 'none', borderRadius: 6, padding: 12, fontWeight: 600, fontSize: 16 }}>
            {loading ? "Loading..." : "View Profile"}
          </button>
        </form>
      ) : (
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: 32, marginTop: 24 }}>
          <div><strong>Email:</strong> {profile.email}</div>
          <div><strong>Subscription ID:</strong> {profile.subscriptionId}</div>
          <div><strong>Status:</strong> {profile.status}</div>
          <div><strong>Expiry:</strong> {profile.currentPeriodEnd}</div>
          <button onClick={handleRenew} style={{ marginTop: 20, background: '#635bff', color: '#fff', border: 'none', borderRadius: 6, padding: 12, fontWeight: 600, fontSize: 16 }}>
            Renew Subscription
          </button>
        </div>
      )}
      {error && <div style={{ color: '#d32f2f', marginTop: 16 }}>{error}</div>}
    </div>
  );
}
