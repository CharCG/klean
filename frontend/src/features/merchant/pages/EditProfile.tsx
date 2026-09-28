import { showErrorToast } from '@/shared/errors/notify-error';
import { merchantKeys } from '@/features/merchant/api/merchant.queries';
import { type FormEvent } from 'react';
import { useNavigate } from '@/shared/router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/features/merchant/api/merchant.api';
import { useToast } from '@/shared/stores/toast-store';
import { useAuth } from '@/features/auth/model/use-auth';
import TopBar from '@/shared/components/TopBar';
import Button from '@/shared/components/Button';
import PageSkeleton from '@/shared/components/PageSkeleton';
import { FieldLabel } from '@/shared/components/FormField';
import { fieldControlClassName } from '@/shared/components/form-field.styles';

export default function EditMerchantProfile() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: m, isLoading } = useQuery({ queryKey: merchantKeys.profile(), queryFn: api.getMerchantProfile });
  const mut = useMutation({ mutationFn: (d: Parameters<typeof api.updateMerchantProfile>[0]) => api.updateMerchantProfile(d), onSuccess: () => { qc.invalidateQueries({ queryKey: merchantKeys.profile() }); showToast('Saved', 'success'); navigate(-1); }, onError: showErrorToast });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); const f = new FormData(e.currentTarget); mut.mutate({ businessPhone: f.get('businessPhone') as string, address: f.get('address') as string, businessDescription: f.get('businessDescription') as string, openTime: f.get('openTime') as string, closeTime: f.get('closeTime') as string }); };

  if (isLoading) return <PageSkeleton />;
  return (
    <div className="flex flex-col h-full overflow-y-auto bg-bg">
      <TopBar title="Edit Business Profile" showBack />
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <section className="rounded-2xl p-5 bg-card border border-stroke">
          <h3 className="font-bold text-[15px] mb-4 pb-3 text-text border-b border-stroke">Business Information</h3>
          <div className="space-y-4">
            <div><FieldLabel htmlFor="merchant-owner">Owner Name</FieldLabel><input id="merchant-owner" defaultValue={user?.name} readOnly disabled className={fieldControlClassName} /></div>
            <div><FieldLabel htmlFor="merchant-name">Business Name</FieldLabel><input id="merchant-name" defaultValue={m?.name} readOnly disabled className={fieldControlClassName} /></div>
            <div><FieldLabel htmlFor="merchant-phone">Business Phone</FieldLabel><input id="merchant-phone" name="businessPhone" defaultValue={m?.businessPhone} placeholder={m?.businessPhone || 'Business phone number'} required className={fieldControlClassName} /></div>
            <div><FieldLabel htmlFor="merchant-email">Business Email</FieldLabel><input id="merchant-email" defaultValue={m?.businessEmail} readOnly disabled className={fieldControlClassName} /></div>
            <div><FieldLabel htmlFor="merchant-address">Address</FieldLabel><textarea id="merchant-address" name="address" defaultValue={m?.address} placeholder={m?.address || 'Business address'} required rows={2} className={`${fieldControlClassName} resize-none`} /></div>
            <div><FieldLabel htmlFor="merchant-description">Description</FieldLabel><textarea id="merchant-description" name="businessDescription" defaultValue={m?.businessDescription} placeholder={m?.businessDescription || 'Business description'} required rows={2} className={`${fieldControlClassName} resize-none`} /></div>
          </div>
        </section>
        <section className="rounded-2xl p-5 bg-card border border-stroke">
          <h3 className="font-bold text-[15px] mb-4 pb-3 text-text border-b border-stroke">Hours</h3>
          <div className="flex gap-4"><div className="min-w-0 flex-1"><FieldLabel htmlFor="merchant-open">Open</FieldLabel><input id="merchant-open" name="openTime" type="time" defaultValue={m?.openTime} placeholder={m?.openTime || ''} required className={fieldControlClassName} /></div><div className="min-w-0 flex-1"><FieldLabel htmlFor="merchant-close">Close</FieldLabel><input id="merchant-close" name="closeTime" type="time" defaultValue={m?.closeTime} placeholder={m?.closeTime || ''} required className={fieldControlClassName} /></div></div>
        </section>
        <Button type="submit" isLoading={mut.isPending} variant="primary" fullWidth>
          Save
        </Button>
      </form>
    </div>
  );
}
