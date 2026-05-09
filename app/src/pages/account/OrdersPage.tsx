import { Table, Tag, Empty, Button } from 'antd';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { AccountShell } from './AccountShell';
import { useAccountStore } from '@/store/account';
import type { Order } from '@/types/account';

const STATUS_COLORS: Record<Order['status'], string> = {
  pending: 'gold',
  'in-production': 'blue',
  shipped: 'purple',
  delivered: 'green',
  cancelled: 'default',
};

export default function OrdersPage() {
  const orders = useAccountStore((s) => s.orders);

  return (
    <AccountShell active="orders" title="Order History" subtitle="All your KnitStudio orders in one place.">
      {orders.length === 0 ? (
        <Empty description="You have no orders yet">
          <Link to="/design/studio">
            <Button type="primary">Start designing</Button>
          </Link>
        </Empty>
      ) : (
        <Table
          dataSource={orders}
          rowKey="orderId"
          pagination={{ pageSize: 10 }}
          columns={[
            { title: 'Order', dataIndex: 'orderId', key: 'orderId' },
            {
              title: 'Placed',
              dataIndex: 'placedAt',
              key: 'placedAt',
              render: (v: string) => dayjs(v).format('D MMM, YYYY'),
            },
            {
              title: 'Items',
              key: 'items',
              render: (_: unknown, o: Order) =>
                o.lines.reduce((sum, l) => sum + l.qty, 0) + ' pcs',
            },
            {
              title: 'Total',
              dataIndex: 'totalUsd',
              key: 'totalUsd',
              align: 'right',
              render: (v: number) => `USD ${v.toFixed(2)}`,
            },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
              render: (s: Order['status']) => <Tag color={STATUS_COLORS[s]}>{s}</Tag>,
            },
          ]}
        />
      )}
    </AccountShell>
  );
}
