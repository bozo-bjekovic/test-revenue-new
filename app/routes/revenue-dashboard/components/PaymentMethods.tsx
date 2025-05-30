import { ChartSharePercentage } from '@/components/building-blocks/chart-share-percentage/chart-share-percentage';

export const paymentMethodsQuery = `
  SELECT s.payment_method,
         COUNT(*) as transaction_count,
         SUM(s.total_amount) as total_amount
  FROM sales s
  WHERE s.sale_date >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY s.payment_method
  ORDER BY total_amount DESC
`;

export type PaymentMethodsData = {
  payment_method: string;
  transaction_count: number;
  total_amount: number;
};

interface PaymentMethodsProps {
  data: PaymentMethodsData[];
}

export function PaymentMethods({ data }: PaymentMethodsProps) {
  const chartConfig = {
    total_amount: {
      label: 'Total Amount',
      color: 'var(--chart-9)',
    },
  };

  const totalAmount = data.reduce((sum, item) => sum + item.total_amount, 0);
  const totalTransactions = data.reduce((sum, item) => sum + item.transaction_count, 0);

  return (
    <ChartSharePercentage
      data={data}
      title="Payment Methods"
      description="Payment method distribution (Last 30 days)"
      dataKey="total_amount"
      nameKey="payment_method"
      chartConfig={chartConfig}
      centerValueRenderer={(data) => ({
        title: totalTransactions.toLocaleString(),
        subtitle: 'Total Transactions',
      })}
    />
  );
}
