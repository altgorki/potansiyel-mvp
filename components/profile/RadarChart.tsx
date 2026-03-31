'use client';

import { Radar, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { AREAS } from '@/lib/constants';
import { UserScore } from '@/lib/types';

interface RadarChartProps {
  scores: UserScore[];
}

export default function RadarChart({ scores }: RadarChartProps) {
  const data = scores.map(s => {
    const area = AREAS.find(a => a.key === s.area_key);
    return {
      subject: area?.name ?? s.area_key,
      score: s.score,
      fullMark: 100,
    };
  });

  if (data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsRadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
        <PolarGrid stroke="rgba(255,255,255,0.1)" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
        <Radar name="Puan" dataKey="score" stroke="#0d9488" fill="#0d9488" fillOpacity={0.3} />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
}
