import { memo } from 'react';
import { Star } from '@/shared/icons';
import type { Review } from '@/features/review/model/review.schemas';

interface ReviewFeedCardProps {
  review: Review;
}

const ReviewFeedCard = memo(({ review }: ReviewFeedCardProps) => (
  <div
    className="rounded-xl p-4"
    style={{
      backgroundColor: 'var(--color-card)',
      border: '1px solid var(--color-stroke)',
    }}
  >
    <div className="flex justify-between items-center mb-2">
      <span className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
        {review.user?.name || 'Customer'}
      </span>
      <div className="flex items-center gap-1">
        <Star size={12} className="fill-warning text-warning" />
        <span className="text-xs font-semibold">{review.rating}</span>
      </div>
    </div>
    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
      &quot;{review.comment}&quot;
    </p>
  </div>
));

ReviewFeedCard.displayName = 'ReviewFeedCard';
export default ReviewFeedCard;
