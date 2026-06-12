import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProfile, useProfileMutations } from '../hooks/useProfile';

const categories = [
  { id: 'identity', label: 'Identity', icon: 'badge' },
  { id: 'security', label: 'Security', icon: 'lock' },
  { id: 'notifications', label: 'Notifications', icon: 'notifications' },
  { id: 'records', label: 'Records', icon: 'folder' },
];

const PROGRAM_OPTIONS = [
  { value: 'Bar Part II', label: 'Bar Part II' },
];

const CAMPUS_OPTIONS = [
  { value: 'Lagos Campus', label: 'Lagos Campus' },
  { value: 'Yola Campus', label: 'Yola Campus' },
  { value: 'Enugu Campus', label: 'Enugu Campus' },
  { value: 'Kano Campus', label: 'Kano Campus' },
  { value: 'Port Harcourt Campus', label: 'Port Harcourt Campus' },
  { value: 'Abuja Campus', label: 'Abuja Campus' },
];

function Toggle({ enabled, onChange, label }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-primary' : 'bg-surface-container'}`}
      aria-label={label}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

function SettingRow({ label, description, children, danger }) {
  return (
    <div className={`flex items-center justify-between py-4 px-2 border-b border-outline-variant/20 last:border-b-0 ${danger ? 'hover:bg-error-container/10' : 'hover:bg-surface-container-low/50'} transition-colors rounded-lg`}>
      <div className="flex-1 min-w-0 pr-4">
        <p className={`font-body-md font-medium ${danger ? 'text-error' : 'text-primary'}`}>{label}</p>
        {description && <p className="text-sm text-on-surface-variant mt-0.5">{description}</p>}
      </div>
      <div className="flex-shrink-0">
        {children}
      </div>
    </div>
  );
}

function Input({ value, onChange, placeholder, type = 'text', disabled }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full max-w-xs bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 font-body-md text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all disabled:opacity-50"
    />
  );
}

function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full max-w-xs bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 font-body-md text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all appearance-none cursor-pointer"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}

