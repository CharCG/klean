import { createFileRoute } from '@tanstack/react-router';
import CustomerHome from '@/features/customer/pages/Home';

export const Route = createFileRoute('/_customerNav/')({ component: CustomerHome });
