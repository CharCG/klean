import { showErrorToast } from '@/shared/errors/notify-error';
import { serviceKeys } from '@/features/service/api/service.api';
import { useState, type FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from '@/shared/icons';
import Button from '@/shared/components/Button';
import * as api from '@/features/service/api/service.api';
import TopBar from '@/shared/components/TopBar';
import ServiceCard from '@/features/merchant/components/ServiceCard';
import SkeletonCard from '@/shared/components/SkeletonCard';
import EmptyState from '@/shared/components/EmptyState';
import { useToast } from '@/shared/stores/toast-store';
import type { Service, UnitType } from '@/features/service/model/service.schemas';
import { FieldLabel } from '@/shared/components/FormField';
import { fieldControlClassName } from '@/shared/components/form-field.styles';

export default function MerchantServices() {
  const { showToast } = useToast();
  const qc = useQueryClient();
  const [formVisible, setFormVisible] = useState(false);
  const [editItem, setEditItem] = useState<Service | null>(null);

  const { data: services, isLoading } = useQuery({ queryKey: serviceKeys.list, queryFn: api.getServices });

  const createMut = useMutation({ mutationFn: (d: Omit<Service, 'id' | 'isAvailable'>) => api.createService(d), onSuccess: () => { qc.invalidateQueries({ queryKey: serviceKeys.list }); setFormVisible(false); showToast('Service added', 'success'); }, onError: showErrorToast });
  const updateMut = useMutation({ mutationFn: ({ id, ...d }: Partial<Service> & { id: string }) => api.updateService(id, d), onSuccess: () => { qc.invalidateQueries({ queryKey: serviceKeys.list }); setFormVisible(false); setEditItem(null); showToast('Service updated', 'success'); }, onError: showErrorToast });
  const deleteMut = useMutation({ mutationFn: (id: string) => api.deleteService(id), onSuccess: () => { qc.invalidateQueries({ queryKey: serviceKeys.list }); showToast('Service deleted', 'success'); }, onError: showErrorToast });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); const f = new FormData(e.currentTarget);
    const d = { name: f.get('name') as string, price: parseInt(f.get('price') as string), unit: f.get('unit') as UnitType, description: f.get('description') as string };
    if (editItem) updateMut.mutate({ id: editItem.id, ...d }); else createMut.mutate(d);
  };

  if (formVisible) {
    return (
      <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--color-card)' }}>
        <TopBar title={editItem ? 'Edit Service' : 'Add Service'} showBack onBack={() => { setFormVisible(false); setEditItem(null); }} />
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div><FieldLabel htmlFor="service-name">Service Name</FieldLabel><input id="service-name" name="name" defaultValue={editItem?.name} required className={fieldControlClassName} /></div>
          <div><FieldLabel htmlFor="service-description">Description</FieldLabel><textarea id="service-description" name="description" defaultValue={editItem?.description} required rows={3} className={`${fieldControlClassName} resize-none`} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="min-w-0"><FieldLabel htmlFor="service-price">Price (Rp)</FieldLabel><input id="service-price" name="price" type="number" defaultValue={editItem?.price} required className={fieldControlClassName} /></div>
            <div className="min-w-0"><FieldLabel htmlFor="service-unit">Unit</FieldLabel><select id="service-unit" name="unit" defaultValue={editItem?.unit || 'KG'} className={fieldControlClassName}><option value="KG">Per kg</option><option value="PIECE">Per piece</option></select></div>
          </div>
          <Button type="submit" isLoading={createMut.isPending || updateMut.isPending} variant="secondary" fullWidth className="mt-4">
            Save
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full pb-24 overflow-y-auto relative" style={{ backgroundColor: 'var(--color-bg)' }}>
      <TopBar title="Services" />
      <div className="p-6 flex flex-col gap-4">
        {isLoading ? <><SkeletonCard /><SkeletonCard /></> : (services || []).length === 0 ? <EmptyState title="No services yet" description="Add your first service below." /> : (services || []).map((svc) => <ServiceCard key={svc.id} service={svc} onEdit={() => { setEditItem(svc); setFormVisible(true); }} onDelete={() => deleteMut.mutate(svc.id)} />)}
      </div>
      <div className="absolute bottom-24 right-6">
        <Button
          onClick={() => setFormVisible(true)}
          aria-label="Add Service"
          className="!h-14 !w-14 !rounded-full !p-0"
          variant="primary"
        >
          <Plus size={24} />
        </Button>
      </div>
    </div>
  );
}
