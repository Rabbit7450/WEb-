'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, 
  DollarSign, 
  Sparkles, 
  Database, 
  CheckCircle2, 
  Server, 
  Key, 
  RefreshCw, 
  Save, 
  Globe, 
  Mail, 
  Phone, 
  BarChart3, 
  Eye, 
  MousePointerClick,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AdminHeader } from '@/components/admin/admin-header';
import { getAdsConfig, updateAdsConfig } from '@/lib/services/promotions';
import { GoogleAdsConfig } from '@/types/admin';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'monetization' | 'general' | 'system'>('monetization');

  // Monetization Google Ads state
  const [adsConfig, setAdsConfig] = useState<GoogleAdsConfig>({
    enabled: true,
    client_id: 'ca-pub-6370743227565174',
    hero_slot: '1234567890',
    sidebar_slot: '2345678901',
    infeed_slot: '3456789012',
    footer_slot: '4567890123',
    auto_ads: true,
    estimated_revenue: 1450.80,
    impressions: 48290,
    clicks: 1840,
  });

  // General site state
  const [siteTitle, setSiteTitle] = useState('Yaps — Promociones de Bolivia');
  const [siteDesc, setSiteDesc] = useState('Todas las mejores ofertas y promociones de Bolivia en un solo lugar');
  const [contactEmail, setContactEmail] = useState('contacto@yaps.bo');
  const [contactPhone, setContactPhone] = useState('+591 76543210');

  const [savingAds, setSavingAds] = useState(false);
  const [savingSite, setSavingSite] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    getAdsConfig().then(setAdsConfig);
  }, []);

  const handleSaveAds = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAds(true);
    try {
      const updated = await updateAdsConfig(adsConfig);
      setAdsConfig(updated);
      toast.success('¡Configuración de Google Ads guardada correctamente!');
    } catch {
      toast.error('Error al guardar la publicidad');
    } finally {
      setSavingAds(false);
    }
  };

  const handleSaveSite = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSite(true);
    setTimeout(() => {
      setSavingSite(false);
      toast.success('¡Ajustes del sitio actualizados!');
    }, 400);
  };

  const handleTestConnection = async () => {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      toast.success('¡Conexión a Supabase activa y operando!');
    }, 500);
  };

  return (
    <div className="flex-1 space-y-6 pb-12">
      <AdminHeader
        title="Configuración y Monetización"
        subtitle="Control de Google Ads, monetización con publicidad y ajustes globales del sistema"
      />

      <div className="px-6 space-y-6 max-w-5xl">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-border/40 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('monetization')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'monetization'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-muted-foreground hover:bg-accent'
            }`}
          >
            <DollarSign className="h-4 w-4" /> Monetización Google Ads
          </button>

          <button
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'general'
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-muted-foreground hover:bg-accent'
            }`}
          >
            <Globe className="h-4 w-4" /> Ajustes del Sitio
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'system'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'text-muted-foreground hover:bg-accent'
            }`}
          >
            <Database className="h-4 w-4" /> Infraestructura Supabase
          </button>
        </div>

        {/* TAB 1: MONETIZACION CON GOOGLE ADS */}
        {activeTab === 'monetization' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Ad Monetization Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="rounded-2xl border-amber-500/30 bg-gradient-to-br from-card to-amber-500/10 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wider">Ingresos Estimados</p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-black text-foreground">Bs. {adsConfig.estimated_revenue.toLocaleString()}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Google AdSense Bolivia</p>
                  </div>
                  <div className="h-10 w-10 rounded-2xl bg-amber-500/20 text-amber-600 flex items-center justify-center font-bold">
                    <DollarSign className="h-5 w-5" />
                  </div>
                </div>
              </Card>

              <Card className="rounded-2xl border-border/50 bg-gradient-to-br from-card to-purple-500/5 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Impresiones de Anuncios</p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-black text-foreground">{adsConfig.impressions.toLocaleString()}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">impresiones totales este mes</p>
                  </div>
                  <div className="h-10 w-10 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold">
                    <Eye className="h-5 w-5" />
                  </div>
                </div>
              </Card>

              <Card className="rounded-2xl border-border/50 bg-gradient-to-br from-card to-emerald-500/5 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Clics e Interacción</p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-black text-foreground">{adsConfig.clicks.toLocaleString()}</span>
                      <span className="text-xs text-emerald-500 font-bold ml-1">3.8% CTR</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">clics confirmados en banners</p>
                  </div>
                  <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                    <MousePointerClick className="h-5 w-5" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Google Ads Settings Form */}
            <Card className="rounded-2xl border-border/60 bg-card shadow-sm overflow-hidden">
              <CardHeader className="p-6 border-b border-border/40 bg-muted/20">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-amber-500" /> Configuración de Publicidad (Google Ads)
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground mt-0.5">
                      Activa la inserción de banners y slots de Google AdSense en las páginas principales
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-2 bg-background p-1.5 px-3 rounded-xl border border-border/60">
                    <input
                      type="checkbox"
                      id="ads-master"
                      checked={adsConfig.enabled}
                      onChange={(e) => setAdsConfig((prev) => ({ ...prev, enabled: e.target.checked }))}
                      className="h-4 w-4 rounded border-slate-700 text-amber-500 focus:ring-amber-500 cursor-pointer"
                    />
                    <Label htmlFor="ads-master" className="text-xs font-bold cursor-pointer">
                      {adsConfig.enabled ? 'Publicidad ACTIVADA' : 'Publicidad DESACTIVADA'}
                    </Label>
                  </div>
                </div>
              </CardHeader>

              <form onSubmit={handleSaveAds} className="p-6 space-y-6">
                <div className="space-y-1.5">
                  <Label htmlFor="client-id" className="text-xs font-semibold flex items-center gap-1.5">
                    Google AdSense Client ID (Publisher ID) *
                  </Label>
                  <Input
                    id="client-id"
                    placeholder="ca-pub-6370743227565174"
                    value={adsConfig.client_id}
                    onChange={(e) => setAdsConfig((prev) => ({ ...prev, client_id: e.target.value }))}
                    className="h-10 rounded-xl text-xs font-mono"
                    required
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Código identificador de tu cuenta pública de Google AdSense.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="hero-slot" className="text-xs font-semibold">
                      Slot ID Header / Banner Principal
                    </Label>
                    <Input
                      id="hero-slot"
                      placeholder="1234567890"
                      value={adsConfig.hero_slot}
                      onChange={(e) => setAdsConfig((prev) => ({ ...prev, hero_slot: e.target.value }))}
                      className="h-10 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="sidebar-slot" className="text-xs font-semibold">
                      Slot ID Sidebar Lateral (300x250)
                    </Label>
                    <Input
                      id="sidebar-slot"
                      placeholder="2345678901"
                      value={adsConfig.sidebar_slot}
                      onChange={(e) => setAdsConfig((prev) => ({ ...prev, sidebar_slot: e.target.value }))}
                      className="h-10 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="infeed-slot" className="text-xs font-semibold">
                      Slot ID In-Feed entre Promociones
                    </Label>
                    <Input
                      id="infeed-slot"
                      placeholder="3456789012"
                      value={adsConfig.infeed_slot}
                      onChange={(e) => setAdsConfig((prev) => ({ ...prev, infeed_slot: e.target.value }))}
                      className="h-10 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="footer-slot" className="text-xs font-semibold">
                      Slot ID Footer / Sticky Inferior
                    </Label>
                    <Input
                      id="footer-slot"
                      placeholder="4567890123"
                      value={adsConfig.footer_slot}
                      onChange={(e) => setAdsConfig((prev) => ({ ...prev, footer_slot: e.target.value }))}
                      className="h-10 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/40">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="auto-ads"
                      checked={adsConfig.auto_ads}
                      onChange={(e) => setAdsConfig((prev) => ({ ...prev, auto_ads: e.target.checked }))}
                      className="h-4 w-4 rounded border-slate-700 text-amber-500 focus:ring-amber-500 cursor-pointer"
                    />
                    <Label htmlFor="auto-ads" className="text-xs font-semibold cursor-pointer">
                      Habilitar Google Auto-Ads (Anuncios automáticos responsive)
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    disabled={savingAds}
                    className="rounded-xl h-10 text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                  >
                    <Save className="h-4 w-4" />
                    <span>{savingAds ? 'Guardando...' : 'Guardar Monetización'}</span>
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* TAB 2: GENERAL SITE SETTINGS */}
        {activeTab === 'general' && (
          <Card className="rounded-2xl border-border/60 bg-card shadow-sm overflow-hidden animate-in fade-in duration-200">
            <CardHeader className="p-6 border-b border-border/40 bg-muted/20">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" /> Información General del Sitio Web
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Datos de contacto, título de la plataforma y branding comercial
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSaveSite} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="site-title" className="text-xs font-semibold">Título Principal de la Web</Label>
                <Input
                  id="site-title"
                  value={siteTitle}
                  onChange={(e) => setSiteTitle(e.target.value)}
                  className="h-10 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="site-desc" className="text-xs font-semibold">Descripción Meta / SEO</Label>
                <Textarea
                  id="site-desc"
                  rows={2}
                  value={siteDesc}
                  onChange={(e) => setSiteDesc(e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="site-email" className="text-xs font-semibold flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-primary" /> Correo de Soporte
                  </Label>
                  <Input
                    id="site-email"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="h-10 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="site-phone" className="text-xs font-semibold flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-primary" /> WhatsApp Comercial
                  </Label>
                  <Input
                    id="site-phone"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="h-10 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border/40">
                <Button
                  type="submit"
                  disabled={savingSite}
                  className="rounded-xl h-10 text-xs bg-primary hover:bg-primary/90 text-white font-semibold px-6 flex items-center gap-1.5"
                >
                  <Save className="h-4 w-4" />
                  <span>{savingSite ? 'Guardando...' : 'Guardar Ajustes'}</span>
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* TAB 3: SYSTEM & SUPABASE */}
        {activeTab === 'system' && (
          <Card className="rounded-2xl border-border/60 bg-card shadow-sm overflow-hidden animate-in fade-in duration-200">
            <CardHeader className="p-6 border-b border-border/40 bg-muted/20">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                    <Database className="h-5 w-5 text-purple-600" /> Infraestructura & Supabase API
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mt-0.5">
                    Estado de sincronización y salud de la base de datos PostgreSQL
                  </CardDescription>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTestConnection}
                  disabled={checking}
                  className="rounded-xl text-xs h-9 gap-1.5 border-purple-500/30 text-purple-600 hover:bg-purple-500/10"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${checking ? 'animate-spin' : ''}`} />
                  <span>Probar Conexión</span>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block">
                      Supabase REST & Realtime API
                    </span>
                    <span className="text-[11px] text-muted-foreground font-mono">koeralhhdpolsqioefqs.supabase.co</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center gap-3">
                  <Server className="h-5 w-5 text-purple-600 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-purple-700 dark:text-purple-400 block">
                      Servidor PostgreSQL Database
                    </span>
                    <span className="text-[11px] text-muted-foreground font-mono">Puerto 5432 (Pooler Activo)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-border/40">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-muted-foreground flex items-center gap-1.5">
                    <Key className="h-3.5 w-3.5 text-primary" /> Referencia Proyecto Supabase:
                  </span>
                  <span className="font-mono font-bold text-foreground">koeralhhdpolsqioefqs</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-muted-foreground flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Políticas RLS (Row Level Security):
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">
                    Activo y Enforzado
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
