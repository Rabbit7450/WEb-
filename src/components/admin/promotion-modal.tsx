'use client';

import { useState, useEffect, useRef } from 'react';
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
import { 
  Image as ImageIcon, 
  Sparkles, 
  Upload, 
  Percent, 
  Calendar, 
  Tag, 
  Building2,
  Plus,
  ScanText,
  CheckCircle2,
  ExternalLink,
  Link as LinkIcon,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { createBusiness } from '@/lib/services/promotions';
import { scanImageWithOcr, parsePromoTextFromOcr } from '@/lib/utils/ocr-scanner';

interface PromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (promo: Partial<Promotion>) => Promise<void>;
  promotion?: Promotion | null;
  businesses: Business[];
  categories: Category[];
  onBusinessCreated?: (newBiz: Business) => void;
}

const PRESET_IMAGES = [
  { label: 'Arroz Caisy Grano de Oro 1kg', url: '/img/Promo/Arroz Caisy Grano de Oro 1 kg.png' },
  { label: 'Arroz Especial Caisy', url: '/img/Promo/Arroz Especial Caisy.png' },
  { label: 'Entradas 2D a 20 Bs', url: '/img/Promo/Entradas a 20 Bs en 2D en la Fiesta del Cine.png' },
  { label: 'Jueves 2 Salchipapas x 20Bs', url: '/img/Promo/Jueves de 2 Salchipapas por 20 Bs.png' },
  { label: 'Viernes 2 Pipocas de Pollo', url: '/img/Promo/Viernes de 2 Pipocas de Pollo.png' },
];

