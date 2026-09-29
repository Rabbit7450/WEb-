'use client';

import { useState, useEffect } from 'react';
import { X, Building2, MapPin, Phone, CheckCircle2, Globe, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Business } from '@/types/admin';
import { toast } from 'sonner';

interface BusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Business>) => Promise<void>;
  business?: Business | null;
}

export function BusinessModal({ isOpen, onClose, onSave, business }: BusinessModalProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [cityName, setCityName] = useState('La Paz');
  const [isVerified, setIsVerified] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (business) {
      setName(business.name || '');
      setSlug(business.slug || '');
      setDescription(business.description || '');
      setAddress(business.address || '');
      setPhone(business.phone || '');
      setCityName(business.city_name || 'La Paz');
      setIsVerified(business.is_verified ?? true);
    } else {
      setName('');
      setSlug('');
      setDescription('');
      setAddress('');
      setPhone('');
      setCityName('La Paz');
      setIsVerified(true);
    }
  }, [business, isOpen]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!business) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('El nombre del negocio es obligatorio');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description,
        address,
        phone,
        city_name: cityName,
        is_verified: isVerified,
      });
      toast.success(business ? '¡Negocio actualizado con éxito!' : '¡Negocio registrado correctamente!');
      onClose();
    } catch (err) {
      toast.error('Ocurrió un error al guardar el negocio');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-card border border-border/60 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/40 bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-foreground">
                {business ? 'Editar Negocio Afiliado' : 'Registrar Nuevo Negocio'}
              </h2>
              <p className="text-xs text-muted-foreground">
                Completa los datos de la empresa comercial
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="biz-name" className="text-xs font-semibold">Nombre Comercial *</Label>
            <Input
              id="biz-name"
              placeholder="Ej. Burger Craft House"
              value={name}
              onChange={handleNameChange}
              className="h-10 rounded-xl text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="biz-slug" className="text-xs font-semibold">Slug URL</Label>
              <Input
                id="biz-slug"
                placeholder="burger-craft"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="h-10 rounded-xl text-xs font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="biz-city" className="text-xs font-semibold">Ciudad</Label>
              <select
                id="biz-city"
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="La Paz">La Paz</option>
                <option value="Santa Cruz">Santa Cruz</option>
                <option value="Cochabamba">Cochabamba</option>
                <option value="El Alto">El Alto</option>
                <option value="Tarija">Tarija</option>
                <option value="Sucre">Sucre</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="biz-desc" className="text-xs font-semibold">Descripción Comercial</Label>
            <Textarea
              id="biz-desc"
              rows={2}
              placeholder="Breve reseña del negocio o especialidades..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="biz-addr" className="text-xs font-semibold flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-primary" /> Dirección
              </Label>
              <Input
                id="biz-addr"
                placeholder="Av. 6 de Agosto #2435"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="biz-phone" className="text-xs font-semibold flex items-center gap-1">
                <Phone className="h-3.5 w-3.5 text-primary" /> Teléfono / WhatsApp
              </Label>
              <Input
                id="biz-phone"
                placeholder="76543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-10 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/40">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="biz-verified"
                checked={isVerified}
                onChange={(e) => setIsVerified(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 text-primary focus:ring-primary"
              />
              <Label htmlFor="biz-verified" className="text-xs font-semibold cursor-pointer flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Marcar como Negocio Verificado
              </Label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-border/40">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl h-10 text-xs">
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl h-10 text-xs bg-primary hover:bg-primary/90 text-white font-semibold px-6"
            >
              {loading ? 'Guardando...' : (business ? 'Actualizar Negocio' : 'Crear Negocio')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
