'use client';

import { useState } from 'react';
import { 
  X, 
  Send, 
  Mail, 
  MessageSquare, 
  Sparkles, 
  Store, 
  User, 
  Phone, 
  Tag, 
  Flame,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface PublishPromoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PublishPromoModal({ isOpen, onClose }: PublishPromoModalProps) {
  const [businessName, setBusinessName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [promoType, setPromoType] = useState('');
  const [message, setMessage] = useState('Quiero promocionar mi negocio');

  if (!isOpen) return null;

  const rawPhone = '59172084768';
  const emailRecipient = 'adalit.tic@gmail.com';

  const buildMessageText = () => {
    let text = `¡Hola Yaps Bolivia! ${message}\n\n`;
    if (businessName) text += `📌 *Negocio:* ${businessName}\n`;
    if (contactName) text += `👤 *Contacto:* ${contactName}\n`;
    if (phone) text += `📞 *Teléfono:* ${phone}\n`;
    if (promoType) text += `🏷️ *Tipo de Oferta:* ${promoType}\n`;
    text += `\nQuedo a la espera de su respuesta para acordar la publicación. ¡Gracias!`;
    return text;
  };

  const handleWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const fullText = buildMessageText();
    const url = `https://wa.me/${rawPhone}?text=${encodeURIComponent(fullText)}`;
    window.open(url, '_blank');
    onClose();
  };

  const handleGmail = (e: React.FormEvent) => {
    e.preventDefault();
    const fullText = buildMessageText();
    const subject = `Nueva Solicitud de Promoción: ${businessName || 'Mi Negocio'}`;
    const url = `mailto:${emailRecipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(fullText)}`;
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-amber-50 border-2 border-red-500/30 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header with Red & Yellow banner */}
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-amber-500 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full bg-black/20 p-1.5 text-white hover:bg-black/40 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider mb-2 shadow">
            <Flame className="h-3.5 w-3.5 text-red-600 fill-red-600" />
            <span>Publica en Yaps Bolivia</span>
          </div>

          <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
            Publicar mi Promoción
          </h3>
          <p className="text-xs text-amber-100 font-medium mt-1">
            Completa tus datos y selecciona enviar por WhatsApp o Correo (Gmail). ¡Respuesta en minutos!
          </p>
        </div>

        {/* Form Body */}
        <form className="p-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="business-name" className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Store className="h-3.5 w-3.5 text-red-600" /> Nombre de tu Negocio / Empresa *
            </Label>
            <Input
              id="business-name"
              placeholder="Ej: Pollos El Rey, TechStore La Paz"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="h-10 rounded-xl bg-white border-amber-300 text-slate-900 text-xs focus:ring-red-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="contact-name" className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-red-600" /> Tu Nombre
              </Label>
              <Input
                id="contact-name"
                placeholder="Ej: Juan Pérez"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="h-10 rounded-xl bg-white border-amber-300 text-slate-900 text-xs focus:ring-red-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone-number" className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-red-600" /> Teléfono / WhatsApp
              </Label>
              <Input
                id="phone-number"
                placeholder="Ej: 72084768"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-10 rounded-xl bg-white border-amber-300 text-slate-900 text-xs focus:ring-red-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="promo-type" className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-red-600" /> Tipo de Promoción u Oferta (Opcional)
            </Label>
            <Input
              id="promo-type"
              placeholder="Ej: Descuento 2x1, Combo Familiar en Bs., 30% OFF"
              value={promoType}
              onChange={(e) => setPromoType(e.target.value)}
              className="h-10 rounded-xl bg-white border-amber-300 text-slate-900 text-xs focus:ring-red-500"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="message-text" className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" /> Mensaje
            </Label>
            <Textarea
              id="message-text"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="rounded-xl bg-white border-amber-300 text-slate-900 text-xs focus:ring-red-500"
              required
            />
          </div>

          {/* Action Choice Buttons: WhatsApp or Gmail */}
          <div className="pt-3 border-t border-amber-200/80 space-y-2">
            <p className="text-[11px] font-semibold text-center text-slate-600">
              ¿Por qué medio prefieres enviar tu solicitud?
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <Button
                type="button"
                onClick={handleWhatsApp}
                className="h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 transition-transform active:scale-95"
              >
                <MessageSquare className="h-4 w-4 fill-white" />
                <span>Enviar por WhatsApp</span>
              </Button>

              <Button
                type="button"
                onClick={handleGmail}
                className="h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-red-600/30 transition-transform active:scale-95"
              >
                <Mail className="h-4 w-4" />
                <span>Enviar por Gmail</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 font-semibold pt-1">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-600" /> WhatsApp: +591 72084768
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-red-600" /> Gmail: adalit.tic@gmail.com
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
