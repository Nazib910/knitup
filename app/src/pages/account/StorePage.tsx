import { useState } from 'react';
import { Button, Input, App as AntdApp, Tag } from 'antd';
import { ShopOutlined, DisconnectOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { AccountShell } from './AccountShell';
import { useAccountStore } from '@/store/account';

// PRD §17 Q4 — visual stub. "Connect" simulates a Shopify OAuth handshake
// by saving a connection record to localStorage; no real API call.
export default function StorePage() {
  const store = useAccountStore((s) => s.store);
  const connect = useAccountStore((s) => s.connectStore);
  const disconnect = useAccountStore((s) => s.disconnectStore);
  const { notification, modal } = AntdApp.useApp();

  const [storeUrl, setStoreUrl] = useState('');
  const [busy, setBusy] = useState(false);

  const onConnect = async () => {
    if (!storeUrl.trim()) {
      notification.warning({ message: 'Please enter your Shopify store URL' });
      return;
    }
    setBusy(true);
    // Simulate handshake
    await new Promise((r) => setTimeout(r, 800));
    connect({
      provider: 'shopify',
      storeUrl: storeUrl.trim(),
      connectedAt: new Date().toISOString(),
      productCount: 0,
    });
    setBusy(false);
    notification.success({
      message: 'Store connected',
      description: 'Visual stub — no real Shopify call (PRD §17 Q4).',
      placement: 'topRight',
    });
  };

  const onDisconnect = () => {
    modal.confirm({
      title: 'Disconnect store?',
      content: 'Your designs will no longer sync. You can reconnect at any time.',
      okText: 'Disconnect',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      onOk: () => {
        disconnect();
        notification.info({ message: 'Store disconnected' });
      },
    });
  };

  return (
    <AccountShell
      active="store"
      title="Store"
      subtitle="Connect your Shopify store to publish designs as products."
    >
      {!store ? (
        <div className="max-w-xl">
          <div className="border border-dashed border-knitup-lighter rounded-card p-8 text-center bg-knitup-bgSoft/30">
            <ShopOutlined className="text-4xl text-knitup-light mb-3" />
            <h3 className="text-knitup-gray font-semibold mb-2">No store connected</h3>
            <p className="text-knitup-light text-sm mb-6">
              Enter your Shopify store URL to begin. We'll mock the OAuth flow in v0.
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <Input
                placeholder="your-store.myshopify.com"
                value={storeUrl}
                onChange={(e) => setStoreUrl(e.target.value)}
                aria-label="Shopify store URL"
              />
              <Button type="primary" onClick={onConnect} loading={busy}>
                Connect
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl border border-knitup-lighter rounded-card p-6 bg-white"
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-pill bg-knitup-bgSoft flex items-center justify-center">
                <ShopOutlined className="text-2xl text-knitup-gray" />
              </div>
              <div>
                <p className="font-semibold text-knitup-gray">{store.storeUrl}</p>
                <p className="text-knitup-light text-xs">
                  Connected {dayjs(store.connectedAt).format('D MMM, YYYY')}
                </p>
              </div>
            </div>
            <Tag color="green">Connected</Tag>
          </div>

          <dl className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-knitup-lighter">
            <div>
              <dt className="text-knitup-light text-xs">Provider</dt>
              <dd className="text-knitup-gray text-sm capitalize mt-1">{store.provider}</dd>
            </div>
            <div>
              <dt className="text-knitup-light text-xs">Synced products</dt>
              <dd className="text-knitup-gray text-sm mt-1 tabular-nums">{store.productCount}</dd>
            </div>
          </dl>

          <Button danger icon={<DisconnectOutlined />} onClick={onDisconnect}>
            Disconnect
          </Button>
        </motion.div>
      )}
    </AccountShell>
  );
}
