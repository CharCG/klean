import { useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from '@/shared/router';
import * as paymentApi from '@/features/payment/api/payment.api';
import PageSkeleton from '@/shared/components/PageSkeleton';
import { showErrorToast } from '@/shared/errors/notify-error';

export default function PaymentFinish() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const didRun = useRef(false);
  const verifyPaymentMutation = useMutation({ mutationFn: paymentApi.verifyPayment });

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    const orderId = searchParams.get('order_id') ?? searchParams.get('orderId');

    const finish = async () => {
      if (orderId) {
        try {
          await verifyPaymentMutation.mutateAsync(orderId);
        } catch (error) {
          showErrorToast(error);
        }
      }
      navigate(orderId ? `/orders/${orderId}` : '/orders', { replace: true });
    };

    finish();
  }, [navigate, searchParams, verifyPaymentMutation]);

  return <PageSkeleton />;
}
