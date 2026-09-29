'use client';

import { useState, useEffect } from 'react';
import { Building2, Plus, CheckCircle2, Phone, MapPin, Search, Pencil, Trash2, ShieldCheck, ShieldOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { AdminHeader } from '@/components/admin/admin-header';
import { BusinessModal } from '@/components/admin/business-modal';
import { DeleteConfirmModal } from '@/components/admin/delete-confirm-modal';
import { getBusinesses, createBusiness, updateBusiness, deleteBusiness } from '@/lib/services/promotions';
import { Business } from '@/types/admin';
import { toast } from 'sonner';

export default function AdminBusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBiz, setSelectedBiz] = useState<Business | null>(null);
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [bizToDelete, setBizToDelete] = useState<Business | null>(null);

  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    setLoading(true);
    try {
      const data = await getBusinesses();
      setBusinesses(data);
    } catch {
      toast.error('Error al cargar la lista de negocios');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBusiness = async (bizData: Partial<Business>) => {
    if (selectedBiz) {
      const updated = await updateBusiness(selectedBiz.id, bizData);
      setBusinesses((prev) => prev.map((b) => (b.id === selectedBiz.id ? { ...b, ...updated } : b)));
    } else {
      const created = await createBusiness(bizData as any);
      setBusinesses((prev) => [created, ...prev]);
    }
  };

  const handleConfirmDelete = async () => {
    if (bizToDelete) {
      await deleteBusiness(bizToDelete.id);
      setBusinesses((prev) => prev.filter((b) => b.id !== bizToDelete.id));
      toast.success('Negocio eliminado correctamente');
    }
  };

  const handleToggleVerify = async (biz: Business) => {
    const updated = await updateBusiness(biz.id, { is_verified: !biz.is_verified });
    setBusinesses((prev) => prev.map((b) => (b.id === biz.id ? { ...b, ...updated } : b)));
    toast.info(`Estado de verificación cambiado para ${biz.name}`);
  };

  const filtered = businesses.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    (b.address && b.address.toLowerCase().includes(search.toLowerCase())) ||
    (b.city_name && b.city_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex-1 space-y-6 pb-12">
      <AdminHeader
        title="Gestión de Negocios Afiliados"
        subtitle="Administra los comercios, datos de contacto y verificación de empresas"
        onNewPromotion={() => {
          setSelectedBiz(null);
          setIsModalOpen(true);
        }}
      />

      <div className="px-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar negocio por nombre o ciudad..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 rounded-xl text-xs bg-card border-border/60"
            />
          </div>

          <Button
            onClick={() => {
              setSelectedBiz(null);
              setIsModalOpen(true);
            }}
            className="w-full sm:w-auto rounded-xl text-xs h-10 bg-primary text-white font-semibold flex items-center justify-center gap-1.5"
          >
            <Plus className="h-4 w-4" /> Registrar Negocio
          </Button>
        </div>

        {filtered.length === 0 ? (
          <Card className="rounded-2xl border-border/60 p-12 text-center text-muted-foreground text-xs">
            No se encontraron negocios afiliados. ¡Haz clic en "Registrar Negocio" para agregar uno!
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((biz) => (
              <Card key={biz.id} className="rounded-2xl border-border/60 bg-card p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-primary/20 to-purple-600/20 flex items-center justify-center text-primary font-bold text-lg border border-primary/20 shrink-0 shadow-inner">
                        {biz.name.charAt(0)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5 truncate">
                          {biz.name}
                        </h3>
                        <span className="text-xs text-muted-foreground truncate">/{biz.slug}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleVerify(biz)}
                      title={biz.is_verified ? "Negocio verificado (Clic para cambiar)" : "Negocio no verificado (Clic para verificar)"}
                      className={`p-1.5 rounded-xl border transition-colors ${
                        biz.is_verified
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20'
                          : 'bg-muted text-muted-foreground border-border/50 hover:bg-muted/80'
                      }`}
                    >
                      {biz.is_verified ? <ShieldCheck className="h-4 w-4" /> : <ShieldOff className="h-4 w-4" />}
                    </button>
                  </div>

                  {biz.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                      {biz.description}
                    </p>
                  )}

                  <div className="space-y-1 text-xs text-muted-foreground pt-2 border-t border-border/40">
                    {biz.address && (
                      <p className="flex items-center gap-1.5 text-[11px] truncate">
                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" /> {biz.address}
                      </p>
                    )}
                    {biz.phone && (
                      <p className="flex items-center gap-1.5 text-[11px]">
                        <Phone className="h-3.5 w-3.5 text-primary shrink-0" /> {biz.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/40">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                    {biz.city_name || 'La Paz'}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedBiz(biz);
                        setIsModalOpen(true);
                      }}
                      className="h-8 text-xs gap-1 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Editar
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setBizToDelete(biz);
                        setIsDeleteOpen(true);
                      }}
                      className="h-8 text-xs gap-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Eliminar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Business Modal Form */}
      <BusinessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBusiness}
        business={selectedBiz}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title={`¿Eliminar ${bizToDelete?.name}?`}
        description="Esta acción eliminará la empresa y sus datos del sistema."
      />
    </div>
  );
}
