import { ChartSharePercentage } from '@/components/building-blocks/chart-share-percentage/chart-share-percentage';

export const categoryRevenueQuery = `
  SELECT p.category,
         COUNT(DISTINCT s.sale_id) as total_sales,
         SUM(si.total_price) as revenue
  FROM products p
  JOIN sale_items si ON p.product_id = si.product_id
  JOIN sales s ON si.sale_id = s.sale_id
  WHERE s.sale_date >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY p.category
  ORDER BY revenue DESC
`;

export type CategoryRevenueData = {
  category: string;
  total_sales: number;
  revenue: number;
};

interface CategoryRevenueProps {
  data: CategoryRevenueData[];
}

export function CategoryRevenue({ data }: CategoryRevenueProps) {
  const chartConfig = {
    revenue: {
      label: 'Revenue',
      color: 'var(--chart-6)',
    },
  };

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <ChartSharePercentage
      data={data}
      title="Revenue by Category"
      description="Product category revenue distribution (Last 30 days)"
      dataKey="revenue"
      nameKey="category"
      chartConfig={chartConfig}
      centerValueRenderer={(data) => ({
        title: `$${totalRevenue.toLocaleString()}`,
        subtitle: 'Total Revenue',
      })}
    />
  );
}
