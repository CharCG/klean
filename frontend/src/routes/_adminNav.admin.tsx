import { createFileRoute } from '@tanstack/react-router';
import { AdminNavigationLayout } from '@/app/layouts';

export const Route = createFileRoute('/_adminNav/admin')({ component: AdminNavigationLayout });
