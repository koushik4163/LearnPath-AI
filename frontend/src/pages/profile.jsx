import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { deleteUser, updatePassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { supabase } from '../supabase';

export default function Profile() {
	const { user, logout, updateUser } = useAuth();
	const navigate = useNavigate();
	const [name, setName] = useState(user?.name || '');
	const [newPassword, setNewPassword] = useState('');
	const [saving, setSaving] = useState(false);
	const [msg, setMsg] = useState('');
	const [error, setError] = useState('');
	const [deleting, setDeleting] = useState(false);

	useEffect(() => {
		setName(user?.name || '');
	}, [user?.name]);

	const handleSaveName = async () => {
		if (!name.trim()) return setError('Name cannot be empty');
		if (!user?.id) return setError('User not available');
		if (!auth.currentUser) return setError('No authenticated user');

		setSaving(true);
		setMsg('');
		setError('');

		try {
			await updateProfile(auth.currentUser, { displayName: name });
			const { error: updateError } = await supabase
				.from('users')
				.update({ name })
				.eq('id', user.id)
				.select()
				.single();
			if (updateError) throw updateError;
			updateUser({ name });
			setMsg('Name updated successfully!');
		} catch (err) {
			setError('Failed to update name');
		} finally {
			setSaving(false);
		}
	};

	const handleChangePassword = async () => {
		if (newPassword.length < 8) return setError('Password must be at least 8 characters');
		if (!auth.currentUser) return setError('No authenticated user');

		setSaving(true);
		setMsg('');
		setError('');

		try {
			await updatePassword(auth.currentUser, newPassword);
			setMsg('Password updated successfully!');
			setNewPassword('');
		} catch (err) {
			setError('Failed to update password. You may need to re-login first.');
		} finally {
			setSaving(false);
		}
	};

	const handleDeleteAccount = async () => {
		if (!user?.id) return setError('User not available');
		if (!auth.currentUser) return setError('No authenticated user');
		if (!window.confirm('Are you sure? This will permanently delete your account and all data.')) return;

		setDeleting(true);
		setError('');

		try {
			await supabase.from('tasks').delete().eq('user_id', user.id);
			await supabase.from('quiz_results').delete().eq('user_id', user.id);
			await supabase.from('roadmaps').delete().eq('user_id', user.id);
			await supabase.from('progress').delete().eq('user_id', user.id);
			await supabase.from('users').delete().eq('id', user.id);
			await deleteUser(auth.currentUser);
			await logout();
			navigate('/');
		} catch (err) {
			setError('Failed to delete account. Please re-login and try again.');
			setDeleting(false);
		}
	};

	return (
		<div className="w-full">
			<div className="max-w-2xl mx-auto px-6 py-10 space-y-6">
				<div>
					<h1 className="text-2xl font-bold text-[#F2EDE6]">👤 My Profile</h1>
					<p className="text-[#8A857C] text-sm mt-1">Manage your account settings</p>
				</div>

				{msg && (
					<div className="bg-emerald-500/10 text-emerald-200 text-sm rounded-lg px-4 py-3 border border-emerald-400/40">
						✅ {msg}
					</div>
				)}
				{error && (
					<div className="bg-rose-500/10 text-rose-200 text-sm rounded-lg px-4 py-3 border border-rose-400/40">
						⚠️ {error}
					</div>
				)}

				<div className="panel p-6 shadow-sm">
					<h2 className="font-semibold text-[#F2EDE6] mb-4">Account Info</h2>
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-[#B9B1A7] mb-1">Email</label>
							<input
								type="email"
								value={user?.email || ''}
								disabled
								className="w-full border border-white/10 rounded-lg px-4 py-3 text-sm bg-white/5 text-[#8A857C] cursor-not-allowed"
							/>
							<p className="text-xs text-[#8A857C] mt-1">Email cannot be changed</p>
						</div>
						<div>
							<label className="block text-sm font-medium text-[#B9B1A7] mb-1">Display Name</label>
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full border border-white/10 rounded-lg px-4 py-3 text-sm bg-[#111111] text-[#F2EDE6] focus:outline-none focus:ring-2 focus:ring-[#7C8CFF]"
							/>
						</div>
						<button
							onClick={handleSaveName}
							disabled={saving}
							className="bg-[#F08A4B] text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[#DE7C40] transition disabled:opacity-60"
						>
							{saving ? 'Saving...' : 'Save Name'}
						</button>
					</div>
				</div>

				<div className="panel p-6 shadow-sm">
					<h2 className="font-semibold text-[#F2EDE6] mb-4">Change Password</h2>
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-[#B9B1A7] mb-1">New Password</label>
							<input
								type="password"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								placeholder="Min 8 characters"
								className="w-full border border-white/10 rounded-lg px-4 py-3 text-sm bg-[#111111] text-[#F2EDE6] placeholder:text-[#8A857C] focus:outline-none focus:ring-2 focus:ring-[#7C8CFF]"
							/>
						</div>
						<button
							onClick={handleChangePassword}
							disabled={saving}
							className="bg-[#F08A4B] text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[#DE7C40] transition disabled:opacity-60"
						>
							{saving ? 'Updating...' : 'Update Password'}
						</button>
					</div>
				</div>

				<div className="panel p-6 shadow-sm border border-rose-500/30">
					<h2 className="font-semibold text-rose-200 mb-2">⚠️ Danger Zone</h2>
					<p className="text-sm text-[#8A857C] mb-4">
						Permanently delete your account and all your data. This cannot be undone.
					</p>
					<button
						onClick={handleDeleteAccount}
						disabled={deleting}
						className="bg-rose-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-rose-700 transition disabled:opacity-60"
					>
						{deleting ? 'Deleting...' : 'Delete My Account'}
					</button>
				</div>
			</div>
		</div>
	);
}
