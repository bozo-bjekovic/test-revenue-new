import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { UniversalChartCard } from '@/components/building-blocks/universal-chart-card/universal-chart-card';

export const monthlyRevenueTrendsQuery = `
  SELECT date_trunc('month', r.date) as month,
         SUM(r.total_revenue) as total_revenue,
         SUM(r.total_cost) as total_cost,
         SUM(r.gross_profit) as gross_profit,
         SUM(r.net_profit) as net_profit
  FROM revenue r
  WHERE r.date >= CURRENT_DATE - INTERVAL '12 months'
  GROUP BY date_trunc('month', r.date)
  ORDER BY month
`;

export type MonthlyRevenueTrendsData = {
  month: string;
  total_revenue: number;
  total_cost: number;
  gross_profit: number;
  net_profit: number;
};

interface MonthlyRevenueTrendsProps {
  data: MonthlyRevenueTrendsData[];
}

export function MonthlyRevenueTrends({ data }: MonthlyRevenueTrendsProps) {
  const formattedData = data.map((item) => ({
    ...item,
    month: new Date(item.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
  }));

  const chartConfig = {
    total_revenue: {
      label: 'Total Revenue',
      color: 'var(--chart-4)',
    },
    total_cost: {
      label: 'Total Cost',
      color: 'var(--chart-5)',
    },
    net_profit: {
      label: 'Net Profit',
      color: 'var(--chart-success)',
    },
  };

  return (
    <UniversalChartCard
      title="Monthly Revenue Trends"
      description="Revenue, costs and profits over the last 12 months"
      chartConfig={chartConfig}
    >
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="total_revenue"
            stroke="var(--chart-4-stroke)"
            fill="var(--chart-4)"
            fillOpacity={0.3}
          />
          <Area
            type="monotone"
            dataKey="total_cost"
            stroke="var(--chart-5-stroke)"
            fill="var(--chart-5)"
            fillOpacity={0.3}
          />
          <Area
            type="monotone"
            dataKey="net_profit"
            stroke="var(--chart-success-stroke)"
            fill="var(--chart-success)"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </UniversalChartCard>
  );
}
