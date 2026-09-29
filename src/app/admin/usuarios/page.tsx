'use client';

import { useState, useEffect } from 'react';
import { Users, Plus, ShieldCheck, UserCheck, Mail, Building2, Pencil, Trash2, Search, CheckCircle2, XCircle, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdminHeader } from '@/components/admin/admin-header';
import { UserModal } from '@/components/admin/user-modal';
import { DeleteConfirmModal } from '@/components/admin/delete-confirm-modal';
import { getUsers, createUser, updateUser, deleteUser, getBusinesses } from '@/lib/services/promotions';
import { UserAccount, Business, UserRole } from '@/types/admin';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserAccount | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, bizData] = await Promise.all([
        getUsers(),
        getBusinesses(),
      ]);
      setUsers(usersData);
      setBusinesses(bizData);
    } catch {
      toast.error('Error al cargar la lista de usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUser = async (data: Partial<UserAccount>) => {
    if (selectedUser) {
      const updated = await updateUser(selectedUser.id, data);
      setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? { ...u, ...updated } : u)));
      toast.success('Cuenta de usuario actualizada');
    } else {
      const created = await createUser(data as any);
      setUsers((prev) => [created, ...prev]);
      toast.success('Nuevo usuario registrado correctamente');
    }
  };

  const handleToggleStatus = async (user: UserAccount) => {
    const newStatus: 'active' | 'inactive' = user.status === 'active' ? 'inactive' : 'active';
    const updated = await updateUser(user.id, { status: newStatus });
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u)));
    toast.info(newStatus === 'inactive' ? `La cuenta de ${user.name} fue dada de baja.` : `La cuenta de ${user.name} fue activada.`);
  };

  const handleToggleRole = async (user: UserAccount) => {
    const newRole: UserRole = user.role === 'admin' ? 'user' : 'admin';
    const updated = await updateUser(user.id, { role: newRole });
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)));
    toast.success(`Rol de ${user.name} cambiado a: ${newRole === 'admin' ? 'Administrador' : 'Usuario'}`);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      await deleteUser(userToDelete.id);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      toast.success('Usuario eliminado permanentemente del sistema');
    }
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.business_name && u.business_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex-1 space-y-6 pb-12">
      <AdminHeader
        title="Gestión de Usuarios y Roles"
        subtitle="Control total sobre accesos del sistema: alta, edición, baja/inactivación y eliminación de cuentas"
        onNewPromotion={() => {
          setSelectedUser(null);
          setIsModalOpen(true);
        }}
      />

      <div className="px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, correo o negocio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 rounded-xl text-xs bg-card border-border/60"
            />
          </div>

          <Button
            onClick={() => {
              setSelectedUser(null);
              setIsModalOpen(true);
            }}
            className="w-full sm:w-auto rounded-xl text-xs h-10 bg-primary text-white font-semibold flex items-center justify-center gap-1.5"
          >
            <Plus className="h-4 w-4" /> Crear Nuevo Usuario
          </Button>
        </div>

        {/* User Table Card */}
        <Card className="rounded-2xl border-border/60 shadow-sm overflow-hidden bg-card">
          <CardHeader className="p-5 border-b border-border/40 bg-muted/20 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground">Cuentas Registradas ({users.length})</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Control de roles: Administradores globales y Usuarios de comercios afiliados
              </CardDescription>
            </div>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[650px]">
              <thead className="bg-muted/40 text-muted-foreground border-b border-border/40 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Usuario</th>
                  <th className="py-3 px-4">Correo Electrónico</th>
                  <th className="py-3 px-4">Rol Asignado</th>
                  <th className="py-3 px-4">Negocio Afiliado</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground text-xs">
                      No hay usuarios registrados que coincidan con la búsqueda.
                    </td>
                  </tr>
                ) : (
                  filtered.map((usr) => (
                    <tr key={usr.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-foreground">
                        <div className="flex items-center gap-2.5">
                          <div className={`h-8 w-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                            usr.role === 'admin'
                              ? 'bg-primary/15 text-primary border border-primary/20'
                              : 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/20'
                          }`}>
                            {usr.name.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span>{usr.name}</span>
                            {usr.status === 'inactive' && (
                              <span className="text-[10px] text-destructive font-semibold">DADO DE BAJA</span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-muted-foreground">
                        {usr.email}
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleRole(usr)}
                          title="Clic para alternar rol entre Admin y Usuario"
                        >
                          {usr.role === 'admin' ? (
                            <Badge className="bg-primary/15 text-primary hover:bg-primary/25 border-primary/30 text-[10px] gap-1 cursor-pointer">
                              <ShieldCheck className="h-3 w-3" /> Administrador
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 border-emerald-500/30 text-[10px] gap-1 cursor-pointer">
                              <UserCheck className="h-3 w-3" /> Usuario / Negocio
                            </Badge>
                          )}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-muted-foreground font-medium">
                        {usr.business_name || (usr.role === 'admin' ? '— (Acceso Total)' : 'Sin negocio asignado')}
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleStatus(usr)}
                          title="Clic para dar de baja o activar esta cuenta"
                          className="cursor-pointer"
                        >
                          {usr.status === 'active' ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 text-[11px] font-bold">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Activo
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-destructive hover:text-destructive/80 text-[11px] font-bold">
                              <XCircle className="h-3.5 w-3.5" /> Inactivo (Baja)
                            </span>
                          )}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(usr)}
                            className={`h-8 px-2 text-xs rounded-lg gap-1 ${
                              usr.status === 'active'
                                ? 'text-amber-600 hover:bg-amber-500/10'
                                : 'text-emerald-600 hover:bg-emerald-500/10'
                            }`}
                            title={usr.status === 'active' ? 'Dar de baja a este usuario' : 'Activar este usuario'}
                          >
                            <Power className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">
                              {usr.status === 'active' ? 'Dar de baja' : 'Activar'}
                            </span>
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedUser(usr);
                              setIsModalOpen(true);
                            }}
                            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg"
                            title="Editar usuario"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setUserToDelete(usr);
                              setIsDeleteOpen(true);
                            }}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                            title="Eliminar usuario permanentemente"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* User Modal Form */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        userAccount={selectedUser}
        businesses={businesses}
      />

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title={`¿Eliminar permanentemente a ${userToDelete?.name}?`}
        description="Esta acción borrará la cuenta del usuario y no podrá volver a iniciar sesión."
      />
    </div>
  );
}
