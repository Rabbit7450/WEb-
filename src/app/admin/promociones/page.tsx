'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Pencil, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Tag,
  Building2,
  Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AdminHeader } from '@/components/admin/admin-header';
import { PromotionModal } from '@/components/admin/promotion-modal';
import { 
  getPromotions, 
  createPromotion, 
  updatePromotion, 
  deletePromotion, 
  getBusinesses, 
  getCategories 
} from '@/lib/services/promotions';
import { Promotion, Business, Category } from '@/types/admin';
import { toast } from 'sonner';

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [p, b, c] = await Promise.all([
        getPromotions(),
        getBusinesses(),
        getCategories(),
      ]);
      setPromotions(p);
      setBusinesses(b);
      setCategories(c);
    } catch (err) {
      toast.error('Error al cargar promociones');
    }
  };

  const handleSave = async (data: Partial<Promotion>) => {
    if (selectedPromo) {
      await updatePromotion(selectedPromo.id, data);
    } else {
      await createPromotion(data as any);
    }
    await loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar esta promoción permanentemente?')) {
      await deletePromotion(id);
      setPromotions((prev) => prev.filter((item) => item.id !== id));
      toast.success('Promoción eliminada');
    }
  };

  const copyCoupon = (code?: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    toast.success(`Cupón ${code} copiado al portapapeles`);
  };

  // Filtered promotions logic
  const filteredPromotions = promotions.filter((promo) => {
    const matchesSearch =
      promo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (promo.business_name && promo.business_name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && promo.status === activeTab;
  });

  return (
    <div className="flex-1 space-y-6 pb-12">
      <AdminHeader
        title="Gestión de Promociones"
        subtitle="Crea, edita, publica o pausa promociones y cupones de descuento"
        onNewPromotion={() => {
          setSelectedPromo(null);
          setIsModalOpen(true);
        }}
      />

      <div className="px-6 space-y-6">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Tabs Filter */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList className="bg-muted/40 p-1 rounded-xl">
              <TabsTrigger value="all" className="rounded-lg text-xs font-semibold">Todas ({promotions.length})</TabsTrigger>
              <TabsTrigger value="published" className="rounded-lg text-xs font-semibold">Publicadas</TabsTrigger>
              <TabsTrigger value="draft" className="rounded-lg text-xs font-semibold">Borradores</TabsTrigger>
              <TabsTrigger value="expired" className="rounded-lg text-xs font-semibold">Expiradas</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título o negocio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 rounded-xl text-xs bg-card border-border/60"
            />
          </div>
        </div>

        {/* Promotions Grid List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPromotions.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-card rounded-2xl border border-border/50">
              <Tag className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold text-foreground">No se encontraron promociones</p>
              <p className="text-xs text-muted-foreground mt-1">Prueba a cambiar el filtro de búsqueda o agrega una nueva promo.</p>
            </div>
          ) : (
            filteredPromotions.map((promo) => (
              <Card key={promo.id} className="rounded-2xl border-border/60 bg-card overflow-hidden shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between">
                <div>
                  {/* Image & Badges Banner */}
                  <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                    {promo.image_url ? (
                      <img
                        src={promo.image_url}
                        alt={promo.title}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gradient-to-tr from-primary to-purple-600 text-white font-bold text-lg">
                        Yaps Promo
                      </div>
                    )}

                    {/* Discount Tag */}
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-primary to-purple-600 text-white px-3 py-1 rounded-full font-black text-xs shadow-lg">
                      -{promo.discount_percentage}% OFF
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      {promo.status === 'published' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-md">
                          Publicada
                        </span>
                      )}
                      {promo.status === 'draft' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-md">
                          Borrador
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-primary">
                      <Building2 className="h-3.5 w-3.5" />
                      <span>{promo.business_name}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{promo.category_name}</span>
                    </div>

                    <h3 className="font-bold text-sm text-foreground line-clamp-2 leading-snug">
                      {promo.title}
                    </h3>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {promo.description}
                    </p>

                    {/* Prices */}
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                        Bs. {promo.offer_price}
                      </span>
                      {promo.original_price && (
                        <span className="text-xs text-muted-foreground line-through">
                          Bs. {promo.original_price}
                        </span>
                      )}
                    </div>

                    {/* Coupon Code button */}
                    {promo.coupon_code && (
                      <button
                        onClick={() => copyCoupon(promo.coupon_code)}
                        className="w-full mt-2 py-1.5 px-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-bold flex items-center justify-between hover:bg-primary/20 transition-colors"
                      >
                        <span>CUPÓN: {promo.coupon_code}</span>
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 bg-muted/20 border-t border-border/40 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">
                    Expira: {promo.end_date || 'Sin fecha'}
                  </span>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedPromo(promo);
                        setIsModalOpen(true);
                      }}
                      className="h-8 text-xs rounded-xl gap-1 border-border/60"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Editar
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(promo.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive rounded-xl"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Modal Form */}
      <PromotionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        promotion={selectedPromo}
        businesses={businesses}
        categories={categories}
        onBusinessCreated={(newBiz) => {
          setBusinesses((prev) => [newBiz, ...prev.filter((b) => b.id !== newBiz.id)]);
        }}
      />
    </div>
  );
}
