import { memo } from 'react';
import { Star, MapPin, Store } from '@/shared/icons';
import type { MerchantListItem } from '@/features/merchant/model/merchant.schemas';

interface MerchantCardProps {
  merchant: MerchantListItem;
  onClick: () => void;
}

const MerchantCard = memo(({ merchant, onClick }: MerchantCardProps) => (
  <button
    type="button"
    onClick={onClick}
    className="flex w-full cursor-pointer items-center gap-4 rounded-2xl border border-stroke bg-card p-4 text-left transition-transform active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-primary"
  >
    <div className="w-16 h-16 bg-primary-light rounded-xl flex items-center justify-center text-primary flex-shrink-0">
      {merchant.logoUrl ? (
        <img src={merchant.logoUrl} alt={merchant.name} className="w-full h-full object-cover rounded-xl" />
      ) : (
        <Store size={28} />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="font-semibold text-text truncate">{merchant.name}</h4>
      <p className="text-text-secondary text-xs mt-0.5 truncate">{merchant.address}</p>
      <div className="flex items-center gap-3 mt-2 text-xs font-medium text-text-secondary">
        <span className="flex items-center gap-1">
          <Star size={14} className="fill-warning text-warning" />
          {merchant.rating.toFixed(1)}
        </span>
        <span className="flex items-center gap-1 text-text-tertiary">
          <MapPin size={14} />
          {merchant.address.split(',')[0]}
        </span>
      </div>
    </div>
  </button>
));

MerchantCard.displayName = 'MerchantCard';
export default MerchantCard;
