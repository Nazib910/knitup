import { Link } from 'react-router-dom';
import { Button } from 'antd';

export default function NotFoundPage() {
  return (
    <div className="max-w-container mx-auto px-5 py-32 text-center">
      <p className="text-knitup-light mb-4">404</p>
      <h1 className="text-h1 font-display text-knitup-gray mb-6">Page not found</h1>
      <Link to="/">
        <Button type="primary">Back to home</Button>
      </Link>
    </div>
  );
}
