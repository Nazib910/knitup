import { Drawer, Button, Empty, App as AntdApp } from 'antd';
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useUIStore } from '@/store/ui';
import { useCollectionStore } from '@/store/collection';
import type { CartItem, Design } from '@/types';

// Slide-out cart drawer. Triggered by the header cart icon.
// Renders a line item per cart entry with thumbnail + breakdown + qty + total.
export function CartDrawer() {
  const open = useUIStore((s) => s.cartDrawerOpen);
  const setOpen = useUIStore((s) => s.setCartDrawerOpen);
  const cart = useCollectionStore((s) => s.cart);
  const designs = useCollectionStore((s) => s.designs);
  const removeFromCart = useCollectionStore((s) => s.removeFromCart);
  const clearCart = useCollectionStore((s) => s.clearCart);
  const { notification, modal } = AntdApp.useApp();

  const totalUsd = cart.reduce((sum, c) => sum + c.totalUsd, 0);
  const totalPcs = cart.reduce(
    (sum, c) => sum + Object.values(c.qtyBySize).reduce((a, b) => a + (b ?? 0), 0),
    0,
  );

  const onCheckout = () => {
    notification.success({
      message: 'Checkout (visual stub)',
      description:
        'Stripe integration is mocked in v0. In production this would open a Stripe Checkout session.',
      placement: 'topRight',
      duration: 5,
    });
  };

  const onClear = () => {
    modal.confirm({
      title: 'Clear cart?',
      content: 'All items in your cart will be removed.',
      okText: 'Clear',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      onOk: () => clearCart(),
    });
  };

  return (
    <Drawer
      open={open}
      onClose={() => setOpen(false)}
      width={Math.min(480, typeof window !== 'undefined' ? window.innerWidth : 480)}
      title={
        <div className="flex items-center justify-between">
          <span>Your Cart</span>
          {cart.length > 0 && (
            <span className="text-knitup-light text-sm font-normal">
              {totalPcs} pcs
            </span>
          )}
        </div>
      }
      placement="right"
      styles={{ body: { padding: 0 } }}
      extra={
        cart.length > 0 ? (
          <Button type="link" danger size="small" onClick={onClear}>
            Clear
          </Button>
        ) : null
      }
    >
      <div className="flex flex-col h-full">
        {cart.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <Empty
              image={<ShoppingOutlined style={{ fontSize: 64, color: '#dedede' }} />}
              description="Your cart is empty"
            >
              <Link to="/design/studio" onClick={() => setOpen(false)}>
                <Button type="primary">Browse silhouettes</Button>
              </Link>
            </Empty>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-3">
              <AnimatePresence initial={false}>
                {cart.map((item) => {
                  const design = designs.find((d) => d.designId === item.designId);
                  return (
                    <CartLine
                      key={item.designId}
                      item={item}
                      design={design}
                      onRemove={() => removeFromCart(item.designId)}
                    />
                  );
                })}
              </AnimatePresence>
            </div>

            <footer className="border-t border-knitup-lighter px-4 py-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-knitup-text">Sub-total</span>
                <motion.span
                  key={totalUsd}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-knitup-text tabular-nums"
                >
                  USD {totalUsd.toFixed(2)}
                </motion.span>
              </div>
              <div className="flex justify-between text-base font-semibold pt-3 border-t border-knitup-lighter">
                <span className="text-knitup-gray">Total</span>
                <span className="text-knitup-gray tabular-nums">USD {totalUsd.toFixed(2)}</span>
              </div>
              <Button type="primary" size="large" block onClick={onCheckout}>
                Checkout
              </Button>
            </footer>
          </>
        )}
      </div>
    </Drawer>
  );
}

function CartLine({
  item,
  design,
  onRemove,
}: {
  item: CartItem;
  design?: Design;
  onRemove: () => void;
}) {
  const totalPcs = Object.values(item.qtyBySize).reduce((a, b) => a + (b ?? 0), 0);
  const sizeBreakdown = Object.entries(item.qtyBySize)
    .filter(([, n]) => (n ?? 0) > 0)
    .map(([k, n]) => `${k} × ${n}`)
    .join(', ');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.25 }}
      className="flex gap-3 py-3 border-b border-knitup-lighter/60 last:border-b-0"
    >
      <div className="flex-none w-20 h-20 bg-knitup-bgSoft rounded-card overflow-hidden">
        <img
          src={design?.thumbnails[0] ?? '/silhouettes/mens-oversized-crew.svg'}
          alt=""
          className="w-full h-full object-contain p-2"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-knitup-gray text-sm font-semibold truncate">
          {design?.name ?? 'Custom Design'}
        </p>
        <p className="text-knitup-light text-xs mt-0.5">
          {sizeBreakdown || `${totalPcs} pcs`}
        </p>
        <p className="text-knitup-text text-sm mt-2 tabular-nums">
          USD {item.totalUsd.toFixed(2)}
        </p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove from cart"
        className="self-start w-7 h-7 rounded-pill text-knitup-light hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center"
      >
        <DeleteOutlined />
      </button>
    </motion.div>
  );
}
