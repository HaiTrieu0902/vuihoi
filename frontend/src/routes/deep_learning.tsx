import { createFileRoute } from '@tanstack/react-router';
import DeepLearningPage from '../pages/deep_learning';

export const Route = createFileRoute('/deep_learning')({
  component: DeepLearningPage,
});
