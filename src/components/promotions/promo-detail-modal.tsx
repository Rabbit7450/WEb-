'use client';

import { X, MapPin, Calendar, Tag, Store, Ticket, MessageSquare, Flame, CheckCircle2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Promotion } from '@/types/admin';

interface PromoDetailModalProps {
  promo: Promotion | null;
  onClose: () => void;
}

export function PromoDetailModal({ promo, onClose }: PromoDetailModalProps) {
  if (!promo) return null;

  const rawPhone = '59172084768';
  const whatsappUrl = `https://wa.me/${rawPhone}?text=${encodeURIComponent(`¡Hola! Quiero aprovechar la promoción: ${promo.title} en Bs. ${promo.offer_price}`)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-amber-50 border-2 border-red-500/30 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header Image & Close Button */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900 shrink-0">
          <img
            src={promo.image_url}
            alt={promo.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full bg-slate-950/60 p-2 text-white hover:bg-slate-950 transition-colors z-10"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Badge Discount */}
          <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-amber-500 text-white px-3 py-1 rounded-full font-black text-xs shadow-lg flex items-center gap-1">
            <Flame className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
            <span>-{promo.discount_percentage}% OFF</span>
          </div>
          {promo.status === 'sold_out' && (
            <span className="absolute top-4 right-16 rounded-full bg-slate-950/90 px-3 py-1 text-xs font-bold text-white">
              Agotada
            </span>
          )}

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 mb-1">
              <Store className="h-3.5 w-3.5" />
              <span>{promo.business_name}</span>
              <span>•</span>
              <MapPin className="h-3.5 w-3.5 text-red-500" />
              <span>{promo.city_name}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black leading-tight text-white">
              {promo.title}
            </h2>
          </div>
        </div>

        {/* Details Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Price Header */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-red-500/20 shadow-sm">
            <div>
              <span className="text-xs text-slate-400 line-through font-semibold block">
                Precio Normal: Bs. {promo.original_price}
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl sm:text-3xl font-black text-red-600">
                  Bs. {promo.offer_price}
                </span>
                <span className="text-xs font-bold text-amber-600">
                  (Ahorras Bs. {((promo.original_price || 0) - (promo.offer_price || 0)).toFixed(2)})
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Categoría
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs">
                {promo.category_name}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
              Detalles de la Promoción
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 font-medium whitespace-pre-line leading-relaxed">
              {promo.description}
            </p>
          </div>

          {/* Dates & Coupon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-white border border-amber-200 text-xs space-y-1">
              <span className="text-slate-400 font-bold flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-red-600" /> Válido hasta:
              </span>
              <span className="font-bold text-slate-800 block">
                {promo.end_date || 'Sin fecha límite'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-amber-200 text-xs space-y-1">
              <span className="text-slate-400 font-bold flex items-center gap-1">
                <Ticket className="h-3.5 w-3.5 text-amber-600" /> Código Cupón:
              </span>
              <span className="font-mono font-bold text-red-600 block text-sm">
                {promo.coupon_code || 'SIN CÓDIGO'}
              </span>
            </div>
          </div>

          {/* External Offer Link Button if configured */}
          {promo.status !== 'sold_out' && promo.link_url && promo.link_url.trim().length > 0 && (
            <div className="pt-2">
              <a
                href={promo.link_url.startsWith('http') ? promo.link_url : `https://${promo.link_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-transform active:scale-95"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Ver Oferta Oficial en {promo.business_name || 'Sitio Web'}</span>
              </a>
            </div>
          )}

          {/* Claim via WhatsApp Button */}
          {promo.status === 'sold_out' ? (
            <p className="pt-3 border-t border-amber-200 text-center text-sm font-bold text-slate-600">
              Esta promoción ya no tiene stock.
            </p>
          ) : (
            <div className="pt-2 border-t border-amber-200">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-transform active:scale-95"
              >
                <MessageSquare className="h-4 w-4 fill-white" />
                <span>Reclamar esta Promoción por WhatsApp</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
