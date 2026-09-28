import { orderKeys } from '@/features/order/api/order.api';
import { useParams, useNavigate } from '@/shared/router';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as orderApi from '@/features/order/api/order.api';
import * as reportApi from '@/features/report/api/report.api';
import * as paymentApi from '@/features/payment/api/payment.api';
import TopBar from "@/shared/components/TopBar";
import Button from "@/shared/components/Button";
import OrderStatusBadge from "@/shared/components/OrderStatusBadge";
import ErrorState from "@/shared/components/ErrorState";
import PageSkeleton from "@/shared/components/PageSkeleton";
import StepTimeline from "@/shared/components/StepTimeline";
import { formatCurrency } from "@/shared/utils/formatCurrency";
import { formatOrderId } from "@/shared/utils/formatId";
import { formatDate } from "@/shared/utils/formatDate";
import { useToast } from "@/shared/stores/toast-store";
import {
  AlertTriangle,
  Star,
  FileText,
  CreditCard,
  CheckCircle2,
  Clock4,
  Package,
  Clock,
  Truck,
  CheckCircle,
} from '@/shared/icons';
import { useState, type FormEvent } from "react";
import { AppError } from '@/shared/errors/app-error';
import { showErrorToast } from '@/shared/errors/notify-error';
import { FieldLabel } from '@/shared/components/FormField';
import { fieldControlClassName } from '@/shared/components/form-field.styles';

