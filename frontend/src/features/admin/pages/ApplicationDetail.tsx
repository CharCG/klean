import { showErrorToast } from '@/shared/errors/notify-error';
import { applicationKeys } from '@/features/application/api/application.api';
import { useParams } from '@/shared/router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileText } from '@/shared/icons';
import * as api from '@/features/application/api/application.api';
import TopBar from '@/shared/components/TopBar';
import PageSkeleton from '@/shared/components/PageSkeleton';
import ErrorState from '@/shared/components/ErrorState';
import { useToast } from '@/shared/stores/toast-store';
import Button from '@/shared/components/Button';
import type { ReactNode } from 'react';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl p-5" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-stroke)' }}>
      <h3 className="font-semibold text-sm mb-4 pb-2" style={{ color: 'var(--color-text)', borderBottom: '1px solid var(--color-stroke)' }}>{title}</h3>
      <div className="space-y-2 text-sm font-medium">{children}</div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return <p><span style={{ color: 'var(--color-text-secondary)' }}>{label}</span><br /><span style={{ color: 'var(--color-text)' }}>{value}</span></p>;
}

export default function AdminApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const qc = useQueryClient();

  const { data: app, isLoading, isError, refetch } = useQuery({ queryKey: applicationKeys.detail(id), queryFn: () => api.getApplicationById(id!), enabled: !!id });
  const mut = useMutation({ mutationFn: (s: 'ACCEPTED' | 'REJECTED') => api.decideApplication(id!, s), onSuccess: (_, s) => { qc.invalidateQueries({ queryKey: applicationKeys.list }); qc.invalidateQueries({ queryKey: applicationKeys.detail(id) }); showToast(`Application ${s.toLowerCase()}`, 'success'); }, onError: showErrorToast });

  if (isLoading) return <PageSkeleton />;
  if (isError || !app) return <ErrorState onRetry={refetch} />;

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ backgroundColor: 'var(--color-bg)' }}>
      <TopBar title="Application Details" showBack />
      <div className="p-6 space-y-5">
        <Section title="Business Information">
          <Field label="Owner Name" value={app.businessOwner} />
          <Field label="Business Name" value={app.businessName} />
          <Field label="Phone" value={app.businessPhone} />
          <Field label="Email" value={app.businessEmail} />
          <Field label="Address" value={app.businessAddress} />
          <Field label="Description" value={app.businessDescription} />
        </Section>
        <Section title="Operating Hours"><Field label="Open" value={app.openTime} /><Field label="Close" value={app.closeTime} /></Section>
        <Section title="Payment Details"><Field label="Bank" value={app.bankType} /><Field label="Account" value={app.bankAccount} /><Field label="Holder" value={app.bankHolder} /></Section>
        <Section title="Documents">
          <a
            href={app.documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg transition-opacity hover:opacity-80"
            style={{ backgroundColor: 'var(--color-primary-light)', border: '1px solid var(--color-primary-light)', color: 'var(--color-primary)' }}
          >
            <FileText size={18} />
            View Document Proposal
          </a>
        </Section>
        {app.status === 'PENDING' && (
          <div className="flex gap-3">
            <Button onClick={() => mut.mutate('REJECTED')} isLoading={mut.isPending} variant="danger" className="flex-1">Reject</Button>
            <Button onClick={() => mut.mutate('ACCEPTED')} isLoading={mut.isPending} variant="success" className="flex-1">Approve</Button>
          </div>
        )}
      </div>
    </div>
  );
}
