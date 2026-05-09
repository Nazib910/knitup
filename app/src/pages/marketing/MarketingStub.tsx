import { useParams } from 'react-router-dom';

// Generic placeholder for marketing routes. P6 will flesh out individual pages.
export default function MarketingStub({ kind }: { kind: string }) {
  const params = useParams();
  return (
    <div className="max-w-container mx-auto px-5 py-20">
      <h1 className="text-h2 font-display text-knitup-gray mb-4">
        {titleFor(kind, params.slug)}
      </h1>
      <p className="text-knitup-text">
        This is a placeholder. Real content lands in P6 of the milestone plan.
      </p>
    </div>
  );
}

function titleFor(kind: string, slug?: string) {
  const map: Record<string, string> = {
    about: 'About KnitStudio',
    sustainability: 'Sustainability',
    'the-loop': 'The Loop',
    knitup101: 'KnitStudio 101',
    contact: 'Contact us',
    essentials: 'Essentials vs Atelier',
    terms: 'Terms & Conditions',
    privacy: 'Privacy Policy',
  };
  return slug ? `${map[kind] ?? kind}: ${slug}` : map[kind] ?? kind;
}
