"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

type RoomUsageChartProps = {
  data: { name: string; usage: number; utilization?: number }[];
};

const chartConfig = {
  usage: {
    label: "Số giờ sử dụng",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-2 shadow-md">
        <div className="grid grid-cols-1 gap-2">
          <div className="flex flex-col">
            <span className="text-sm font-medium">{label}</span>
            <span className="text-xs text-muted-foreground">
              Số giờ: {data.usage} giờ
            </span>
            {data.utilization !== undefined && (
              <span className="text-xs text-muted-foreground">
                Tỉ lệ sử dụng: {data.utilization}%
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function RoomUsageChart({ data }: RoomUsageChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            label={{ value: 'Số giờ sử dụng', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="usage" 
            fill="var(--color-usage)" 
            radius={[4, 4, 0, 0]}
            name="Số giờ sử dụng"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
