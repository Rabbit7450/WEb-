'use client';

import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Promotion, Business, Category } from '@/types/admin';
import { Image as ImageIcon, Sparkles, Upload, Percent, Calendar, Tag, Building2 } from 'lucide-react';
import { toast } from 'sonner';

interface PromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (promo: Partial<Promotion>) => Promise<void>;
  promotion?: Promotion | null;
  businesses: Business[];
  categories: Category[];
}

const PRESET_IMAGES = [
  { label: 'Combo Gastronomía', url: '/promos/food.png' },
  { label: 'Tecnología Gadgets', url: '/promos/tech.png' },
  { label: 'Entretenimiento', url: 'https://images.unsplash.com/photo-1538510114876-435785b30831?w=800&q=80' },
  { label: 'Moda y Ropa', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80' }
];

export function PromotionModal({
  isOpen,
  onClose,
  onSave,
  promotion,
  businesses,
  categories,
}: PromotionModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Promotion>>({
    title: '',
    description: '',
    discount_percentage: 20,
    original_price: 100,
    offer_price: 80,
    image_url: '/promos/food.png',
    status: 'published',
    business_id: businesses[0]?.id || 'b1',
    category_id: categories[0]?.id || 'c1',
    city_name: 'La Paz',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    coupon_code: '',
  });

  useEffect(() => {
    if (promotion) {
      setFormData(promotion);
    } else {
      setFormData({
        title: '',
        description: '',
        discount_percentage: 25,
        original_price: 200,
        offer_price: 150,
        image_url: '/promos/food.png',
        status: 'published',
        business_id: businesses[0]?.id || 'b1',
        category_id: categories[0]?.id || 'c1',
        city_name: 'La Paz',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        coupon_code: 'YAPS' + Math.floor(100 + Math.random() * 900),
      });
    }
  }, [promotion, businesses, categories, isOpen]);

  // Recalcular el precio en oferta automáticamente si cambia descuento u original
  const handleDiscountChange = (percentage: number) => {
    const orig = formData.original_price || 0;
    const offer = orig - (orig * (percentage / 100));
    setFormData((prev) => ({
      ...prev,
      discount_percentage: percentage,
      offer_price: Math.round(offer * 100) / 100,
    }));
  };

  const handleOriginalPriceChange = (orig: number) => {
    const disc = formData.discount_percentage || 0;
    const offer = orig - (orig * (disc / 100));
    setFormData((prev) => ({
      ...prev,
      original_price: orig,
      offer_price: Math.round(offer * 100) / 100,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      toast.error('Por favor ingresa un título para la promoción');
      return;
    }

    const selectedBiz = businesses.find(b => b.id === formData.business_id);
    const selectedCat = categories.find(c => c.id === formData.category_id);

    const payload: Partial<Promotion> = {
      ...formData,
      business_name: selectedBiz?.name || 'Negocio',
      category_name: selectedCat?.name || 'General',
    };

    setLoading(true);
    try {
      await onSave(payload);
      toast.success(promotion ? 'Promoción actualizada con éxito' : 'Promoción creada con éxito');
      onClose();
    } catch (err) {
      toast.error('Error al guardar la promoción');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 border-border/60 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
            <Sparkles className="h-5 w-5 text-primary" />
            {promotion ? 'Editar Promoción' : 'Nueva Promoción'}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Completa la información detallada para publicar la oferta en la plataforma.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          {/* Título de la promoción */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs font-semibold">
              Título de la Promoción <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Ej: 50% OFF en Burger Combos Gourmet"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="rounded-xl text-sm"
              required
            />
          </div>

          {/* Descripción */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-semibold">
              Descripción Detallada
            </Label>
            <Textarea
              id="description"
              placeholder="Explica qué incluye la promoción, términos y condiciones..."
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="rounded-xl text-sm min-h-[90px]"
            />
          </div>

          {/* Negocio y Categoría (2 columnas) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" /> Negocio Emisor
              </Label>
              <Select
                value={formData.business_id || undefined}
                onValueChange={(val) => setFormData({ ...formData, business_id: val || undefined })}
              >
                <SelectTrigger className="rounded-xl text-xs">
                  <SelectValue placeholder="Selecciona un negocio" />
                </SelectTrigger>
                <SelectContent>
                  {businesses.map((biz) => (
                    <SelectItem key={biz.id} value={biz.id} className="text-xs">
                      {biz.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1">
                <Tag className="h-3.5 w-3.5 text-muted-foreground" /> Categoría
              </Label>
              <Select
                value={formData.category_id || undefined}
                onValueChange={(val) => setFormData({ ...formData, category_id: val || undefined })}
              >
                <SelectTrigger className="rounded-xl text-xs">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id} className="text-xs">
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Descuentos y Precios (3 columnas) */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-muted/30 rounded-xl border border-border/40">
            <div className="space-y-1">
              <Label htmlFor="discount" className="text-[11px] font-semibold text-muted-foreground">
                Descuento (%)
              </Label>
              <div className="relative">
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount_percentage || 0}
                  onChange={(e) => handleDiscountChange(Number(e.target.value))}
                  className="rounded-lg h-9 text-xs pl-7 font-bold text-primary"
                />
                <Percent className="absolute left-2 top-2.5 h-3.5 w-3.5 text-primary" />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="orig_price" className="text-[11px] font-semibold text-muted-foreground">
                Precio Original (Bs.)
              </Label>
              <Input
                id="orig_price"
                type="number"
                min="0"
                value={formData.original_price || 0}
                onChange={(e) => handleOriginalPriceChange(Number(e.target.value))}
                className="rounded-lg h-9 text-xs font-medium"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="offer_price" className="text-[11px] font-semibold text-muted-foreground">
                Precio Oferta (Bs.)
              </Label>
              <Input
                id="offer_price"
                type="number"
                min="0"
                value={formData.offer_price || 0}
                onChange={(e) => setFormData({ ...formData, offer_price: Number(e.target.value) })}
                className="rounded-lg h-9 text-xs font-bold text-emerald-600 bg-emerald-500/10 border-emerald-500/30"
              />
            </div>
          </div>

          {/* Fechas y Estado */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="start_date" className="text-[11px] font-semibold text-muted-foreground">
                Fecha Inicio
              </Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date || ''}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="rounded-xl h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="end_date" className="text-[11px] font-semibold text-muted-foreground">
                Fecha Expiración
              </Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date || ''}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="rounded-xl h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-[11px] font-semibold text-muted-foreground">
                Estado Publicación
              </Label>
              <Select
                value={formData.status || 'published'}
                onValueChange={(val: any) => setFormData({ ...formData, status: val })}
              >
                <SelectTrigger className="rounded-xl h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published" className="text-xs text-emerald-600 font-semibold">Publicada</SelectItem>
                  <SelectItem value="draft" className="text-xs text-amber-600 font-semibold">Borrador</SelectItem>
                  <SelectItem value="pending" className="text-xs text-blue-600 font-semibold">En Revisión</SelectItem>
                  <SelectItem value="expired" className="text-xs text-rose-600 font-semibold">Expirada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Cupón opcional */}
          <div className="space-y-1.5">
            <Label htmlFor="coupon_code" className="text-xs font-semibold">
              Código de Cupón (Opcional)
            </Label>
            <Input
              id="coupon_code"
              placeholder="Ej: YAPS50"
              value={formData.coupon_code || ''}
              onChange={(e) => setFormData({ ...formData, coupon_code: e.target.value.toUpperCase() })}
              className="rounded-xl text-xs uppercase font-mono tracking-wider"
            />
          </div>

          {/* Imagen de la Promoción */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold flex items-center justify-between">
              <span>Imagen Promocional</span>
              <span className="text-[10px] text-muted-foreground">Presets o URL personalizada</span>
            </Label>

            {/* Presets rápido */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESET_IMAGES.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormData({ ...formData, image_url: item.url })}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border text-left transition-all ${
                    formData.image_url === item.url
                      ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                      : 'border-border/50 hover:bg-accent/40'
                  }`}
                >
                  <img src={item.url} alt={item.label} className="h-12 w-full object-cover rounded-lg" />
                  <span className="text-[10px] font-medium truncate w-full text-center">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Input URL directa */}
            <div className="flex gap-2">
              <Input
                placeholder="https://ejemplo.com/imagen.jpg"
                value={formData.image_url || ''}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="rounded-xl text-xs flex-1"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <DialogFooter className="pt-4 border-t border-border/40 gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl text-xs h-9">
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl text-xs h-9 bg-primary hover:bg-primary/90 text-white font-semibold"
            >
              {loading ? 'Guardando...' : promotion ? 'Guardar Cambios' : 'Publicar Promoción'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
