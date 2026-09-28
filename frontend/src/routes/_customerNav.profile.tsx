import { createFileRoute } from '@tanstack/react-router';
import CustomerProfile from '@/features/customer/pages/Profile';

export const Route = createFileRoute('/_customerNav/profile')({ component: CustomerProfile });
