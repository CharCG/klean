import { merchantKeys } from '@/features/merchant/api/merchant.queries';
import { DollarSign, ShoppingBag, Star, MessageSquare } from '@/shared/icons';
import { useQuery } from '@tanstack/react-query';
import * as api from '@/features/merchant/api/merchant.api';
import TopBar from '@/shared/components/TopBar';
import MetricCard from '@/features/merchant/components/MetricCard';
import ReviewFeedCard from '@/features/merchant/components/ReviewFeedCard';
import SkeletonCard from '@/shared/components/SkeletonCard';
import { formatCurrency } from '@/shared/utils/formatCurrency';

export default function MerchantDashboard() {
  const { data, isLoading } = useQuery({ queryKey: merchantKeys.dashboard(), queryFn: api.getMerchantDashboard });

  return (
    <div className="flex flex-col h-full bg-bg pb-24 overflow-y-auto">
      <TopBar title="Dashboard" />
      <div className="p-6">
        {isLoading ? <><SkeletonCard /><SkeletonCard /></> : data ? (
          <>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <MetricCard icon={<DollarSign size={16} />} value={formatCurrency(data.totalRevenue)} label="Total Revenue" />
              <MetricCard icon={<ShoppingBag size={16} />} value={data.completedOrders} label="Completed" />
              <MetricCard icon={<Star size={16} />} value={data.averageRating.toFixed(1)} label="Avg. Rating" />
              <MetricCard icon={<MessageSquare size={16} />} value={data.totalReviews} label="Total Reviews" />
            </div>
            <h3 className="font-semibold text-lg mb-4" style={{ color: 'var(--color-text)' }}>Recent Reviews</h3>
            <div className="flex flex-col gap-3">
              {data.recentReviews.length === 0 ? <p className="text-sm text-center py-8" style={{ color: 'var(--color-text-tertiary)' }}>No reviews yet.</p> : data.recentReviews.map((r) => <ReviewFeedCard key={r.id} review={r} />)}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
