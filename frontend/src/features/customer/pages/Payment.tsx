import { orderKeys } from '@/features/order/api/order.api';
import { useParams, useNavigate } from '@/shared/router';
import { useQuery } from '@tanstack/react-query';
import * as api from '@/features/order/api/order.api';
import TopBar from '@/shared/components/TopBar';
import PageSkeleton from '@/shared/components/PageSkeleton';

export default function Payment() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading } = useQuery({ queryKey: orderKeys.detail(orderId), queryFn: () => api.getOrderById(orderId!), enabled: !!orderId });

  if (isLoading) return <PageSkeleton />;
  const url = order?.payment && 'snapRedirectUrl' in order.payment ? order.payment.snapRedirectUrl : null;
  if (url) { window.open(url, '_blank'); navigate(`/orders/${orderId}`, { replace: true }); }

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--color-bg)' }}>
      <TopBar title="Payment" showBack />
      <div className="flex-1 flex items-center justify-center p-6 text-center">
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Redirecting to payment...</p>
      </div>
    </div>
  );
}
