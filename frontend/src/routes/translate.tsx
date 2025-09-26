import { createFileRoute } from '@tanstack/react-router';
import TranslatePage from '../pages/translate';

export const Route = createFileRoute('/translate')({
  component: TranslatePage,
});
