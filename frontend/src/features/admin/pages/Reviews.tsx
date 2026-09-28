import { showErrorToast } from '@/shared/errors/notify-error';
import { reviewKeys } from '@/features/review/api/review.api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, Trash2 } from '@/shared/icons';
import * as api from '@/features/review/api/review.api';
import TopBar from '@/shared/components/TopBar';
import SkeletonCard from '@/shared/components/SkeletonCard';
import EmptyState from '@/shared/components/EmptyState';
import { useToast } from '@/shared/stores/toast-store';
import { formatDate } from '@/shared/utils/formatDate';
import Button from '@/shared/components/Button';

export default function AdminReviews() {
  const { showToast } = useToast();
  const qc = useQueryClient();
  const { data: reviews, isLoading } = useQuery({ queryKey: reviewKeys.list, queryFn: api.getReviews });
  const delMut = useMutation({ mutationFn: (id: string) => api.deleteReview(id), onSuccess: () => { qc.invalidateQueries({ queryKey: reviewKeys.list }); showToast('Deleted', 'success'); }, onError: showErrorToast });

  return (
    <div className="flex flex-col h-full pb-24 overflow-y-auto" style={{ backgroundColor: 'var(--color-bg)' }}>
      <TopBar title="Reviews" />
      <div className="p-6 flex flex-col gap-4">
        {isLoading ? <><SkeletonCard /><SkeletonCard /></> : (reviews || []).length === 0 ? <EmptyState title="No reviews found" /> : (reviews || []).map((r) => (
          <div key={r.id} className="rounded-xl p-4" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-stroke)' }}>
            <div className="flex justify-between items-start mb-3">
              <div><h4 className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{r.user?.name || 'User'}</h4><p className="text-[10px] font-medium mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>Merchant: {r.merchant?.name || 'N/A'} • {formatDate(r.createdAt)}</p></div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ backgroundColor: 'var(--color-warning-light)', border: '1px solid var(--color-warning)' }}><Star size={12} className="fill-warning text-warning" /><span className="text-xs font-bold" style={{ color: 'var(--color-warning)' }}>{r.rating}</span></div>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-secondary)' }}>"{r.comment}"</p>
            <div className="flex justify-end pt-3" style={{ borderTop: '1px solid var(--color-stroke)' }}>
              <Button onClick={() => delMut.mutate(r.id)} isLoading={delMut.isPending} variant="danger" size="sm" className="gap-1.5"><Trash2 size={14} /> Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
