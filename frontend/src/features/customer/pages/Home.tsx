import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { merchantKeys } from '@/features/merchant/api/merchant.queries';
import { orderKeys } from '@/features/order/api/order.api';
import { useAuth } from '@/features/auth/model/use-auth';
import * as merchantApi from '@/features/merchant/api/merchant.api';
import * as orderApi from '@/features/order/api/order.api';
import ActiveOrderCard from '@/features/customer/components/ActiveOrderCard';
import MerchantCard from '@/features/customer/components/MerchantCard';
import SkeletonCard from '@/shared/components/SkeletonCard';
import SectionHeader from '@/shared/components/SectionHeader';
import { fieldControlClassName } from '@/shared/components/form-field.styles';
import { List, MapPin, Search, Shirt, Store, Truck, User } from '@/shared/icons';
import { useNavigate } from '@/shared/router';
import { cn } from '@/shared/utils/cn';

const ACTIVE_STATUSES = new Set(['CREATED', 'PROCESSING', 'FINISHED']);

export default function CustomerHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: orderKeys.customerList,
    queryFn: orderApi.getCustomerOrders,
  });

  const { data: merchantsData, isLoading: merchantsLoading } = useQuery({
    queryKey: merchantKeys.list(),
    queryFn: () => merchantApi.getMerchants(),
  });

  const recentOrder = orders?.find((order) => ACTIVE_STATUSES.has(order.status));
  const allMerchants = merchantsData?.merchants;
  const merchants = useMemo(() => {
    const query = search.trim().toLowerCase();
    const availableMerchants = allMerchants ?? [];
    if (!query) return availableMerchants.slice(0, 5);
    return availableMerchants.filter((merchant) =>
      `${merchant.name} ${merchant.address}`.toLowerCase().includes(query),
    );
  }, [allMerchants, search]);

  const shortcuts = [
    { label: 'Nearby', icon: MapPin, onClick: () => navigate('/explore') },
    { label: 'My Orders', icon: List, onClick: () => navigate('/orders') },
    { label: 'Delivery', icon: Truck, onClick: () => navigate('/explore') },
    { label: 'Profile', icon: User, onClick: () => navigate('/profile') },
  ];

  return (
    <div className="h-full overflow-y-auto bg-bg pb-28">
      <header className="relative overflow-hidden rounded-b-[2rem] bg-primary px-[clamp(1rem,4vw,2rem)] pb-14 pt-11 text-white">
        <div className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full border-[2rem] border-white/8" aria-hidden="true" />
        <div className="relative z-10">
          <h1 className="text-2xl font-semibold tracking-tight">Hi, {user?.name?.split(' ')[0] || 'there'}!</h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-white/85">
            <MapPin size={14} aria-hidden="true" />
            <span className="truncate">{user?.address || 'Set your delivery address'}</span>
          </div>

          <div className="relative mt-5">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary" size={17} aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search laundry by name or address"
              placeholder="Search laundry by name or address"
              className={cn(fieldControlClassName, 'bg-card pl-11')}
            />
          </div>
        </div>
      </header>

      <div className="space-y-7 px-[clamp(1rem,4vw,2rem)] pt-6">
        <section aria-label="Active Laundry">
          {ordersLoading ? (
            <SkeletonCard />
          ) : recentOrder ? (
            <ActiveOrderCard order={recentOrder} onClick={() => navigate(`/orders/${recentOrder.id}`)} />
          ) : (
            <button
              type="button"
              onClick={() => navigate('/explore')}
              className="relative flex w-full items-center justify-between overflow-hidden rounded-2xl border border-primary bg-primary p-5 text-left text-white transition-transform active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-primary"
            >
              <div className="pointer-events-none absolute -right-10 -top-14 size-40 rounded-full border-[1.5rem] border-white/10" aria-hidden="true" />
              <div className="relative z-10">
                <h2 className="font-semibold text-white">No Active Laundry</h2>
                <p className="mt-1 text-sm text-white/80">Start an order with a nearby laundry.</p>
              </div>
              <span className="relative z-10 flex size-11 items-center justify-center rounded-xl border border-white/30 bg-white/15 text-white" aria-hidden="true">
                <Shirt size={19} />
              </span>
            </button>
          )}
        </section>

        <section>
          <SectionHeader title="Shortcuts" />
          <div className="grid grid-cols-4 gap-2">
            {shortcuts.map(({ label, icon: Icon, onClick }) => (
              <button
                key={label}
                type="button"
                onClick={onClick}
                className="flex min-w-0 flex-col items-center gap-2 rounded-xl border border-stroke bg-card px-1 py-3 text-center active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-primary"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-primary-light text-primary" aria-hidden="true">
                  <Icon size={17} />
                </span>
                <span className="w-full truncate text-[11px] font-semibold text-text-secondary">{label}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title="Laundry Near You" action={{ label: 'View All', onClick: () => navigate('/explore') }} />
          <div className="flex flex-col gap-3">
            {merchantsLoading ? (
              <><SkeletonCard /><SkeletonCard /></>
            ) : merchants.length > 0 ? (
              merchants.map((merchant) => (
                <MerchantCard key={merchant.id} merchant={merchant} onClick={() => navigate(`/merchants/${merchant.id}`)} />
              ))
            ) : (
              <div className="rounded-2xl border border-stroke bg-card p-6 text-center">
                <Store size={28} className="mx-auto mb-2 text-text-tertiary" aria-hidden="true" />
                <p className="text-sm text-text-secondary">No laundry matches your search.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
