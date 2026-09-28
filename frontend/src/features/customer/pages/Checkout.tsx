import { showErrorToast } from '@/shared/errors/notify-error';
import { orderKeys } from '@/features/order/api/order.api';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from '@/shared/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MapPin, Truck, Map, Package, Banknote, CreditCard } from '@/shared/icons';
import * as orderApi from '@/features/order/api/order.api';
import * as paymentApi from '@/features/payment/api/payment.api';
import TopBar from '@/shared/components/TopBar';
import Button from '@/shared/components/Button';
import { cn } from '@/shared/utils/cn';
import { useToast } from '@/shared/stores/toast-store';
import { useAuth } from '@/features/auth/model/use-auth';
import { checkoutStateSchema, type FulfillmentType } from '@/features/order/model/order.schemas';
import { FieldLabel } from '@/shared/components/FormField';
import { fieldControlClassName } from '@/shared/components/form-field.styles';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const qc = useQueryClient();
  const checkoutState = checkoutStateSchema.safeParse(location.state);
  const cart = checkoutState.success ? checkoutState.data.cart : [];
  const merchantId = checkoutState.success ? checkoutState.data.merchantId : '';
  const [fulfillment, setFulfillment] = useState<FulfillmentType>('DELIVERY');
  const [payment, setPayment] = useState('QRIS');
  const [notes, setNotes] = useState('');

  const subtotal = cart?.reduce((sum, item) => sum + (item.price * item.qty), 0) || 0;
  const deliveryFee = fulfillment === 'DELIVERY' ? 15000 : 0;
  const total = subtotal + deliveryFee;

  const verifyPaymentMutation = useMutation({ mutationFn: paymentApi.verifyPayment });
  const mutation = useMutation({
    mutationFn: () => orderApi.createOrder({ merchantId, fulfillment, notes: notes || undefined, items: cart.map((c) => ({ serviceId: c.id, quantity: c.qty })) }),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: orderKeys.customerList });
      showToast('Order placed successfully!', 'success');
      const snapToken = data.payment?.snapToken;
      const orderId = data.order.id;
      if (snapToken && window.snap) {
        window.snap.pay(snapToken, {
          onSuccess: async () => {
            await verifyPaymentMutation.mutateAsync(orderId);
            qc.invalidateQueries({ queryKey: orderKeys.customerList });
            navigate(`/orders/${orderId}`, { replace: true });
          },
          onPending: async () => {
            await verifyPaymentMutation.mutateAsync(orderId);
            navigate(`/orders/${orderId}`, { replace: true });
          },
          onError: () => navigate(`/orders/${orderId}`, { replace: true }),
          onClose: () => navigate(`/orders/${orderId}`, { replace: true }),
        });
      } else {
        navigate(`/orders/${orderId}`, { replace: true });
      }
    },
    onError: showErrorToast,
  });

  useEffect(() => {
    if (!checkoutState.success) navigate('/explore', { replace: true });
  }, [checkoutState.success, navigate]);

  if (!checkoutState.success) return null;

  const handlePlaceOrderClick = () => {
    if (window.confirm(`Are you sure you want to place this order for Rp ${total.toLocaleString()}?`)) {
      mutation.mutate();
    }
  };

  return (
    <div className="flex flex-col h-full bg-bg relative overflow-y-auto">
      <TopBar title="Secure Checkout" showBack onBack={() => navigate(-1)} />

      <div className="p-6 space-y-6">
        <section className="rounded-xl border border-stroke bg-card p-4">
          <h3 className="font-semibold text-text text-sm mb-2">Delivery Address</h3>
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-primary mt-0.5 flex-shrink-0" />
            <p className="text-text-secondary text-sm leading-relaxed font-medium">
              {user?.address || 'No address set. Update in profile.'}
            </p>
          </div>
        </section>

        <section>
          <FieldLabel htmlFor="checkout-notes">Order Notes</FieldLabel>
          <textarea
            id="checkout-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="E.g., Please fold shirts individually, handle delicate fabric with care..."
            className={`${fieldControlClassName} h-24 resize-none bg-card`}
          ></textarea>
        </section>

        <section>
          <h3 className="font-semibold text-text text-sm mb-3">Fulfillment Method</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => setFulfillment('DELIVERY')}
              variant="outline"
              className={cn(
                '!p-4 !rounded-xl !border !text-left !flex !flex-col !gap-2 !transition-colors !justify-start !items-start !h-auto !min-h-0 !font-normal !tracking-normal !bg-card !border-stroke !text-text',
                fulfillment === 'DELIVERY' && '!bg-primary-light !border-primary !text-primary-dark'
              )}
            >
              <Truck size={20} className={fulfillment === 'DELIVERY' ? 'text-primary' : 'text-text-tertiary'} />
              <div>
                <div className="font-semibold text-sm">Delivery</div>
                <div className="text-xs opacity-80 mt-0.5">Rp 15.000</div>
              </div>
            </Button>
            <Button
              onClick={() => setFulfillment('PICKUP')}
              variant="outline"
              className={cn(
                '!p-4 !rounded-xl !border !text-left !flex !flex-col !gap-2 !transition-colors !justify-start !items-start !h-auto !min-h-0 !font-normal !tracking-normal !bg-card !border-stroke !text-text',
                fulfillment === 'PICKUP' && '!bg-primary-light !border-primary !text-primary-dark'
              )}
            >
              <Map size={20} className={fulfillment === 'PICKUP' ? 'text-primary' : 'text-text-tertiary'} />
              <div>
                <div className="font-semibold text-sm">Self Pickup</div>
                <div className="text-xs opacity-80 mt-0.5">Free</div>
              </div>
            </Button>
          </div>
        </section>

        <section>
          <h3 className="font-semibold text-text text-sm mb-3">Payment Method</h3>
          <div className="flex flex-col gap-2">
            {['QRIS', 'Credit Card', 'Cash'].map(method => (
              <label
                key={method}
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors ${payment === method ? 'border-primary bg-card' : 'border-stroke bg-card'
                  }`}
              >
                <div className="flex items-center gap-3">
                  {method === 'QRIS' ? (
                    <Package size={18} className={payment === method ? 'text-primary' : 'text-text-tertiary'} />
                  ) : method === 'Cash' ? (
                    <Banknote size={18} className={payment === method ? 'text-success' : 'text-text-tertiary'} />
                  ) : (
                    <CreditCard size={18} className={payment === method ? 'text-primary' : 'text-text-tertiary'} />
                  )}
                  <span className="text-sm font-semibold text-text">{method}</span>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={payment === method}
                  onChange={() => setPayment(method)}
                  className="focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-primary"
                  style={{ accentColor: 'var(--color-primary)' }}
                />
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-stroke bg-card p-5">
          <h3 className="font-semibold text-text text-sm mb-4">Order Summary</h3>
          <div className="space-y-2">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <span className="text-text-secondary text-sm font-medium">{item.qty}x {item.name}</span>
                <span className="font-semibold text-text text-sm">Rp {(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-stroke flex justify-between items-center">
            <span className="text-text-secondary text-sm font-medium">Delivery Fee</span>
            <span className="font-semibold text-text text-sm">Rp {deliveryFee.toLocaleString()}</span>
          </div>
          <div className="mt-3 pt-3 border-t border-stroke flex justify-between items-center">
            <span className="font-semibold text-text">Total</span>
            <span className="font-bold text-primary text-lg">Rp {total.toLocaleString()}</span>
          </div>
        </section>

        <Button
          onClick={handlePlaceOrderClick}
          isLoading={mutation.isPending}
          variant="primary"
          fullWidth
        >
          Place Order
        </Button>
      </div>
    </div>
  );
}

