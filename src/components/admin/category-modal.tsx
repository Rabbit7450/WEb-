'use client';

import { useState, useEffect } from 'react';
import { X, FolderKanban, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Category } from '@/types/admin';
import { toast } from 'sonner';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Category>) => Promise<void>;
  category?: Category | null;
}

export function CategoryModal({ isOpen, onClose, onSave, category }: CategoryModalProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [icon, setIcon] = useState('FolderKanban');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setSlug(category.slug || '');
      setIcon(category.icon || 'FolderKanban');
      setDescription(category.description || '');
    } else {
      setName('');
      setSlug('');
      setIcon('FolderKanban');
      setDescription('');
    }
  }, [category, isOpen]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!category) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('El nombre de la categoría es obligatorio');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        icon,
        description,
      });
      toast.success(category ? '¡Categoría actualizada!' : '¡Categoría creada correctamente!');
      onClose();
    } catch {
      toast.error('Error al guardar la categoría');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-card border border-border/60 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/40 bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FolderKanban className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-foreground">
                {category ? 'Editar Categoría' : 'Nueva Categoría'}
              </h2>
              <p className="text-xs text-muted-foreground">
                Clasificación para filtrar promociones en la web
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
            <Label htmlFor="cat-name" className="text-xs font-semibold">Nombre de la Categoría *</Label>
            <Input
              id="cat-name"
              placeholder="Ej. Gastronomía"
              value={name}
              onChange={handleNameChange}
              className="h-10 rounded-xl text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="cat-slug" className="text-xs font-semibold">Slug URL</Label>
              <Input
                id="cat-slug"
                placeholder="gastronomia"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="h-10 rounded-xl text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cat-icon" className="text-xs font-semibold">Icono Ilustrativo</Label>
              <select
                id="cat-icon"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="Utensils">Utensils (Gastronomía)</option>
                <option value="Smartphone">Smartphone (Tecnología)</option>
                <option value="Film">Film (Entretenimiento)</option>
                <option value="ShoppingBag">ShoppingBag (Moda)</option>
                <option value="Heart">Heart (Salud y Belleza)</option>
                <option value="Sparkles">Sparkles (General)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cat-desc" className="text-xs font-semibold">Descripción</Label>
            <Textarea
              id="cat-desc"
              rows={2}
              placeholder="Detalle sobre qué ofertas incluye..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl text-xs"
            />
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
              {loading ? 'Guardando...' : (category ? 'Actualizar Categoría' : 'Crear Categoría')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
