import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { UniversalChartCard } from '@/components/building-blocks/universal-chart-card/universal-chart-card';

export const subscriptionMetricsQuery = `
  SELECT sub.plan_name,
         COUNT(DISTINCT sub.organization_id) as total_subscribers,
         SUM(sub.monthly_price) as monthly_recurring_revenue
  FROM subscriptions sub
  WHERE sub.status = 'active'
  GROUP BY sub.plan_name
  ORDER BY monthly_recurring_revenue DESC
`;

export type SubscriptionMetricsData = {
  plan_name: string;
  total_subscribers: number;
  monthly_recurring_revenue: number;
};

interface SubscriptionMetricsProps {
  data: SubscriptionMetricsData[];
}

export function SubscriptionMetrics({ data }: SubscriptionMetricsProps) {
  const chartConfig = {
    monthly_recurring_revenue: {
      label: 'Monthly Recurring Revenue',
      color: 'var(--chart-7)',
    },
    total_subscribers: {
      label: 'Total Subscribers',
      color: 'var(--chart-8)',
    },
  };

  return (
    <UniversalChartCard
      title="Subscription Metrics"
      description="Active subscribers and MRR by plan"
      chartConfig={chartConfig}
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="plan_name" />
          <YAxis yAxisId="left" orientation="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Bar
            yAxisId="left"
            dataKey="monthly_recurring_revenue"
            fill="var(--chart-7)"
            stroke="var(--chart-7-stroke)"
          />
          <Bar yAxisId="right" dataKey="total_subscribers" fill="var(--chart-8)" stroke="var(--chart-8-stroke)" />
        </BarChart>
      </ResponsiveContainer>
    </UniversalChartCard>
  );
}
