import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { UniversalChartCard } from '@/components/building-blocks/universal-chart-card/universal-chart-card';

export const topOrganizationsQuery = `
  SELECT o.organization_name, 
         SUM(r.total_revenue) as total_revenue, 
         SUM(r.product_revenue) as product_revenue, 
         SUM(r.subscription_revenue) as subscription_revenue, 
         SUM(r.net_profit) as net_profit 
  FROM organizations o 
  JOIN revenue r ON o.organization_id = r.organization_id 
  WHERE r.date >= CURRENT_DATE - INTERVAL '30 days' 
  GROUP BY o.organization_name 
  ORDER BY total_revenue DESC 
  LIMIT 10
`;

export type TopOrganizationsData = {
  organization_name: string;
  total_revenue: number;
  product_revenue: number;
  subscription_revenue: number;
  net_profit: number;
};

interface TopOrganizationsProps {
  data: TopOrganizationsData[];
}

export function TopOrganizations({ data }: TopOrganizationsProps) {
  const chartConfig = {
    product_revenue: {
      label: 'Product Revenue',
      color: 'var(--chart-1)',
    },
    subscription_revenue: {
      label: 'Subscription Revenue',
      color: 'var(--chart-2)',
    },
    net_profit: {
      label: 'Net Profit',
      color: 'var(--chart-3)',
    },
  };

  return (
    <UniversalChartCard
      title="Top Organizations Revenue (Last 30 Days)"
      description="Revenue breakdown by organization"
      chartConfig={chartConfig}
    >
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="organization_name" angle={-45} textAnchor="end" height={100} />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="product_revenue"
            stackId="1"
            stroke="var(--chart-1-stroke)"
            fill="var(--chart-1)"
          />
          <Area
            type="monotone"
            dataKey="subscription_revenue"
            stackId="1"
            stroke="var(--chart-2-stroke)"
            fill="var(--chart-2)"
          />
          <Area
            type="monotone"
            dataKey="net_profit"
            stroke="var(--chart-3-stroke)"
            fill="var(--chart-3)"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </UniversalChartCard>
  );
}
