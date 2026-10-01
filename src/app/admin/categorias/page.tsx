'use client';

import { useState, useEffect } from 'react';
import { FolderKanban, Plus, Utensils, Smartphone, Film, ShoppingBag, Heart, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AdminHeader } from '@/components/admin/admin-header';
import { CategoryModal } from '@/components/admin/category-modal';
import { DeleteConfirmModal } from '@/components/admin/delete-confirm-modal';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/lib/services/promotions';
import { Category } from '@/types/admin';
import { toast } from 'sonner';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [catToDelete, setCatToDelete] = useState<Category | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch {
      toast.error('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCategory = async (data: Partial<Category>) => {
    if (selectedCat) {
      const updated = await updateCategory(selectedCat.id, data);
      setCategories((prev) => prev.map((c) => (c.id === selectedCat.id ? { ...c, ...updated } : c)));
    } else {
      const created = await createCategory(data as any);
      setCategories((prev) => [...prev, created]);
    }
  };

  const handleConfirmDelete = async () => {
    if (catToDelete) {
      await deleteCategory(catToDelete.id);
      setCategories((prev) => prev.filter((c) => c.id !== catToDelete.id));
      toast.success('Categoría eliminada con éxito');
    }
  };

  const renderCategoryIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Utensils': return <Utensils className="h-6 w-6" />;
      case 'Smartphone': return <Smartphone className="h-6 w-6" />;
      case 'Film': return <Film className="h-6 w-6" />;
      case 'ShoppingBag': return <ShoppingBag className="h-6 w-6" />;
      case 'Heart': return <Heart className="h-6 w-6" />;
      default: return <FolderKanban className="h-6 w-6" />;
    }
  };

  return (
    <div className="flex-1 space-y-6 pb-12">
      <AdminHeader
        title="Gestión de Categorías"
        subtitle="Organiza y clasifica las ofertas según los intereses de los usuarios"
        onNewPromotion={() => {
          setSelectedCat(null);
          setIsModalOpen(true);
        }}
      />

      <div className="px-3 sm:px-6 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground font-medium">
            Total categorías activas: <span className="font-bold text-foreground">{categories.length}</span>
          </p>

          <Button
            onClick={() => {
              setSelectedCat(null);
              setIsModalOpen(true);
            }}
            className="rounded-xl text-xs h-10 bg-primary text-white font-semibold flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" /> Nueva Categoría
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Card key={cat.id} className="rounded-2xl border-border/60 bg-card p-5 flex flex-col justify-between shadow-sm hover:border-primary/40 transition-all group">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  {renderCategoryIcon(cat.icon)}
                </div>
                <h3 className="font-bold text-sm text-foreground">{cat.name}</h3>
                <p className="text-[11px] text-muted-foreground font-mono mt-0.5">/{cat.slug}</p>
                {cat.description && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {cat.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-center gap-2 pt-4 mt-4 border-t border-border/40">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedCat(cat);
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
                    setCatToDelete(cat);
                    setIsDeleteOpen(true);
                  }}
                  className="h-8 text-xs gap-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Eliminar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Category Modal Form */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
        category={selectedCat}
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title={`¿Eliminar categoría ${catToDelete?.name}?`}
        description="Esta categoría dejará de estar disponible para clasificar ofertas."
      />
    </div>
  );
}
