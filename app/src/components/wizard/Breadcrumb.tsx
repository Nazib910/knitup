import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

// Wizard breadcrumb. Matches the live audit: "← <StepName>  Step N of 7"
// at the top-left of every editor page. PRD §6.
export function Breadcrumb({
  productName,
  stepName,
  stepIndex,
  totalSteps = 7,
}: {
  productName: string;
  stepName: string;
  stepIndex: number;
  totalSteps?: number;
}) {
  const navigate = useNavigate();
  return (
    <nav aria-label="Wizard progress" className="px-5 pt-6">
      <div className="max-w-container mx-auto">
        <p className="text-knitup-light text-sm">{productName}</p>
        <div className="flex items-baseline gap-3 mt-1">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-knitup-gray font-semibold text-h3"
            aria-label={`Back from ${stepName}`}
          >
            <ArrowLeftOutlined />
            <span aria-current="step">{stepName}</span>
          </button>
          <span className="text-knitup-light text-sm">
            Step {stepIndex} of {totalSteps}
          </span>
        </div>
      </div>
    </nav>
  );
}
