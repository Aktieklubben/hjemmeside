"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Series = { date: string; value: number | null }[];

export type ChartSeriesInput = {
  id: string;
  name: string;
  series: Series;
  isIndex?: boolean;
};

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#db2777",
  "#d97706",
  "#7c3aed",
  "#0891b2",
  "#65a30d",
  "#dc2626",
];
const INDEX_COLORS: Record<string, string> = {
  sp500: "#f59e0b",
  omxc25: "#6b7280",
};

function mergeSeries(inputs: ChartSeriesInput[]) {
  const dates = inputs[0]?.series.map((p) => p.date) ?? [];
  return dates.map((date, i) => {
    const row: Record<string, string | number | null> = { date };
    for (const input of inputs) {
      row[input.id] = input.series[i]?.value ?? null;
    }
    return row;
  });
}

export default function PerformanceChart({
  data,
}: {
  data: ChartSeriesInput[];
}) {
  const chartData = mergeSeries(data);

  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-black/10 dark:stroke-white/10" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            minTickGap={40}
            tickFormatter={(d: string) => d.slice(5)}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            width={48}
            tickFormatter={(v: number) => `${v}`}
            domain={["auto", "auto"]}
          />
          <Tooltip
            formatter={(value, name) => [
              typeof value === "number" ? value.toFixed(1) : "–",
              name,
            ]}
            labelFormatter={(label) => `Dato: ${label}`}
          />
          <Legend />
          {data.map((input, i) => (
            <Line
              key={input.id}
              type="monotone"
              dataKey={input.id}
              name={input.name}
              stroke={INDEX_COLORS[input.id] ?? COLORS[i % COLORS.length]}
              strokeDasharray={input.isIndex ? "6 4" : undefined}
              dot={false}
              strokeWidth={2}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
