'use client';

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

type GpaChartProps = {
  data: { range: string; count: number }[];
};

const chartConfig = {
  count: {
    label: "Số lượng SV",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;


export default function GpaChart({ data }: GpaChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
        <CartesianGrid vertical={false} />
          <XAxis
            dataKey="range"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            stroke="#888888"
            fontSize={12}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip cursor={{ fill: 'hsl(var(--accent))' }} content={<ChartTooltipContent />} />
          <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
