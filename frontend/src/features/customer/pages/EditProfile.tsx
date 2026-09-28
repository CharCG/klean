import { showErrorToast } from '@/shared/errors/notify-error';
import { type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@/shared/router';
import * as api from '@/features/user/api/user.api';
import { useAuth } from '@/features/auth/model/use-auth';
import { useToast } from '@/shared/stores/toast-store';
import TopBar from '@/shared/components/TopBar';
import Button from '@/shared/components/Button';
import { FieldLabel } from '@/shared/components/FormField';
import { fieldControlClassName } from '@/shared/components/form-field.styles';
import { cn } from '@/shared/utils/cn';

export default function EditProfile() {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const profileMut = useMutation({ mutationFn: (d: { name: string; phone: string; address: string }) => api.updateProfile(d), onSuccess: (d) => { updateUser({ name: d.name }); showToast('Profile updated', 'success'); navigate(-1); }, onError: showErrorToast });
  const passMut = useMutation({ mutationFn: (d: { oldPassword: string; newPassword: string }) => api.changePassword(d), onSuccess: () => { showToast('Password changed', 'success'); navigate(-1); }, onError: showErrorToast });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const old = f.get('oldPassword') as string; const np = f.get('newPassword') as string; const cp = f.get('confirmPassword') as string;
    if (old || np || cp) { if (np !== cp) { showToast('Passwords do not match', 'error'); return; } passMut.mutate({ oldPassword: old, newPassword: np }); }
    profileMut.mutate({ name: f.get('name') as string, phone: f.get('phone') as string, address: f.get('address') as string });
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-bg">
      <TopBar title="Edit Profile" showBack />
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <section className="rounded-2xl p-5 bg-card border border-stroke">
          <h3 className="font-bold text-[15px] mb-4 pb-3 text-text border-b border-stroke">Personal Information</h3>
          <div className="space-y-4">
            {[
              {n:'name',l:'Full Name',v:user?.name,ph:user?.name || 'Your full name'},
              {n:'email',l:'Email',v:user?.email,dis:true,ph:user?.email || ''},
              {n:'phone',l:'Phone',v:'',ph:user?.phone || 'Your phone number'},
              {n:'address',l:'Address',v:'',ph:user?.address || 'Your delivery address'},
            ].map(f=>(
              <div key={f.n}>
                <FieldLabel htmlFor={`profile-${f.n}`}>{f.l}</FieldLabel>
                <input id={`profile-${f.n}`} name={f.n} defaultValue={f.v||''} placeholder={f.ph} readOnly={f.dis} disabled={f.dis} required={!f.dis} className={fieldControlClassName} />
              </div>
            ))}
          </div>
        </section>
        
        <section className="rounded-2xl p-5 bg-card border border-stroke">
          <h3 className="font-bold text-[15px] mb-4 pb-3 text-text border-b border-stroke">Change Password</h3>
          <div className="space-y-4">
            {['oldPassword','newPassword','confirmPassword'].map(n=>(
              <div key={n}>
                <FieldLabel htmlFor={`profile-${n}`}>{n.replace(/([A-Z])/g,' $1').replace(/^./,s=>s.toUpperCase())}</FieldLabel>
                <input id={`profile-${n}`} name={n} type="password" className={cn(fieldControlClassName, 'text-base')} />
              </div>
            ))}
          </div>
        </section>
        
        <Button type="submit" isLoading={profileMut.isPending || passMut.isPending} variant="primary" fullWidth>
          Save
        </Button>
      </form>
    </div>
  );
}
