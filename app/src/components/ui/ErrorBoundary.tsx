import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button, Result } from 'antd';

// Top-level error boundary. Catches render errors in any descendant and
// shows a friendly fallback with a "Reload" + "Go home" affordance.
// PRD §16: protect against runtime crashes (e.g. WebGL2 unavailable on
// older mobile Safari).

interface State {
  hasError: boolean;
  error: Error | null;
}

interface Props {
  children: ReactNode;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In production this would ship to Sentry / Bugsnag.
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <Result
        status="500"
        title="Something went wrong"
        subTitle={
          <span className="text-knitup-light">
            {this.state.error?.message ?? 'An unexpected error occurred.'}
          </span>
        }
        extra={[
          <Button key="reload" type="primary" onClick={() => window.location.reload()}>
            Reload page
          </Button>,
          <Button key="home" onClick={() => { window.location.href = '/'; this.handleReset(); }}>
            Go home
          </Button>,
        ]}
      />
    );
  }
}
