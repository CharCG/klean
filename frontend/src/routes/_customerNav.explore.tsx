import { createFileRoute } from '@tanstack/react-router';
import Explore from '@/features/customer/pages/Explore';

export const Route = createFileRoute('/_customerNav/explore')({ component: Explore });
