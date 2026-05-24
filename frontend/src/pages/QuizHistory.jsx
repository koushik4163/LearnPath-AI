import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import Navbar from '../components/Navbar';
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

export default function QuizHistory() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [history, setHistory] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		if (!user?.id) {
			setHistory([]);
			setLoading(false);
			return;
		}

		let isMounted = true;

		const loadHistory = async () => {
			setLoading(true);
			setError('');

			const { data, error: loadError } = await supabase
				.from('quiz_results')
				.select('*')
				.eq('user_id', user.id)
				.order('taken_at', { ascending: false });

			if (!isMounted) return;

			if (loadError) {
				setError('Failed to load quiz history. Please try again.');
				setHistory([]);
			} else {
				setHistory(data || []);
			}

			setLoading(false);
		};

		loadHistory();

		return () => {
			isMounted = false;
		};
	}, [user?.id]);

	const chartData = [...history].reverse().map((h, i) => ({
		quiz: `Quiz ${i + 1}`,
		score: h.percent,
		date: new Date(h.taken_at).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
		}),
	}));

	const avg = history.length
		? Math.round(history.reduce((a, b) => a + b.percent, 0) / history.length)
		: 0;

	const best = history.length
		? Math.max(...history.map((h) => h.percent))
		: 0;

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">📝 Quiz History</h1>
					<p className="text-gray-400 text-sm mt-1">All your quiz attempts and scores</p>
				</div>

				{error && (
					<div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 border border-red-200">
						⚠️ {error}
					</div>
				)}

				<div className="grid grid-cols-3 gap-4">
					{[
						{ label: 'Total Quizzes', value: history.length },
						{ label: 'Average Score', value: `${avg}%` },
						{ label: 'Best Score', value: `${best}%` },
					].map((s) => (
						<div key={s.label} className="bg-white rounded-xl border p-4 text-center shadow-sm">
							<p className="text-2xl font-bold text-gray-800">{s.value}</p>
							<p className="text-xs text-gray-400 mt-1">{s.label}</p>
						</div>
					))}
				</div>

				{chartData.length > 1 && (
					<div className="bg-white rounded-2xl border p-6 shadow-sm">
						<h3 className="font-semibold text-gray-800 mb-4">📈 Score Trend</h3>
						<ResponsiveContainer width="100%" height={200}>
							<LineChart data={chartData}>
								<CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
								<XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
								<YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
								<Tooltip formatter={(val) => [`${val}%`, 'Score']} />
								<Line
									type="monotone"
									dataKey="score"
									stroke="#6366F1"
									strokeWidth={2}
									dot={{ fill: '#6366F1', r: 4 }}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				)}

				{history.length === 0 ? (
					<div className="text-center py-16">
						<p className="text-5xl mb-4">🧠</p>
						<p className="text-gray-500 mb-4">No quizzes taken yet!</p>
						<button
							onClick={() => navigate('/quiz')}
							className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
						>
							Take Your First Quiz
						</button>
					</div>
				) : (
					<div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
						<div className="px-6 py-4 border-b">
							<h3 className="font-semibold text-gray-800">All Attempts</h3>
						</div>
						<div className="divide-y">
							{history.map((h, i) => (
								<div key={h.id || h.taken_at || i} className="flex items-center justify-between px-6 py-4">
									<div className="flex items-center gap-3">
										<div
											className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
												h.percent >= 70
													? 'bg-green-100 text-green-700'
													: h.percent >= 40
													? 'bg-yellow-100 text-yellow-700'
													: 'bg-red-100 text-red-600'
											}`}
										>
											{h.percent >= 70 ? '🏆' : h.percent >= 40 ? '💪' : '📚'}
										</div>
										<div>
											<p className="font-medium text-gray-800 text-sm">
												Quiz #{history.length - i}
											</p>
											<p className="text-xs text-gray-400">
												{new Date(h.taken_at).toLocaleDateString('en-US', {
													weekday: 'short',
													month: 'short',
													day: 'numeric',
													hour: '2-digit',
													minute: '2-digit',
												})}
											</p>
										</div>
									</div>
									<div className="text-right">
										<p
											className={`font-bold text-lg ${
												h.percent >= 70
													? 'text-green-600'
													: h.percent >= 40
													? 'text-yellow-600'
													: 'text-red-500'
											}`}
										>
											{h.score}/{h.total}
										</p>
										<p className="text-xs text-gray-400">{h.percent}%</p>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
