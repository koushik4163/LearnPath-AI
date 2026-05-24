import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function Certificate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/roadmap/my')
      .then(res => setRoadmap(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!roadmap || !canvasRef.current) return;
    drawCertificate();
  }, [roadmap]);

  const drawCertificate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, W, H);

    // Outer border
    ctx.strokeStyle = '#6366F1';
    ctx.lineWidth = 12;
    ctx.strokeRect(20, 20, W - 40, H - 40);

    // Inner border
    ctx.strokeStyle = '#A5B4FC';
    ctx.lineWidth = 3;
    ctx.strokeRect(35, 35, W - 70, H - 70);

    // Title
    ctx.fillStyle = '#6366F1';
    ctx.font = 'bold 48px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎯 LearnPath AI', W / 2, 120);

    // Subtitle
    ctx.fillStyle = '#4B5563';
    ctx.font = '24px Georgia, serif';
    ctx.fillText('Certificate of Completion', W / 2, 170);

    // Divider
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(100, 195);
    ctx.lineTo(W - 100, 195);
    ctx.stroke();

    // This certifies
    ctx.fillStyle = '#6B7280';
    ctx.font = '18px Arial, sans-serif';
    ctx.fillText('This certifies that', W / 2, 240);

    // Name
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 42px Georgia, serif';
    ctx.fillText(user?.name || user?.email || 'Learner', W / 2, 300);

    // Has completed
    ctx.fillStyle = '#6B7280';
    ctx.font = '18px Arial, sans-serif';
    ctx.fillText('has successfully completed the learning roadmap', W / 2, 345);

    // Goal
    ctx.fillStyle = '#6366F1';
    ctx.font = 'bold 26px Georgia, serif';
    const goal = roadmap?.goal || 'Learning Goal';
    // Wrap long text
    const maxWidth = W - 200;
    if (ctx.measureText(goal).width > maxWidth) {
      const words = goal.split(' ');
      let line = '';
      let y = 395;
      for (const word of words) {
        const testLine = line + word + ' ';
        if (ctx.measureText(testLine).width > maxWidth) {
          ctx.fillText(line, W / 2, y);
          line = word + ' ';
          y += 35;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, W / 2, y);
    } else {
      ctx.fillText(`"${goal}"`, W / 2, 395);
    }

    // Duration
    ctx.fillStyle = '#6B7280';
    ctx.font = '16px Arial, sans-serif';
    ctx.fillText(`Duration: ${roadmap?.duration_weeks} weeks`, W / 2, 450);

    // Date
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    ctx.fillText(`Issued on ${date}`, W / 2, 485);

    // Bottom divider
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(100, 510);
    ctx.lineTo(W - 100, 510);
    ctx.stroke();

    // Signature area
    ctx.fillStyle = '#6B7280';
    ctx.font = '14px Arial, sans-serif';
    ctx.fillText('LearnPath AI Platform', W / 2, 545);
    ctx.fillStyle = '#6366F1';
    ctx.font = 'bold 16px Georgia, serif';
    ctx.fillText('✓ Verified Achievement', W / 2, 570);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `learnpath-certificate-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!roadmap) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="text-center py-20">
        <p className="text-5xl mb-4">🎓</p>
        <p className="text-gray-600 mb-4">No roadmap found to generate certificate</p>
        <button onClick={() => navigate('/goal-setup')}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700">
          Create a Roadmap First
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">🎓 Your Certificate</h1>
          <p className="text-gray-400 text-sm mt-1">
            Download and share your achievement
          </p>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6 mb-6 overflow-x-auto">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="mx-auto max-w-full border rounded-xl shadow"
          />
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={handleDownload}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            ⬇️ Download Certificate
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}