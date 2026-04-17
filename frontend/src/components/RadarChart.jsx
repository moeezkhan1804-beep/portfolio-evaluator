import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  { category: "Activity",     score: 12 },
  { category: "Code Quality", score: 2  },
  { category: "Diversity",    score: 10 },
  { category: "Community",    score: 8  },
  { category: "Hiring Ready", score: 6  },
];

export default function ProfileRadar() {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <PolarGrid stroke="#2a2a4a" />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fill: "#a0a0c0", fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 20]}
            tick={{ fill: "#6060a0", fontSize: 10 }}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.35}
            dot={{ r: 4, fill: "#6366f1" }}
          />
          <Tooltip
            contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a4a", borderRadius: 8 }}
            labelStyle={{ color: "#a0a0c0" }}
            itemStyle={{ color: "#6366f1" }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}