import { useLoaderData } from '@remix-run/react';
import { executePostgresQuery } from '@/db/execute-query';
import { WithErrorHandling } from '@/components/hoc/error-handling-wrapper/error-handling-wrapper';
import {
  TopOrganizations,
  TopOrganizationsData,
  topOrganizationsQuery,
} from './revenue-dashboard/components/TopOrganizations';
import {
  MonthlyRevenueTrends,
  MonthlyRevenueTrendsData,
  monthlyRevenueTrendsQuery,
} from './revenue-dashboard/components/MonthlyRevenueTrends';
import {
  CategoryRevenue,
  CategoryRevenueData,
  categoryRevenueQuery,
} from './revenue-dashboard/components/CategoryRevenue';
import {
  SubscriptionMetrics,
  SubscriptionMetricsData,
  subscriptionMetricsQuery,
} from './revenue-dashboard/components/SubscriptionMetrics';
import {
  PaymentMethods,
  PaymentMethodsData,
  paymentMethodsQuery,
} from './revenue-dashboard/components/PaymentMethods';
import { RevenueMetrics } from './revenue-dashboard/components/RevenueMetrics';

export async function loader() {
  const [topOrgs, monthlyTrends, categoryRev, subscriptions, payments] = await Promise.all([
    executePostgresQuery<TopOrganizationsData>(topOrganizationsQuery),
    executePostgresQuery<MonthlyRevenueTrendsData>(monthlyRevenueTrendsQuery),
    executePostgresQuery<CategoryRevenueData>(categoryRevenueQuery),
    executePostgresQuery<SubscriptionMetricsData>(subscriptionMetricsQuery),
    executePostgresQuery<PaymentMethodsData>(paymentMethodsQuery),
  ]);

  return {
    topOrgs,
    monthlyTrends,
    categoryRev,
    subscriptions,
    payments,
  };
}

export default function RevenueDashboard() {
  const { topOrgs, monthlyTrends, categoryRev, subscriptions, payments } = useLoaderData<typeof loader>();

  // Calculate metrics for the RevenueMetrics component
  const calculateMetrics = () => {
    if (
      !monthlyTrends.data ||
      !subscriptions.data ||
      !payments.data ||
      monthlyTrends.isError ||
      subscriptions.isError ||
      payments.isError
    ) {
      return {
        totalRevenue: 0,
        monthlyRecurringRevenue: 0,
        averageTransactionValue: 0,
        activeSubscribers: 0,
      };
    }

    const totalRevenue =
      monthlyTrends.data[monthlyTrends.data.length - 1]?.total_revenue || 0;
    const monthlyRecurringRevenue = subscriptions.data.reduce(
      (sum, item) => sum + item.monthly_recurring_revenue,
      0,
    );
    const totalTransactions = payments.data.reduce((sum, item) => sum + item.transaction_count, 0);
    const totalAmount = payments.data.reduce((sum, item) => sum + item.total_amount, 0);
    const averageTransactionValue = totalTransactions ? totalAmount / totalTransactions : 0;
    const activeSubscribers = subscriptions.data.reduce((sum, item) => sum + item.total_subscribers, 0);

    return {
      totalRevenue,
      monthlyRecurringRevenue,
      averageTransactionValue,
      activeSubscribers,
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Revenue Dashboard</h1>

      <RevenueMetrics {...metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WithErrorHandling
          queryData={monthlyTrends}
          render={(data) => <MonthlyRevenueTrends data={data} />}
        />
        <WithErrorHandling
          queryData={topOrgs}
          render={(data) => <TopOrganizations data={data} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WithErrorHandling
          queryData={categoryRev}
          render={(data) => <CategoryRevenue data={data} />}
        />
        <WithErrorHandling
          queryData={payments}
          render={(data) => <PaymentMethods data={data} />}
        />
      </div>

      <WithErrorHandling
        queryData={subscriptions}
        render={(data) => <SubscriptionMetrics data={data} />}
      />
    </div>
  );
}
