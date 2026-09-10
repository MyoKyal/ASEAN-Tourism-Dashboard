import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { formatVisitors } from '../constants';

export default function VisitorsChart({ data, height = 180 }) {
  if (!data?.length) return null;
  const chartData = [...data].sort((a, b) => a.year - b.year);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="year" tick={{ fontSize: 11 }} />
        <YAxis
          tick={{ fontSize: 11 }}
          tickFormatter={formatVisitors}
          width={48}
        />
        <Tooltip
          formatter={(v) => [formatVisitors(v), 'Visitors']}
          contentStyle={{ fontSize: 12 }}
        />
        <Line
          type="monotone"
          dataKey="visitors"
          stroke="#1a5f4a"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
