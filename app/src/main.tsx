import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, App as AntdApp } from 'antd';
import { router } from '@/app/routes';
import { antdTheme } from '@/app/theme';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import './index.css';

// MSW: start the mock service worker in dev so /coreApi/v1/* responds.
async function bootstrap() {
  if (import.meta.env.DEV) {
    const { worker } = await import('@/mocks/browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ErrorBoundary>
        <ConfigProvider theme={antdTheme}>
          <AntdApp>
            <RouterProvider router={router} />
          </AntdApp>
        </ConfigProvider>
      </ErrorBoundary>
    </StrictMode>,
  );
}

bootstrap();
