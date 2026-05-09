import { useState } from 'react';
import { Button, Modal, Tag, App as AntdApp, Empty } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { AccountShell } from './AccountShell';
import { useAccountStore } from '@/store/account';
import { addressSchema, type AddressFormData } from '@/lib/schemas';
import { FormField } from '@/components/forms/FormField';
import type { Address } from '@/types/account';

const newId = () => `addr-${crypto.randomUUID?.() ?? Date.now().toString(36)}`;

export default function AddressPage() {
  const addresses = useAccountStore((s) => s.addresses);
  const upsert = useAccountStore((s) => s.upsertAddress);
  const remove = useAccountStore((s) => s.removeAddress);
  const setDefault = useAccountStore((s) => s.setDefaultAddress);
  const { notification, modal } = AntdApp.useApp();

  const [editing, setEditing] = useState<Address | null>(null);
  const [open, setOpen] = useState(false);

  const openNew = () => {
    setEditing({
      id: newId(),
      label: 'Home',
      recipient: '',
      line1: '',
      line2: '',
      city: '',
      region: '',
      postalCode: '',
      country: '',
      phone: '',
      isDefault: addresses.length === 0,
    });
    setOpen(true);
  };

  const openEdit = (a: Address) => {
    setEditing(a);
    setOpen(true);
  };

  const onDelete = (a: Address) => {
    modal.confirm({
      title: 'Remove address?',
      content: a.label,
      okText: 'Remove',
      okButtonProps: { danger: true },
      onOk: () => {
        remove(a.id);
        notification.info({ message: 'Address removed' });
      },
    });
  };

  return (
    <AccountShell
      active="address"
      title="Address Book"
      subtitle="Manage shipping and billing addresses for your orders."
    >
      <div className="flex justify-end mb-4">
        <Button type="primary" icon={<PlusOutlined />} onClick={openNew}>
          Add address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <Empty description="No addresses saved yet" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {addresses.map((a) => (
              <motion.div
                key={a.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="border border-knitup-lighter rounded-card p-4 bg-white"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-knitup-gray">{a.label}</h3>
                    {a.isDefault && <Tag color="green">Default</Tag>}
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setDefault(a.id)}
                      className="w-7 h-7 rounded-pill text-knitup-gray hover:bg-knitup-bgSoft transition-colors flex items-center justify-center"
                      aria-label={a.isDefault ? 'Default address' : 'Set as default'}
                      title={a.isDefault ? 'Default' : 'Set as default'}
                    >
                      {a.isDefault ? <StarFilled className="text-yellow-500" /> : <StarOutlined />}
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(a)}
                      className="w-7 h-7 rounded-pill text-knitup-gray hover:bg-knitup-bgSoft transition-colors flex items-center justify-center"
                      aria-label="Edit"
                    >
                      <EditOutlined />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(a)}
                      className="w-7 h-7 rounded-pill text-knitup-gray hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center"
                      aria-label="Delete"
                    >
                      <DeleteOutlined />
                    </button>
                  </div>
                </div>
                <p className="text-knitup-text text-sm">{a.recipient}</p>
                <p className="text-knitup-light text-sm">
                  {a.line1}
                  {a.line2 ? `, ${a.line2}` : ''}
                </p>
                <p className="text-knitup-light text-sm">
                  {a.city}, {a.region} {a.postalCode}
                </p>
                <p className="text-knitup-light text-sm">{a.country}</p>
                <p className="text-knitup-light text-sm mt-2">{a.phone}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {editing && (
        <AddressFormModal
          open={open}
          onClose={() => setOpen(false)}
          initial={editing}
          onSave={(a) => {
            upsert(a);
            setOpen(false);
            notification.success({ message: 'Address saved' });
          }}
        />
      )}
    </AccountShell>
  );
}

function AddressFormModal({
  open,
  onClose,
  initial,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  initial: Address;
  onSave: (a: Address) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: initial,
  });

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={initial.recipient ? 'Edit address' : 'Add address'}
      footer={null}
      destroyOnHidden
      afterClose={() => reset(initial)}
    >
      <form onSubmit={handleSubmit(onSave)} className="space-y-4 mt-4" noValidate>
        <input type="hidden" {...register('id')} />
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Label" error={errors.label?.message} required>
            <input
              {...register('label')}
              className="w-full px-3 py-2 border border-knitup-lighter rounded focus:outline-none focus:border-knitup-gray"
              placeholder="Home"
            />
          </FormField>
          <FormField label="Recipient" error={errors.recipient?.message} required>
            <input
              {...register('recipient')}
              className="w-full px-3 py-2 border border-knitup-lighter rounded focus:outline-none focus:border-knitup-gray"
            />
          </FormField>
        </div>
        <FormField label="Address line 1" error={errors.line1?.message} required>
          <input
            {...register('line1')}
            className="w-full px-3 py-2 border border-knitup-lighter rounded focus:outline-none focus:border-knitup-gray"
          />
        </FormField>
        <FormField label="Address line 2" error={errors.line2?.message}>
          <input
            {...register('line2')}
            className="w-full px-3 py-2 border border-knitup-lighter rounded focus:outline-none focus:border-knitup-gray"
          />
        </FormField>
        <div className="grid grid-cols-3 gap-3">
          <FormField label="City" error={errors.city?.message} required>
            <input
              {...register('city')}
              className="w-full px-3 py-2 border border-knitup-lighter rounded focus:outline-none focus:border-knitup-gray"
            />
          </FormField>
          <FormField label="State / Region" error={errors.region?.message} required>
            <input
              {...register('region')}
              className="w-full px-3 py-2 border border-knitup-lighter rounded focus:outline-none focus:border-knitup-gray"
            />
          </FormField>
          <FormField label="Postal" error={errors.postalCode?.message} required>
            <input
              {...register('postalCode')}
              className="w-full px-3 py-2 border border-knitup-lighter rounded focus:outline-none focus:border-knitup-gray"
            />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Country" error={errors.country?.message} required>
            <input
              {...register('country')}
              className="w-full px-3 py-2 border border-knitup-lighter rounded focus:outline-none focus:border-knitup-gray"
            />
          </FormField>
          <FormField label="Phone" error={errors.phone?.message} required>
            <input
              {...register('phone')}
              type="tel"
              className="w-full px-3 py-2 border border-knitup-lighter rounded focus:outline-none focus:border-knitup-gray"
            />
          </FormField>
        </div>
        <label className="flex items-center gap-2 text-sm text-knitup-text">
          <input type="checkbox" {...register('isDefault')} />
          Set as default address
        </label>
        <div className="flex justify-end gap-2 pt-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}
