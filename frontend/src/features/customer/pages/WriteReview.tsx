import { showErrorToast } from '@/shared/errors/notify-error';
import { orderKeys } from '@/features/order/api/order.api';
import { useState, type FormEvent } from 'react';
import { useParams, useNavigate } from '@/shared/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Star } from '@/shared/icons';
import * as orderApi from '@/features/order/api/order.api';
import * as reviewApi from '@/features/review/api/review.api';
import TopBar from '@/shared/components/TopBar';
import Button from '@/shared/components/Button';
import { useToast } from '@/shared/stores/toast-store';
import SkeletonCard from '@/shared/components/SkeletonCard';
import { FieldLabel } from '@/shared/components/FormField';
import { fieldControlClassName } from '@/shared/components/form-field.styles';

export default function WriteReview() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const qc = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const { data: order, isLoading } = useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => orderApi.getOrderById(orderId!),
    enabled: !!orderId,
  });

  const mutation = useMutation({
    mutationFn: (commentText: string) => reviewApi.createReview(orderId!, { rating, comment: commentText }),
    onSuccess: () => {
      showToast('Review submitted!', 'success');
      qc.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
      qc.invalidateQueries({ queryKey: orderKeys.customerList });
      navigate(-1);
    },
    onError: showErrorToast,
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (comment.trim()) mutation.mutate(comment);
  };

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--color-card)' }}>
      <TopBar title="Write Review" showBack onBack={() => navigate(-1)} />

      {isLoading ? (
        <div className="p-6"><SkeletonCard /></div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg mb-1" style={{ color: 'var(--color-text)' }}>{order?.merchant?.name || 'Merchant'}</h3>
          <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>Order {order?.id}</p>

          <div className="flex gap-2 justify-center mb-8">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} type="button" aria-label={`Rate ${s} out of 5`} onClick={() => setRating(s)} className="flex size-11 cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-primary">
                <Star size={36} className={s <= rating ? 'fill-warning text-warning' : ''} style={{ color: s > rating ? 'var(--color-stroke-medium)' : undefined }} />
              </button>
            ))}
          </div>

          <FieldLabel htmlFor="review-comment">Review Comment</FieldLabel>
          <textarea
            id="review-comment"
            name="comment"
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="How was the service?"
            className={`${fieldControlClassName} mb-6 h-32 resize-none`}
          />

          <Button
            type="submit" 
            isLoading={mutation.isPending} 
            variant="secondary"
            fullWidth
            className="mt-auto"
          >
            Submit Review
          </Button>
        </form>
      )}
    </div>
  );
}
