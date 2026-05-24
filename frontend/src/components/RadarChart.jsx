import {
  RadarChart as ReRadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';

export default function RadarChart({ data = [] }) {
  if (!data.length) return null;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ReRadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis
          dataKey="skill"
          tick={{ fontSize: 12, fill: '#6B7280' }}
        />
        <Radar
          name="Score"
          dataKey="score"
          stroke="#6366F1"
          fill="#6366F1"
          fillOpacity={0.25}
        />
      </ReRadarChart>
    </ResponsiveContainer>
  );
}