export default function CustomerOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [showReportForm, setShowReportForm] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const {
    data: order,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => orderApi.getOrderById(id!),
    enabled: !!id,
  });

  const reportMutation = useMutation({
    mutationFn: (issue: string) => reportApi.createReport(id!, { issue }),
    onSuccess: () => {
      showToast("Report submitted successfully", "success");
      setShowReportForm(false);
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
    },
    onError: showErrorToast,
  });

  const confirmMutation = useMutation({
    mutationFn: () => orderApi.confirmOrderReceived(id!),
    onSuccess: () => {
      showToast("Order marked as completed! Thank you.", "success");
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.customerList });
    },
    onError: showErrorToast,
  });

  const verifyPaymentMutation = useMutation({ mutationFn: paymentApi.verifyPayment });

  const handleReport = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const issue = new FormData(e.currentTarget).get("issue") as string;
    if (issue.trim()) reportMutation.mutate(issue);
  };

  if (isLoading) return <PageSkeleton />;
  if (isError || !order) return <ErrorState onRetry={refetch} />;

  const paymentStatus = order.payment && "status" in order.payment ? order.payment.status : undefined;
  const snapToken = order.payment && "snapToken" in order.payment ? order.payment.snapToken : undefined;

  const handlePay = () => {
    if (!snapToken || !window.snap) return;
    setIsPaying(true);
    const historyLengthBefore = window.history.length;

    const clearSnapHistory = (callback: () => void) => {
      const snapEntries = window.history.length - historyLengthBefore;
      if (snapEntries > 0) {
        window.history.go(-snapEntries);
        setTimeout(callback, 100);
      } else {
        callback();
      }
    };

    window.snap.pay(snapToken, {
      onSuccess: async () => {
        try {
          await verifyPaymentMutation.mutateAsync(id!);
          queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
          queryClient.invalidateQueries({ queryKey: orderKeys.customerList });
          showToast("Payment successful!", "success");
        } finally {
          setIsPaying(false);
          clearSnapHistory(() => navigate(`/orders/${id}`, { replace: true }));
        }
      },
      onPending: async () => {
        try {
          await verifyPaymentMutation.mutateAsync(id!);
          queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
        } finally {
          setIsPaying(false);
          clearSnapHistory(() => navigate(`/orders/${id}`, { replace: true }));
        }
      },
      onError: () => {
        showErrorToast(new AppError('business', { message: 'Payment failed. Please try again.' }));
        setIsPaying(false);
      },
      onClose: () => {
        setIsPaying(false);
      },
    });
  };

  const orderSteps = [
    { status: "CREATED", label: "Order Created", icon: <Package size={16} /> },
    { status: "PROCESSING", label: "Processing", icon: <Clock size={16} /> },
    { status: "FINISHED", label: "Ready/Delivering", icon: <Truck size={16} /> },
    { status: "COMPLETED", label: "Completed", icon: <CheckCircle size={16} /> },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ backgroundColor: "var(--color-bg)" }}>
      <TopBar title="Order Details" showBack onBack={() => navigate('/orders', { replace: true })} />
      <div className="p-6 space-y-5">
        {/* Payment Success Banner */}
        {paymentStatus === "PAID" && (
          <div
            className="rounded-xl p-4 flex items-center gap-3"
            style={{
              backgroundColor: "var(--color-success-light)",
              border: "1px solid var(--color-success)",
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "var(--color-success)" }}
            >
              <CheckCircle2 size={20} color="var(--color-card)" />
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: "var(--color-success)" }}>
                Payment Successful
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                Your order is confirmed and being processed by the merchant.
              </p>
            </div>
          </div>
        )}

        {/* Awaiting Payment Notice */}
        {paymentStatus === "PENDING" && !snapToken && (
          <div
            className="rounded-xl p-4 flex items-center gap-3"
            style={{
              backgroundColor: "var(--color-warning-light)",
              border: "1px solid var(--color-warning)",
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "var(--color-card)" }}
            >
              <Clock4 size={20} style={{ color: "var(--color-warning)" }} />
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: "var(--color-warning)" }}>
                Awaiting Payment
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                Payment is pending. Please complete your payment.
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div
          className="rounded-xl p-5 flex items-center justify-between"
          style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-stroke)" }}
        >
          <div>
            <span className="text-xs font-medium" style={{ color: "var(--color-text-tertiary)" }}>
              {formatOrderId(order.id)}
            </span>
            <h2 className="font-semibold text-lg mt-1" style={{ color: "var(--color-text)" }}>
              {order.merchant?.name || "Merchant"}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
              {formatDate(order.createdAt)}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        {/* Pay Now Button */}
        {paymentStatus === "PENDING" && snapToken && (
          <button
            type="button"
            onClick={handlePay}
            disabled={isPaying}
            aria-busy={isPaying}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:opacity-70 text-white"
            style={{
              backgroundColor: "var(--color-primary)",
              border: "none",
            }}
          >
            <CreditCard size={16} />
            {isPaying ? "Opening payment..." : "Pay Now"}
          </button>
        )}

        {/* Items */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-stroke)" }}
        >
          <h3
            className="font-semibold text-sm mb-3 pb-2"
            style={{ color: "var(--color-text)", borderBottom: "1px solid var(--color-stroke)" }}
          >
            Order Items
          </h3>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span style={{ color: "var(--color-text)" }}>
                  {item.quantity}x {item.name}
                </span>
                <span className="font-medium" style={{ color: "var(--color-text)" }}>
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
            {order.fulfillment === "DELIVERY" && (
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--color-text-secondary)" }}>Delivery Fee</span>
                <span className="font-medium" style={{ color: "var(--color-text)" }}>
                  {formatCurrency(15000)}
                </span>
              </div>
            )}
            <div className="flex justify-between pt-3 mt-2" style={{ borderTop: "1px solid var(--color-stroke)" }}>
              <span className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>
                Total
              </span>
              <span className="font-semibold text-sm" style={{ color: "var(--color-primary)" }}>
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        {["CREATED", "PROCESSING", "FINISHED", "COMPLETED"].includes(order.status) && (
          <StepTimeline currentStatus={order.status} steps={orderSteps} />
        )}

        {/* Delivery Info */}
        <div
          className="rounded-xl p-5 space-y-2 text-sm"
          style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-stroke)" }}
        >
          <h3
            className="font-semibold text-sm mb-3 pb-2"
            style={{ color: "var(--color-text)", borderBottom: "1px solid var(--color-stroke)" }}
          >
            Delivery Info
          </h3>
          <p>
            <span style={{ color: "var(--color-text-secondary)" }}>Fulfillment:</span>{" "}
            <span className="font-medium" style={{ color: "var(--color-text)" }}>
              {order.fulfillment}
            </span>
          </p>
          <p>
            <span style={{ color: "var(--color-text-secondary)" }}>ETA:</span>{" "}
            <span className="font-medium" style={{ color: order.status === "COMPLETED" ? "var(--color-success)" : "var(--color-text)" }}>
              {order.status === "COMPLETED" ? "Done" : (order.estimationTime || "Pending")}
            </span>
          </p>
          {order.notes && (
            <p>
              <span style={{ color: "var(--color-text-secondary)" }}>Notes:</span>{" "}
              <span className="font-medium" style={{ color: "var(--color-text)" }}>
                {order.notes}
              </span>
            </p>
          )}
        </div>

        {/* Order Received — customer confirms delivery before COMPLETED */}
        {order.status === "FINISHED" && (
          <div
            className="rounded-xl p-4"
            style={{
              backgroundColor: "var(--color-warning-light)",
              border: "1px solid var(--color-warning)",
            }}
          >
            <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-warning)" }}>
              Your order is ready / on its way!
            </p>
            <p className="text-xs mb-4" style={{ color: "var(--color-text-secondary)" }}>
              Once you receive your laundry, press the button below to mark it as completed.
            </p>
            <Button
              onClick={() => confirmMutation.mutate()}
              isLoading={confirmMutation.isPending}
              variant="primary"
              fullWidth
              className="!bg-warning !border-warning"
              style={{ backgroundColor: "var(--color-warning)" }}
            >
              <CheckCircle2 size={16} className="mr-2" />
              Order Received
            </Button>
          </div>
        )}

        {/* Review */}
        {order.status === "COMPLETED" && !order.review && (
          <Button onClick={() => navigate(`/review/${id}`)} variant="secondary" fullWidth>
            <Star size={16} className="mr-2" /> Write Review
          </Button>
        )}

        {order.review && (
          <div
            className="rounded-xl p-5"
            style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-stroke)" }}
          >
            <h3
              className="font-semibold text-sm mb-3 pb-2"
              style={{ color: "var(--color-text)", borderBottom: "1px solid var(--color-stroke)" }}
            >
              Your Review
            </h3>
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={16}
                  className={s <= order.review!.rating ? "fill-warning text-warning" : ""}
                  style={{ color: s > order.review!.rating ? "var(--color-stroke-medium)" : undefined }}
                />
              ))}
            </div>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              "{order.review.comment}"
            </p>
          </div>
        )}

        {/* Report */}
        {order.status === "COMPLETED" && !order.report && !showReportForm && (
          <Button
            onClick={() => setShowReportForm(true)}
            variant="outline"
            fullWidth
            className="!text-danger !border-danger/30 hover:!bg-danger/5"
          >
            <AlertTriangle size={16} /> Report Issue
          </Button>
        )}

        {showReportForm && (
          <form
            onSubmit={handleReport}
            className="rounded-xl p-5 space-y-4"
            style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-stroke)" }}
          >
            <FieldLabel htmlFor="report-issue">Describe The Issue</FieldLabel>
            <textarea
              id="report-issue"
              name="issue"
              required
              rows={4}
              className={`${fieldControlClassName} resize-none`}
              placeholder="Tell us what happened..."
            />
            <div className="flex gap-3">
              <Button type="button" onClick={() => setShowReportForm(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button type="submit" isLoading={reportMutation.isPending} variant="danger" className="flex-1">
                Submit
              </Button>
            </div>
          </form>
        )}

        {order.report && (
          <div
            className="rounded-xl p-5"
            style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-stroke)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} style={{ color: "var(--color-danger)" }} />
              <h3 className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>
                Reported Issue
              </h3>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              {order.report.issue}
            </p>
            <span
              className="text-[10px] font-semibold px-2 py-1 rounded-full uppercase mt-2 inline-block"
              style={{
                backgroundColor:
                  order.report.status === "OPEN" ? "var(--color-danger-light)" : "var(--color-success-light)",
                color: order.report.status === "OPEN" ? "var(--color-danger)" : "var(--color-success)",
                border: `1px solid ${order.report.status === "OPEN" ? "var(--color-danger)" : "var(--color-success)"}`,
              }}
            >
              {order.report.status}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
