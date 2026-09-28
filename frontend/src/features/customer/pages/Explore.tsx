import { merchantKeys } from '@/features/merchant/api/merchant.queries';
import { useState } from 'react';
import { useNavigate } from '@/shared/router';
import { Search, MapPin } from '@/shared/icons';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/model/use-auth';
import * as api from '@/features/merchant/api/merchant.api';
import MerchantCard from '@/features/customer/components/MerchantCard';
import SkeletonCard from '@/shared/components/SkeletonCard';
import { fieldControlClassName } from '@/shared/components/form-field.styles';
import { cn } from '@/shared/utils/cn';
import TopBar from '@/shared/components/TopBar';
import SectionHeader from '@/shared/components/SectionHeader';

export default function Explore() {
  const [search, setSearch] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: merchantKeys.list(),
    queryFn: () => api.getMerchants(),
  });

  const merchants = (data?.merchants || []).filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-bg pb-24">
      <TopBar title="Explore" />
      <div className="px-[clamp(1rem,4vw,2rem)] pt-5">
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-stroke bg-card p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary" aria-hidden="true">
            <MapPin size={16} />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-text-secondary">Deliver To</p>
            <p className="mt-0.5 truncate text-sm font-semibold text-text">{user?.address || 'Set your delivery address'}</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-text-tertiary" size={18} />
          <input
            type="search"
            placeholder="Search laundry nearby..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search laundry nearby"
            className={cn(fieldControlClassName, 'bg-card pl-12')}
          />
        </div>

        <div className="mt-6">
          <SectionHeader title="Top Rated Near You" />
        </div>

        <div className="flex flex-col gap-4">
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : merchants.length === 0 ? (
            <p className="text-center text-sm py-10 text-text-tertiary">
              No merchants found.
            </p>
          ) : (
            merchants.map((merchant) => (
              <MerchantCard
                key={merchant.id}
                merchant={merchant}
                onClick={() => navigate(`/merchants/${merchant.id}`)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
