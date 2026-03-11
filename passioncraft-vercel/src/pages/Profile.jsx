import React, { useState, useEffect } from "react";
import { data } from "@/lib/data-layer";
import ProfileViewCard from "../components/ProfileViewCard";
import ProfileEditForm from "../components/ProfileEditForm";
import AgentQuestsPanel from "../components/AgentQuestsPanel";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [p, t] = await Promise.all([
      data.Profile.getMyProfile(),
      data.Thread.list("-created_date"),
    ]);
    setProfile(p);
    setForm(p);
    setThreads(t.filter(thread => thread.created_by === p.id || thread.author_name === p.username));
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await data.Profile.upsert(profile.id, form);
    setSaving(false);
    setEditing(false);
    loadData();
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-slate-700 border-t-[#a594f9] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="font-display text-2xl text-[var(--text-primary)] mb-2">Your Declaration</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Define your presence in the Square. Your vow, your domains, your craft.
        </p>
      </div>

      {editing ? (
        <ProfileEditForm
          form={form}
          onChange={setForm}
          onSave={handleSave}
          onCancel={() => { setEditing(false); setForm(profile); }}
          saving={saving}
          threads={threads}
        />
      ) : (
        <>
          <ProfileViewCard
            profile={profile}
            threads={threads}
            onEdit={() => setEditing(true)}
          />
          
          {/* Agent Quests - only show for agents */}
          {profile.entity_type === "agent" && (
            <AgentQuestsPanel profile={profile} threads={threads} />
          )}
        </>
      )}
    </div>
  );
}
