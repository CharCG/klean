import { memo } from 'react';
import { Package, Clock } from '@/shared/icons';
import type { Order } from '@/features/order/model/order.schemas';
import { formatOrderId } from '@/shared/utils/formatId';

interface ActiveOrderCardProps {
  order: Order;
  onClick: () => void;
}

const ActiveOrderCard = memo(({ order, onClick }: ActiveOrderCardProps) => (
  <button
    type="button"
    onClick={onClick}
    className="relative w-full cursor-pointer overflow-hidden rounded-2xl border border-primary bg-primary p-5 text-left text-white transition-transform active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-primary"
  >
    <div className="pointer-events-none absolute -right-10 -top-14 size-40 rounded-full border-[1.5rem] border-white/10" aria-hidden="true" />
    <div className="relative z-10">
      <div className="flex items-start justify-between gap-3">
        <h2 className="flex items-center gap-2 font-semibold text-white">
          <Package size={18} aria-hidden="true" /> Active Order
        </h2>
        <span className="rounded-full border border-white/40 bg-white/15 px-2.5 py-1 text-[10px] font-semibold text-white">
          {order.status}
        </span>
      </div>

      <div className="mt-5">
        <p className="text-lg font-semibold text-white">{order.merchant?.name || 'Merchant'}</p>
        <p className="mt-0.5 text-xs text-white/70">Order {formatOrderId(order.id)}</p>
      </div>

      <div className="mt-5 flex items-center justify-between rounded-xl border border-white/25 bg-white/10 p-3">
        <div className="flex items-center gap-2">
          <Clock size={16} aria-hidden="true" />
          <span className="text-xs font-semibold text-white/85">Est. Completion</span>
        </div>
        <span className="text-sm font-bold text-white">{order.estimationTime || 'Pending'}</span>
      </div>
    </div>
  </button>
));

ActiveOrderCard.displayName = 'ActiveOrderCard';
export default ActiveOrderCard;
