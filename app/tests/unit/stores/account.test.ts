import { describe, it, expect, beforeEach } from 'vitest';
import { useAccountStore } from '@/store/account';
import type { Address } from '@/types/account';

const addr = (id: string, isDefault = false): Address => ({
  id,
  label: 'Home',
  recipient: 'Jane Doe',
  line1: '1 Knit Lane',
  city: 'Sydney',
  region: 'NSW',
  postalCode: '2000',
  country: 'AU',
  phone: '+61400000000',
  isDefault,
});

describe('useAccountStore', () => {
  beforeEach(() => {
    useAccountStore.setState({
      profile: { fullName: '', email: '', phone: '', brandName: '' },
      addresses: [],
      orders: [],
      store: null,
    });
  });

  it('setProfile patches fields', () => {
    useAccountStore.getState().setProfile({ fullName: 'Jane', email: 'j@x.com' });
    expect(useAccountStore.getState().profile.fullName).toBe('Jane');
    expect(useAccountStore.getState().profile.email).toBe('j@x.com');
  });

  it('upsertAddress adds and updates addresses', () => {
    useAccountStore.getState().upsertAddress(addr('a1'));
    useAccountStore.getState().upsertAddress(addr('a2'));
    expect(useAccountStore.getState().addresses).toHaveLength(2);

    useAccountStore.getState().upsertAddress({ ...addr('a1'), label: 'Studio' });
    const a1 = useAccountStore.getState().addresses.find((a) => a.id === 'a1');
    expect(a1?.label).toBe('Studio');
    expect(useAccountStore.getState().addresses).toHaveLength(2);
  });

  it('upsertAddress with isDefault=true unsets other defaults', () => {
    useAccountStore.getState().upsertAddress(addr('a1', true));
    useAccountStore.getState().upsertAddress(addr('a2', true));
    const defs = useAccountStore.getState().addresses.filter((a) => a.isDefault);
    expect(defs).toHaveLength(1);
    expect(defs[0].id).toBe('a2');
  });

  it('setDefaultAddress sets only one default', () => {
    useAccountStore.getState().upsertAddress(addr('a1', true));
    useAccountStore.getState().upsertAddress(addr('a2'));
    useAccountStore.getState().setDefaultAddress('a2');
    const defs = useAccountStore.getState().addresses.filter((a) => a.isDefault);
    expect(defs).toHaveLength(1);
    expect(defs[0].id).toBe('a2');
  });

  it('connectStore + disconnectStore manage store state', () => {
    useAccountStore.getState().connectStore({
      provider: 'shopify',
      storeUrl: 's.myshopify.com',
      connectedAt: new Date().toISOString(),
      productCount: 0,
    });
    expect(useAccountStore.getState().store?.storeUrl).toBe('s.myshopify.com');
    useAccountStore.getState().disconnectStore();
    expect(useAccountStore.getState().store).toBeNull();
  });
});
