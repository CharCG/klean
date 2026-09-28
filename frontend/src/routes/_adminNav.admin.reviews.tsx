import { createFileRoute } from '@tanstack/react-router';
import AdminReviews from '@/features/admin/pages/Reviews';

export const Route = createFileRoute('/_adminNav/admin/reviews')({ component: AdminReviews });
