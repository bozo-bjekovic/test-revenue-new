import { DollarSign, TrendingUp, CreditCard, Users } from 'lucide-react';
import { QuickInfoCard } from '@/components/building-blocks/quick-info-card/quick-info-card';

interface RevenueMetricsProps {
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  averageTransactionValue: number;
  activeSubscribers: number;
}

export function RevenueMetrics({
  totalRevenue,
  monthlyRecurringRevenue,
  averageTransactionValue,
  activeSubscribers,
}: RevenueMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <QuickInfoCard
        title="Total Revenue (30d)"
        description="Total revenue for the last 30 days"
        icon={<DollarSign className="h-5 w-5 text-green-500" />}
      >
        <div className="text-3xl font-bold">${totalRevenue.toLocaleString()}</div>
      </QuickInfoCard>

      <QuickInfoCard
        title="Monthly Recurring Revenue"
        description="Current MRR from subscriptions"
        icon={<TrendingUp className="h-5 w-5 text-blue-500" />}
      >
        <div className="text-3xl font-bold">${monthlyRecurringRevenue.toLocaleString()}</div>
      </QuickInfoCard>

      <QuickInfoCard
        title="Avg. Transaction Value"
        description="Average transaction amount"
        icon={<CreditCard className="h-5 w-5 text-purple-500" />}
      >
        <div className="text-3xl font-bold">${averageTransactionValue.toLocaleString()}</div>
      </QuickInfoCard>

      <QuickInfoCard
        title="Active Subscribers"
        description="Total number of active subscribers"
        icon={<Users className="h-5 w-5 text-orange-500" />}
      >
        <div className="text-3xl font-bold">{activeSubscribers.toLocaleString()}</div>
      </QuickInfoCard>
    </div>
  );
}
