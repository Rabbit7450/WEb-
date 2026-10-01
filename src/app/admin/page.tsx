'use client';

import { useState, useEffect } from 'react';
import { 
  Tag, 
  Eye, 
  Building2, 
  TrendingUp, 
  Sparkles, 
  Clock, 
  Pencil, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  Users,
  DollarSign,
  Plus,
  ShieldCheck,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdminHeader } from '@/components/admin/admin-header';
import { PromotionModal } from '@/components/admin/promotion-modal';
import { BusinessModal } from '@/components/admin/business-modal';
import { DeleteConfirmModal } from '@/components/admin/delete-confirm-modal';
import { useAuth } from '@/lib/auth/auth-context';
import { 
  getPromotions, 
  createPromotion, 
  updatePromotion, 
  deletePromotion, 
  getBusinesses, 
  createBusiness,
  getCategories,
  getAdsConfig
} from '@/lib/services/promotions';
import { Promotion, Business, Category, GoogleAdsConfig } from '@/types/admin';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
  const { role, user } = useAuth();
  
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [adsConfig, setAdsConfig] = useState<GoogleAdsConfig | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);

  const [isBizModalOpen, setIsBizModalOpen] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [promoToDelete, setPromoToDelete] = useState<Promotion | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [promosData, bizData, catData, adsData] = await Promise.all([
        getPromotions(),
        getBusinesses(),
        getCategories(),
        getAdsConfig(),
      ]);
      setPromotions(promosData);
      setBusinesses(bizData);
      setCategories(catData);
      setAdsConfig(adsData);
    } catch (err) {
      toast.error('Error al cargar datos del panel');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePromotion = async (promoData: Partial<Promotion>) => {
    if (selectedPromo) {
      const updated = await updatePromotion(selectedPromo.id, promoData);
      setPromotions((prev) => prev.map((p) => (p.id === selectedPromo.id ? { ...p, ...updated } : p)));
      toast.success('Promoción actualizada con éxito');
    } else {
      const created = await createPromotion(promoData as any);
      setPromotions((prev) => [created, ...prev]);
      toast.success('Nueva promoción publicada con éxito');
    }
  };

  const handleSaveBusiness = async (bizData: Partial<Business>) => {
    const created = await createBusiness(bizData as any);
    setBusinesses((prev) => [created, ...prev]);
    toast.success('Nuevo negocio registrado exitosamente');
  };

  const handleConfirmDelete = async () => {
    if (promoToDelete) {
      await deletePromotion(promoToDelete.id);
      setPromotions((prev) => prev.filter((p) => p.id !== promoToDelete.id));
      toast.success('Promoción eliminada correctamente');
    }
  };

  const handleStatusChange = async (promo: Promotion, newStatus: 'published' | 'rejected' | 'draft') => {
    const updated = await updatePromotion(promo.id, { status: newStatus });
    setPromotions((prev) => prev.map((p) => (p.id === promo.id ? { ...p, ...updated } : p)));
    toast.success(`Estado cambiado a: ${newStatus === 'published' ? 'Publicada' : newStatus === 'rejected' ? 'Rechazada' : 'Borrador'}`);
  };

  // KPIs
  const totalPromotions = promotions.length;
  const activePromotions = promotions.filter((p) => p.status === 'published').length;
  const pendingPromotions = promotions.filter((p) => p.status === 'pending').length;
  const totalViews = promotions.reduce((acc, p) => acc + (p.views_count || 0), 0);
  const totalBusinesses = businesses.length;

  return (
    <div className="flex-1 space-y-6 pb-12">
      {/* Top Header */}
      <AdminHeader
        title={role === 'admin' ? 'Panel de Control General' : 'Panel de Gestión Comercial'}
        subtitle={
          role === 'admin'
            ? 'Resumen global de ofertas, comercios afiliados, usuarios y monetización de publicidad'
            : 'Administra tus ofertas publicadas y consulta las métricas de tu negocio'
        }
        onNewPromotion={() => {
          setSelectedPromo(null);
          setIsPromoModalOpen(true);
        }}
      />

      <div className="px-3 sm:px-6 space-y-6">
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="rounded-2xl border-border/50 shadow-sm bg-gradient-to-br from-card to-primary/5 hover:border-primary/30 transition-all">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Promociones Activas</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black tracking-tight">{activePromotions}</span>
                  {pendingPromotions > 0 && (
                    <span className="text-xs text-amber-500 font-bold flex items-center">
                      ({pendingPromotions} pendientes)
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">de {totalPromotions} promociones registradas</p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <Tag className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/50 shadow-sm bg-gradient-to-br from-card to-purple-500/5 hover:border-purple-500/30 transition-all">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Vistas Totales</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black tracking-tight">{totalViews.toLocaleString()}</span>
                  <span className="text-xs text-emerald-500 font-bold flex items-center">
                    <TrendingUp className="h-3 w-3 mr-0.5" /> +24%
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">interacciones en la plataforma</p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600 shadow-inner">
                <Eye className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/50 shadow-sm bg-gradient-to-br from-card to-blue-500/5 hover:border-blue-500/30 transition-all">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {role === 'admin' ? 'Negocios Afiliados' : 'Mi Comercio'}
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black tracking-tight">{totalBusinesses}</span>
                  <span className="text-xs text-emerald-500 font-bold flex items-center">
                    Verificados
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">marcas activas en Bolivia</p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 shadow-inner">
                <Building2 className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-amber-500/30 shadow-sm bg-gradient-to-br from-card to-amber-500/10 hover:border-amber-500/40 transition-all">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wider">Google Ads Revenue</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black tracking-tight">Bs. {adsConfig?.estimated_revenue.toLocaleString() || '1,450'}</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {adsConfig?.enabled ? 'Publicidad Activa' : 'Publicidad Pausada'}
                </p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-600 shadow-inner">
                <DollarSign className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Bar */}
        <Card className="rounded-2xl border-border/50 bg-card p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                Acciones Rápidas del Panel <Sparkles className="h-4 w-4 text-primary" />
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Formularios activos para agregar ofertas y gestionar registros comercialmente
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                onClick={() => {
                  setSelectedPromo(null);
                  setIsPromoModalOpen(true);
                }}
                size="sm"
                className="rounded-xl text-xs font-semibold bg-primary hover:bg-primary/90 text-white flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Crear Oferta
              </Button>

              {role === 'admin' && (
                <Button
                  onClick={() => setIsBizModalOpen(true)}
                  size="sm"
                  variant="outline"
                  className="rounded-xl text-xs font-semibold border-border/60 flex items-center gap-1"
                >
                  <Building2 className="h-4 w-4 text-primary" /> Registrar Negocio
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Recent Promotions Table */}
        <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden bg-card">
          <CardHeader className="p-5 border-b border-border/40 bg-muted/20 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground">Gestión de Promociones</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Lista de ofertas en el sistema con botones de edición, aprobación y eliminación
              </CardDescription>
            </div>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 text-muted-foreground border-b border-border/40 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Promoción</th>
                  <th className="py-3 px-4">Negocio / Categoría</th>
                  <th className="py-3 px-4">Descuento</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4">Vistas</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {promotions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground text-xs">
                      No hay promociones registradas. Haz clic en "Crear Oferta" para agregar la primera.
                    </td>
                  </tr>
                ) : (
                  promotions.map((promo) => (
                    <tr key={promo.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {promo.image_url ? (
                            <img
                              src={promo.image_url}
                              alt={promo.title}
                              className="h-10 w-14 rounded-lg object-cover border border-border/50 shadow-sm"
                            />
                          ) : (
                            <div className="h-10 w-14 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                              Yaps
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                              {promo.title}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              Hasta: {promo.end_date || 'Sin límite'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{promo.business_name}</span>
                          <span className="text-[10px] text-muted-foreground">{promo.category_name}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          -{promo.discount_percentage}%
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {promo.status === 'published' && (
                          <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/20 border-emerald-500/30 text-[10px] gap-1">
                            <CheckCircle className="h-3 w-3" /> Publicada
                          </Badge>
                        )}
                        {promo.status === 'pending' && (
                          <Badge variant="outline" className="bg-amber-500/15 text-amber-700 hover:bg-amber-500/20 border-amber-500/30 text-[10px] gap-1">
                            <Clock className="h-3 w-3" /> Pendiente
                          </Badge>
                        )}
                        {promo.status === 'draft' && (
                          <Badge variant="outline" className="bg-slate-500/15 text-slate-700 hover:bg-slate-500/20 border-slate-500/30 text-[10px] gap-1">
                            <Clock className="h-3 w-3" /> Borrador
                          </Badge>
                        )}
                        {promo.status === 'rejected' && (
                          <Badge variant="destructive" className="text-[10px] gap-1">
                            <AlertCircle className="h-3 w-3" /> Rechazada
                          </Badge>
                        )}
                        {promo.status === 'sold_out' && (
                          <Badge variant="outline" className="bg-orange-500/15 text-orange-700 border-orange-500/30 text-[10px] gap-1">
                            <AlertCircle className="h-3 w-3" /> Agotada
                          </Badge>
                        )}
                      </td>

                      <td className="py-3 px-4 font-medium text-muted-foreground">
                        {promo.views_count || 0}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Admin status toggle buttons */}
                          {role === 'admin' && promo.status !== 'published' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleStatusChange(promo, 'published')}
                              className="h-8 w-8 text-emerald-600 hover:bg-emerald-500/10 rounded-lg"
                              title="Aprobar y publicar"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedPromo(promo);
                              setIsPromoModalOpen(true);
                            }}
                            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg"
                            title="Editar promoción"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setPromoToDelete(promo);
                              setIsDeleteOpen(true);
                            }}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                            title="Eliminar promoción"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Promotion Modal Form */}
      <PromotionModal
        isOpen={isPromoModalOpen}
        onClose={() => setIsPromoModalOpen(false)}
        onSave={handleSavePromotion}
        promotion={selectedPromo}
        businesses={businesses}
        categories={categories}
      />

      {/* Business Modal Form */}
      <BusinessModal
        isOpen={isBizModalOpen}
        onClose={() => setIsBizModalOpen(false)}
        onSave={handleSaveBusiness}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title={`¿Eliminar ${promoToDelete?.title}?`}
        description="Esta promoción será borrada permanentemente."
      />
    </div>
  );
}