export function PromotionModal({
  isOpen,
  onClose,
  onSave,
  promotion,
  businesses,
  categories,
  onBusinessCreated,
}: PromotionModalProps) {
  const [loading, setLoading] = useState(false);
  const [localBusinesses, setLocalBusinesses] = useState<Business[]>(businesses);
  
  // OCR state
  const [ocrScanning, setOcrScanning] = useState(false);
  const [ocrStatus, setOcrStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Inline Quick Business Creation state
  const [showQuickBiz, setShowQuickBiz] = useState(false);
  const [quickBizName, setQuickBizName] = useState('');
  const [quickBizCity, setQuickBizCity] = useState('La Paz');
  const [quickBizLoading, setQuickBizLoading] = useState(false);

  const [formData, setFormData] = useState<Partial<Promotion>>({
    title: '',
    description: '',
    discount_percentage: 20,
    original_price: 100,
    offer_price: 80,
    image_url: PRESET_IMAGES[0].url,
    status: 'published',
    business_id: businesses[0]?.id || '',
    category_id: categories[0]?.id || '',
    city_name: 'La Paz',
    start_date: '',
    end_date: '',
    coupon_code: '',
  });

  useEffect(() => {
    setLocalBusinesses(businesses);
  }, [businesses]);

  useEffect(() => {
    if (promotion) {
      // Find matching business by id or name
      const matchedBiz = localBusinesses.find(
        (b) => b.id === promotion.business_id || (promotion.business_name && b.name === promotion.business_name)
      );

      setFormData({
        ...promotion,
        business_id: matchedBiz?.id || promotion.business_id || localBusinesses[0]?.id || '',
        business_name: matchedBiz?.name || promotion.business_name || localBusinesses[0]?.name || '',
      });
    } else {
      const defaultBiz = localBusinesses[0];
      const defaultCat = categories[0];
      setFormData({
        title: '',
        description: '',
        discount_percentage: 20,
        original_price: 100,
        offer_price: 80,
        image_url: PRESET_IMAGES[0].url,
        status: 'published',
        business_id: defaultBiz?.id || '',
        business_name: defaultBiz?.name || 'Comercio',
        category_id: defaultCat?.id || '',
        category_name: defaultCat?.name || 'General',
        city_name: defaultBiz?.city_name || 'La Paz',
        start_date: '',
        end_date: '',
        coupon_code: 'YAPS' + Math.floor(100 + Math.random() * 900),
      });
    }
  }, [promotion, isOpen, localBusinesses, categories]);

  // Recalcular el precio en oferta automáticamente si cambia descuento u original (admite decimales)
  const handleDiscountChange = (val: string | number) => {
    const disc = typeof val === 'number' ? val : parseFloat(val);
    const orig = typeof formData.original_price === 'number'
      ? formData.original_price
      : parseFloat(String(formData.original_price || 0));

    let offer = formData.offer_price;
    if (!isNaN(disc) && !isNaN(orig) && orig > 0) {
      offer = Math.round((orig - (orig * (disc / 100))) * 100) / 100;
    }

    setFormData((prev) => ({
      ...prev,
      discount_percentage: val as any,
      offer_price: offer,
    }));
  };

  const handleOriginalPriceChange = (val: string | number) => {
    const orig = typeof val === 'number' ? val : parseFloat(val);
    const disc = typeof formData.discount_percentage === 'number'
      ? formData.discount_percentage
      : parseFloat(String(formData.discount_percentage || 0));

    let offer = formData.offer_price;
    if (!isNaN(orig) && !isNaN(disc)) {
      offer = Math.round((orig - (orig * (disc / 100))) * 100) / 100;
    }

    setFormData((prev) => ({
      ...prev,
      original_price: val as any,
      offer_price: offer,
    }));
  };

  // Crear Negocio Rápido Inline
  const handleCreateQuickBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickBizName.trim()) {
      toast.error('Ingresa el nombre del negocio');
      return;
    }

    setQuickBizLoading(true);
    try {
      const newBiz = await createBusiness({
        name: quickBizName.trim(),
        slug: quickBizName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        city_name: quickBizCity,
        is_verified: true,
        description: `Negocio registrado para promociones`,
      });

      const updatedBusinesses = [newBiz, ...localBusinesses];
      setLocalBusinesses(updatedBusinesses);

      setFormData((prev) => ({
        ...prev,
        business_id: newBiz.id,
        business_name: newBiz.name,
        city_name: newBiz.city_name,
      }));

      if (onBusinessCreated) {
        onBusinessCreated(newBiz);
      }

      toast.success(`¡Negocio "${newBiz.name}" creado y seleccionado!`);
      setQuickBizName('');
      setShowQuickBiz(false);
    } catch (err) {
      toast.error('Error al crear el negocio');
    } finally {
      setQuickBizLoading(false);
    }
  };

  // Escaneo de Imagen mediante OCR
  const handleImageUploadAndOcr = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert file to object URL preview
    const imageUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, image_url: imageUrl }));

    setOcrScanning(true);
    setOcrStatus('Iniciando lectura OCR...');

    try {
      const parsedData = await scanImageWithOcr(file, (progress, status) => {
        setOcrStatus(status);
      });

      // Auto-populate form with detected parameters
      setFormData((prev) => {
        const nextState = { ...prev, image_url: imageUrl };
        if (parsedData.title) nextState.title = parsedData.title;
        if (parsedData.description) nextState.description = parsedData.description;
        if (parsedData.offer_price > 0) nextState.offer_price = parsedData.offer_price;
        if (parsedData.original_price > 0) nextState.original_price = parsedData.original_price;
        if (parsedData.discount_percentage > 0) nextState.discount_percentage = parsedData.discount_percentage;
        if (parsedData.business_id) {
          nextState.business_id = parsedData.business_id;
          nextState.business_name = parsedData.business_name;
        }
        return nextState;
      });

      toast.success('¡Imagen escaneada con éxito! Se han extraído título, precios y descripción.');
    } catch (err) {
      toast.error('No se pudo extraer texto automático de la imagen, ingresa los datos manualmente.');
    } finally {
      setOcrScanning(false);
      setOcrStatus('');
    }
  };

  const handleScanCurrentUrl = async (url: string) => {
    if (!url) return;
    setOcrScanning(true);
    setOcrStatus('Escaneando imagen...');

    try {
      const parsedData = await scanImageWithOcr(url, (progress, status) => {
        setOcrStatus(status);
      });

      setFormData((prev) => {
        const nextState = { ...prev };
        if (parsedData.title) nextState.title = parsedData.title;
        if (parsedData.description) nextState.description = parsedData.description;
        if (parsedData.offer_price > 0) nextState.offer_price = parsedData.offer_price;
        if (parsedData.original_price > 0) nextState.original_price = parsedData.original_price;
        if (parsedData.discount_percentage > 0) nextState.discount_percentage = parsedData.discount_percentage;
        return nextState;
      });

      toast.success('¡Promoción extraída del banner!');
    } catch (err) {
      toast.error('Error al analizar la imagen.');
    } finally {
      setOcrScanning(false);
      setOcrStatus('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      toast.error('Por favor ingresa un título para la promoción');
      return;
    }

    const selectedBiz = localBusinesses.find((b) => b.id === formData.business_id);
    const selectedCat = categories.find((c) => c.id === formData.category_id);

    const origNum = parseFloat(String(formData.original_price ?? 0)) || 0;
    const offerNum = parseFloat(String(formData.offer_price ?? 0)) || 0;
    const discNum = parseFloat(String(formData.discount_percentage ?? 0)) || 0;

    const payload: Partial<Promotion> = {
      ...formData,
      original_price: origNum,
      offer_price: offerNum,
      discount_percentage: discNum,
      business_id: formData.business_id || selectedBiz?.id || '',
      business_name: selectedBiz?.name || formData.business_name || 'Negocio',
      category_id: formData.category_id || selectedCat?.id || '',
      category_name: selectedCat?.name || formData.category_name || 'General',
    };

    setLoading(true);
    try {
      await onSave(payload);
      toast.success(promotion ? 'Promoción actualizada con éxito' : 'Promoción creada con éxito');
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar la promoción');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 border-border/60 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
            <Sparkles className="h-5 w-5 text-red-600" />
            {promotion ? 'Editar Promoción' : 'Nueva Promoción'}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Completa la información o sube la imagen de la oferta para extraer los datos automáticamente.
          </DialogDescription>
        </DialogHeader>

        {/* OCR Image Scanner Section */}
        <div className="p-3.5 bg-gradient-to-r from-amber-500/10 via-red-500/10 to-amber-500/5 border border-amber-500/30 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
              Escanear Imagen de Oferta (IA / OCR)
            </Label>
            {ocrScanning && (
              <span className="text-[11px] font-bold text-red-600 animate-pulse">
                {ocrStatus || 'Analizando...'}
              </span>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Sube el cartel o volante publicitario para autocompletar título, precios y descripción de la promoción.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleImageUploadAndOcr}
            />
            <Button
              type="button"
              variant="outline"
              disabled={ocrScanning}
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-bold rounded-xl h-9 gap-1.5 bg-amber-400 text-slate-950 hover:bg-amber-300 border-amber-500/50 shadow-sm"
            >
              <Upload className="h-3.5 w-3.5 text-red-600 fill-red-600" />
              {ocrScanning ? 'Escaneando...' : 'Subir Imagen y Escanear Texto'}
            </Button>

            {formData.image_url && (
              <Button
                type="button"
                variant="ghost"
                disabled={ocrScanning}
                onClick={() => handleScanCurrentUrl(formData.image_url!)}
                className="text-xs font-semibold h-9 gap-1 text-slate-700 dark:text-slate-300 hover:text-red-600"
              >
                <ScanText className="h-3.5 w-3.5 text-red-600" /> Escanear Imagen de Banner
              </Button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Título de la promoción */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs font-semibold">
              Título de la Promoción <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Ej: Arroz Caisy Grano de Oro 1 kg a solo 12 Bs"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="rounded-xl text-sm font-medium"
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
              className="rounded-xl text-xs min-h-[75px]"
            />
          </div>

          {/* Negocio y Categoría (2 columnas) con Opción Inline "Nuevo Negocio" */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Business Selector + Quick Add */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5 text-red-600" /> Negocio Emisor
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowQuickBiz(!showQuickBiz)}
                  className="h-6 text-[10px] px-2 rounded-lg gap-1 text-red-600 hover:bg-red-50 font-bold"
                >
                  <Plus className="h-3 w-3" /> {showQuickBiz ? 'Cancelar' : 'Nuevo Negocio'}
                </Button>
              </div>

              {/* Formulario Rápido de Negocio Inline */}
              {showQuickBiz ? (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 space-y-2.5">
                  <span className="text-[11px] font-bold text-slate-900 block">
                    Adicionar Nuevo Negocio
                  </span>
                  <Input
                    placeholder="Nombre del Negocio (ej: Copacabana)"
                    value={quickBizName}
                    onChange={(e) => setQuickBizName(e.target.value)}
                    className="h-8 text-xs bg-white rounded-lg"
                  />
                  <div className="flex gap-2">
                    <Select value={quickBizCity} onValueChange={(val) => setQuickBizCity(val || 'La Paz')}>
                      <SelectTrigger className="h-8 text-xs bg-white rounded-lg flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="La Paz">La Paz</SelectItem>
                        <SelectItem value="Santa Cruz">Santa Cruz</SelectItem>
                        <SelectItem value="Cochabamba">Cochabamba</SelectItem>
                        <SelectItem value="El Alto">El Alto</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      size="sm"
                      disabled={quickBizLoading}
                      onClick={handleCreateQuickBusiness}
                      className="h-8 text-xs bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg px-3"
                    >
                      {quickBizLoading ? 'Guardando...' : 'Guardar'}
                    </Button>
                  </div>
                </div>
              ) : (
                <Select
                  value={formData.business_id || ''}
                  onValueChange={(val) => {
                    const idStr = val || '';
                    const selectedBiz = localBusinesses.find((b) => b.id === idStr);
                    setFormData((prev) => ({
                      ...prev,
                      business_id: idStr,
                      business_name: selectedBiz?.name || prev.business_name,
                      city_name: selectedBiz?.city_name || prev.city_name,
                    }));
                  }}
                >
                  <SelectTrigger className="rounded-xl text-xs font-semibold">
                    <SelectValue placeholder="Selecciona un negocio">
                      {localBusinesses.find((b) => b.id === formData.business_id)?.name ||
                        formData.business_name ||
                        'Selecciona un negocio'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {localBusinesses.map((biz) => (
                      <SelectItem key={biz.id} value={biz.id} className="text-xs font-medium">
                        {biz.name} ({biz.city_name || 'Bolivia'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Category Selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1">
                <Tag className="h-3.5 w-3.5 text-amber-600" /> Categoría
              </Label>
              <Select
                value={formData.category_id || ''}
                onValueChange={(val) => {
                  const idStr = val || '';
                  const cat = categories.find((c) => c.id === idStr);
                  setFormData((prev) => ({
                    ...prev,
                    category_id: idStr,
                    category_name: cat?.name || prev.category_name,
                  }));
                }}
              >
                <SelectTrigger className="rounded-xl text-xs font-semibold">
                  <SelectValue placeholder="Selecciona una categoría">
                    {categories.find((c) => c.id === formData.category_id)?.name ||
                      formData.category_name ||
                      'Selecciona categoría'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id} className="text-xs font-medium">
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Descuentos y Precios en Bs (3 columnas) */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-amber-100/40 rounded-xl border border-amber-300">
            <div className="space-y-1">
              <Label htmlFor="discount" className="text-[11px] font-bold text-slate-700">
                Descuento (%)
              </Label>
              <div className="relative">
                <Input
                  id="discount"
                  type="number"
                  step="any"
                  min="0"
                  max="100"
                  value={formData.discount_percentage ?? ''}
                  onChange={(e) => handleDiscountChange(e.target.value)}
                  className="rounded-lg h-9 text-xs pl-7 font-bold text-red-600 bg-white"
                />
                <Percent className="absolute left-2 top-2.5 h-3.5 w-3.5 text-red-600" />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="orig_price" className="text-[11px] font-bold text-slate-700">
                Precio Original (Bs.)
              </Label>
              <Input
                id="orig_price"
                type="number"
                step="any"
                min="0"
                value={formData.original_price ?? ''}
                onChange={(e) => handleOriginalPriceChange(e.target.value)}
                className="rounded-lg h-9 text-xs font-semibold bg-white"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="offer_price" className="text-[11px] font-bold text-slate-700">
                Precio Oferta (Bs.)
              </Label>
              <Input
                id="offer_price"
                type="number"
                step="any"
                min="0"
                value={formData.offer_price ?? ''}
                onChange={(e) => setFormData({ ...formData, offer_price: e.target.value as any })}
                className="rounded-lg h-9 text-xs font-black text-emerald-700 bg-emerald-50 border-emerald-300"
              />
            </div>
          </div>

          {/* Fechas y Estado */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="start_date" className="text-[11px] font-semibold">
                Fecha Inicio (Opcional)
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
              <Label htmlFor="end_date" className="text-[11px] font-semibold">
                Fecha Expiración (Opcional)
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
              <Label className="text-[11px] font-semibold">
                Estado Publicación
              </Label>
              <Select
                value={formData.status || 'published'}
                onValueChange={(val) => setFormData({ ...formData, status: val as Promotion['status'] })}
              >
                <SelectTrigger className="rounded-xl h-9 text-xs font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published" className="text-xs text-emerald-600 font-semibold">Publicada</SelectItem>
                  <SelectItem value="draft" className="text-xs text-amber-600 font-semibold">Borrador</SelectItem>
                  <SelectItem value="pending" className="text-xs text-blue-600 font-semibold">En Revisión</SelectItem>
                  <SelectItem value="expired" className="text-xs text-rose-600 font-semibold">Expirada</SelectItem>
                  <SelectItem value="sold_out" className="text-xs text-orange-600 font-semibold">Agotada (sin stock)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Enlace y Cupón (2 columnas) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="link_url" className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ExternalLink className="h-3.5 w-3.5 text-red-600" /> Link / Enlace de la Oferta (URL)
              </Label>
              <Input
                id="link_url"
                type="url"
                placeholder="Ej: https://facebook.com/oferta o https://minegocio.bo"
                value={formData.link_url || ''}
                onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                className="rounded-xl text-xs font-medium bg-white"
              />
            </div>

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
          </div>

          {/* Carga y Selección de Imagen Promocional */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <Label className="text-xs font-bold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ImageIcon className="h-4 w-4 text-red-600" /> Imagen de la Promoción (Para la Web)
              </span>
              <span className="text-[10px] text-muted-foreground font-medium">Subir archivo o pegar Link</span>
            </Label>

            {/* 1. Botón de Subir Archivo + Input URL */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="file"
                id="promo-upload-file-input"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                      if (evt.target?.result) {
                        setFormData((prev) => ({ ...prev, image_url: evt.target!.result as string }));
                        toast.success('¡Imagen subida y lista para publicar!');
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('promo-upload-file-input')?.click()}
                className="rounded-xl text-xs font-bold h-9 gap-1.5 bg-white border-amber-400 text-slate-900 hover:bg-amber-100 flex-1 shadow-sm"
              >
                <Upload className="h-3.5 w-3.5 text-red-600" /> Subir Archivo de Imagen
              </Button>

              <Input
                placeholder="O pega el Link de la imagen (https://...)"
                value={formData.image_url || ''}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="rounded-xl text-xs flex-1 bg-white"
              />
            </div>

            {/* Vista Previa de la Imagen */}
            {formData.image_url && (
              <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-200">
                <img
                  src={formData.image_url}
                  alt="Vista Previa de la Oferta"
                  className="h-16 w-24 object-cover rounded-lg border border-slate-300 shadow-sm"
                />
                <div className="flex-1 overflow-hidden">
                  <span className="text-[10px] font-bold text-emerald-600 block flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Imagen asignada correctamente para la web
                  </span>
                  <span className="text-[10px] text-slate-500 truncate block font-mono mt-0.5">{formData.image_url}</span>
                </div>
              </div>
            )}

            {/* Presets oficiales de Bolivia */}
            <div className="space-y-1 pt-1">
              <span className="text-[10px] font-bold text-slate-600 block">O elige uno de los Banners Oficiales:</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRESET_IMAGES.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, image_url: item.url })}
                    className={`flex flex-col items-center gap-1 p-1.5 rounded-xl border text-left transition-all ${
                      formData.image_url === item.url
                        ? 'border-red-600 bg-red-50 ring-2 ring-red-500/30'
                        : 'border-slate-200 hover:bg-slate-100 bg-white'
                    }`}
                  >
                    <img src={item.url} alt={item.label} className="h-12 w-full object-cover rounded-lg" />
                    <span className="text-[10px] font-bold text-slate-800 line-clamp-1 w-full text-center">{item.label}</span>
                  </button>
                ))}
              </div>
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
              className="rounded-xl text-xs h-9 bg-red-600 hover:bg-red-700 text-white font-bold px-6 shadow-md shadow-red-500/20"
            >
              {loading ? 'Guardando...' : promotion ? 'Guardar Cambios' : 'Publicar Promoción'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
