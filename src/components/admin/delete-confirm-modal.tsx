'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  description?: string;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Eliminar registro?',
  description = 'Esta acción no se puede deshacer y borrará el elemento permanentemente.',
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm max-h-[90dvh] overflow-y-auto rounded-3xl bg-card border border-border/60 p-5 sm:p-6 shadow-2xl text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/15 text-destructive">
          <AlertTriangle className="h-6 w-6" />
        </div>

        <div>
          <h3 className="font-bold text-base text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex justify-center gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="rounded-xl h-10 text-xs px-5">
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              await onConfirm();
              onClose();
            }}
            className="rounded-xl h-10 text-xs font-semibold px-5"
          >
            Sí, eliminar
          </Button>
        </div>
      </div>
    </div>
  );
}
