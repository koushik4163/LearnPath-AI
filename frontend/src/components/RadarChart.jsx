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
        <PolarGrid stroke="rgba(255, 255, 255, 0.08)" />
        <PolarAngleAxis
          dataKey="skill"
          tick={{ fontSize: 12, fill: '#B9B1A7' }}
        />
        <Radar
          name="Score"
          dataKey="score"
          stroke="#7C8CFF"
          fill="#7C8CFF"
          fillOpacity={0.25}
        />
      </ReRadarChart>
    </ResponsiveContainer>
  );
}