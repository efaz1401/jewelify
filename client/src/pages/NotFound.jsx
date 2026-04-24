import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition.jsx';

export default function NotFound() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-xl px-4 py-32 text-center lg:px-8">
        <p className="font-display text-8xl font-semibold shimmer-text">404</p>
        <h1 className="mt-4 font-display text-3xl font-semibold">Page not found</h1>
        <p className="mt-2 text-ink-600">This page slipped through our fingers like a loose earring.</p>
        <Link to="/" className="btn-primary mt-6 inline-flex">Back to home</Link>
      </div>
    </PageTransition>
  );
}