export default function Settings() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const { updateProfile, changePassword } = useProfileMutations();
  const [activeCategory, setActiveCategory] = useState('identity');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  // Identity form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [program, setProgram] = useState('');
  const [campus, setCampus] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  // Security form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Preferences state
  const [dailyDigest, setDailyDigest] = useState(true);
  const [streakAlerts, setStreakAlerts] = useState(true);
  const [studyReminders, setStudyReminders] = useState(true);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setEmail(profile.email || '');
      setProgram(profile.program || '');
      setCampus(profile.campus || '');
      setIsDirty(false);
    }
  }, [profile]);

  useEffect(() => {
    if (profile) {
      const changed =
        name !== (profile.name || '') ||
        email !== (profile.email || '') ||
        program !== (profile.program || '') ||
        campus !== (profile.campus || '');
      setIsDirty(changed);
    }
  }, [name, email, program, campus, profile]);

  const handleSaveProfile = async () => {
    setMessage({ type: '', text: '' });
    try {
      await updateProfile.mutateAsync({ name, email, program, campus });
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to update profile.' });
    }
  };

  const handleChangePassword = async () => {
    setPasswordMessage({ type: '', text: '' });
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    try {
      await changePassword.mutateAsync({ currentPassword, newPassword });
      setPasswordMessage({ type: 'success', text: 'Password changed successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordMessage({ type: 'error', text: err.response?.data?.error || 'Failed to change password.' });
    }
  };

  const handleExport = () => {
    const data = {
      user: profile,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lexstudent-profile-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage({ type: 'success', text: 'Profile exported successfully.' });
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-on-surface-variant">
          <div className="w-5 h-5 border-2 border-outline-variant border-t-primary rounded-full animate-spin" />
          <span className="font-body-md">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-stack-lg min-h-[calc(100vh-6rem)]">
      {/* LEFT SIDEBAR - Categories */}
      <aside className="w-56 flex-shrink-0 space-y-1">
        <h2 className="font-h2 text-h2 text-primary mb-stack-md px-2">Settings</h2>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body-md transition-all ${
              activeCategory === cat.id
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            <span className="material-symbols-outlined text-sm">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </aside>

      {/* RIGHT PANEL */}
      <main className="flex-1 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-stack-lg">
        {/* IDENTITY */}
        {activeCategory === 'identity' && (
          <div className="space-y-stack-lg">
            <div>
              <h3 className="font-h3 text-h3 text-primary mb-1">Identity</h3>
              <p className="text-sm text-on-surface-variant">Your public profile information and academic details.</p>
            </div>

            {message.text && message.type === 'success' && (
              <div className="flex items-center gap-2 p-3 bg-primary-container/10 text-primary rounded-xl">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span className="font-body-md text-sm">{message.text}</span>
              </div>
            )}
            {message.text && message.type === 'error' && (
              <div className="flex items-center gap-2 p-3 bg-error-container text-error rounded-xl">
                <span className="material-symbols-outlined text-sm">error</span>
                <span className="font-body-md text-sm">{message.text}</span>
              </div>
            )}

            <div className="space-y-0">
              <SettingRow label="Full Name" description="Your name as it appears across the application.">
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
              </SettingRow>
              <SettingRow label="Email Address" description="Used for login and notifications.">
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" type="email" />
              </SettingRow>
              <SettingRow label="Program" description="Your current Bar examination programme.">
                <Select
                  value={program || 'Bar Part II'}
                  onChange={(e) => setProgram(e.target.value)}
                  options={PROGRAM_OPTIONS}
                />
              </SettingRow>
              <SettingRow label="Campus" description="Your Nigerian Law School campus.">
                <Select
                  value={campus || 'Lagos Campus'}
                  onChange={(e) => setCampus(e.target.value)}
                  options={CAMPUS_OPTIONS}
                />
              </SettingRow>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setName(profile?.name || '');
                  setEmail(profile?.email || '');
                  setProgram(profile?.program || '');
                  setCampus(profile?.campus || '');
                  setMessage({ type: '', text: '' });
                }}
                disabled={!isDirty}
                className="px-5 py-2.5 font-button text-button text-primary hover:bg-surface-container rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={!isDirty || updateProfile.isPending}
                className="inline-flex items-center gap-2 px-5 py-2.5 font-button text-button bg-primary text-on-primary rounded-xl hover:brightness-110 active:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {updateProfile.isPending && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* SECURITY */}
        {activeCategory === 'security' && (
          <div className="space-y-stack-lg">
            <div>
              <h3 className="font-h3 text-h3 text-primary mb-1">Security</h3>
              <p className="text-sm text-on-surface-variant">Manage your password and account access.</p>
            </div>

            {passwordMessage.text && passwordMessage.type === 'success' && (
              <div className="flex items-center gap-2 p-3 bg-primary-container/10 text-primary rounded-xl">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span className="font-body-md text-sm">{passwordMessage.text}</span>
              </div>
            )}
            {passwordMessage.text && passwordMessage.type === 'error' && (
              <div className="flex items-center gap-2 p-3 bg-error-container text-error rounded-xl">
                <span className="material-symbols-outlined text-sm">error</span>
                <span className="font-body-md text-sm">{passwordMessage.text}</span>
              </div>
            )}

            <div className="space-y-0">
              <SettingRow label="Current Password" description="Enter your existing password to verify identity.">
                <Input value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current password" type="password" />
              </SettingRow>
              <SettingRow label="New Password" description="Must be at least 6 characters long.">
                <Input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" type="password" />
              </SettingRow>
              <SettingRow label="Confirm New Password" description="Re-enter to confirm.">
                <Input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" type="password" />
              </SettingRow>
            </div>

            <div className="flex items-center justify-end">
              <button
                onClick={handleChangePassword}
                disabled={!currentPassword || !newPassword || !confirmPassword || changePassword.isPending}
                className="inline-flex items-center gap-2 px-5 py-2.5 font-button text-button bg-primary text-on-primary rounded-xl hover:brightness-110 active:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {changePassword.isPending && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                Update Password
              </button>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS */}
        {activeCategory === 'notifications' && (
          <div className="space-y-stack-lg">
            <div>
              <h3 className="font-h3 text-h3 text-primary mb-1">Notifications</h3>
              <p className="text-sm text-on-surface-variant">Control what alerts and reminders you receive.</p>
            </div>

            <div className="space-y-0">
              <SettingRow label="Daily Digest" description="A summary of your study activity and upcoming tasks.">
                <Toggle enabled={dailyDigest} onChange={setDailyDigest} label="Daily Digest" />
              </SettingRow>
              <SettingRow label="Streak Alerts" description="Warns you when your study streak is about to break.">
                <Toggle enabled={streakAlerts} onChange={setStreakAlerts} label="Streak Alerts" />
              </SettingRow>
              <SettingRow label="Study Reminders" description="Gentle nudges to begin your scheduled sessions.">
                <Toggle enabled={studyReminders} onChange={setStudyReminders} label="Study Reminders" />
              </SettingRow>
            </div>
          </div>
        )}

        {/* RECORDS */}
        {activeCategory === 'records' && (
          <div className="space-y-stack-lg">
            <div>
              <h3 className="font-h3 text-h3 text-primary mb-1">Records</h3>
              <p className="text-sm text-on-surface-variant">Export your data or manage your account records.</p>
            </div>

            {message.text && message.type === 'success' && (
              <div className="flex items-center gap-2 p-3 bg-primary-container/10 text-primary rounded-xl">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span className="font-body-md text-sm">{message.text}</span>
              </div>
            )}

            <div className="space-y-0">
              <SettingRow label="Export Profile Data" description="Download a JSON file containing your profile and preferences.">
                <button
                  onClick={handleExport}
                  className="inline-flex items-center gap-2 px-4 py-2.5 font-button text-button border border-outline-variant text-primary rounded-xl hover:bg-surface-container transition-all"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  Export
                </button>
              </SettingRow>
              <SettingRow
                label="Reset Study Progress"
                description="Clear all your study activity, progress, and goals. This cannot be undone."
                danger
              >
                <button
                  className="inline-flex items-center gap-2 px-4 py-2.5 font-button text-button bg-error text-white rounded-xl hover:brightness-110 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  Reset
                </button>
              </SettingRow>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
