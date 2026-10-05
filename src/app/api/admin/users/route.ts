import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient as createSessionClient } from '@/lib/supabase/server';
import { UserRole } from '@/types/admin';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function authorizeAdmin() {
  const sessionClient = await createSessionClient();
  const { data: { user }, error: authError } = await sessionClient.auth.getUser();
  if (authError || !user) return { response: NextResponse.json({ error: 'Debes iniciar sesión.' }, { status: 401 }) };

  const { data: membership, error: membershipError } = await sessionClient
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (membershipError) {
    return { response: NextResponse.json({ error: 'No se pudieron validar los permisos de administrador.' }, { status: 403 }) };
  }
  if (!membership) return { response: NextResponse.json({ error: 'Solo un administrador puede invitar usuarios.' }, { status: 403 }) };

  return { admin: createAdminClient(), userId: user.id };
}

export async function POST(request: NextRequest) {
  const authorization = await authorizeAdmin();
  if ('response' in authorization) return authorization.response;

  let body: {
    name?: string;
    email?: string;
    role?: UserRole;
    business_id?: string;
    status?: 'active' | 'inactive';
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'La solicitud no contiene JSON válido.' }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const role: UserRole = body.role === 'admin' ? 'admin' : 'user';
  const businessId = role === 'user' ? body.business_id || null : null;
  const status = body.status === 'inactive' ? 'inactive' : 'active';

  if (!name || name.length < 2) {
    return NextResponse.json({ error: 'Ingresa un nombre válido.' }, { status: 400 });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Ingresa un correo electrónico válido.' }, { status: 400 });
  }
  if (businessId && !UUID_PATTERN.test(businessId)) {
    return NextResponse.json({ error: 'El negocio seleccionado no es válido.' }, { status: 400 });
  }

  const { admin } = authorization;
  const { data: authUsers, error: authListError } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (authListError) {
    return NextResponse.json({ error: `No se pudo validar si el correo ya existe: ${authListError.message}` }, { status: 500 });
  }
  const authUserExists = authUsers?.users?.some((user) => user.email?.toLowerCase() === email);
  if (authUserExists) {
    return NextResponse.json({ error: 'Este correo ya está registrado en la plataforma. No se puede volver a invitar.' }, { status: 409 });
  }

  const { data: existingProfile, error: profileLookupError } = await admin
    .from('profiles')
    .select('id')
    .eq('email', email)
    .maybeSingle();
  if (profileLookupError) {
    return NextResponse.json({ error: `No se pudo validar el perfil previo: ${profileLookupError.message}` }, { status: 500 });
  }
  if (existingProfile) {
    return NextResponse.json({ error: 'Ya existe un perfil con este correo. Revisa la lista de usuarios o usa otro correo.' }, { status: 409 });
  }

  const appUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
  const redirectTo = new URL('/auth/callback', appUrl);
  redirectTo.searchParams.set('next', '/restablecer-contrasena?invite=1');

  const { data: invite, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: redirectTo.toString(),
    data: { full_name: name },
  });

  if (inviteError) {
    return NextResponse.json({ error: `No se pudo invitar el correo: ${inviteError.message}` }, { status: 400 });
  }
  if (!invite.user) {
    return NextResponse.json({ error: 'Supabase no devolvió el usuario invitado.' }, { status: 502 });
  }

  const profilePayload: Record<string, unknown> = {
    id: invite.user.id,
    email,
    full_name: name,
    role,
    business_id: businessId,
  };
  if (status === 'inactive') profilePayload.status = status;

  let profileError = null;
  const upsertProfile = async (payload: Record<string, unknown>) => {
    const { error } = await admin.from('profiles').upsert(payload, { onConflict: 'id' });
    return error;
  };

  profileError = await upsertProfile(profilePayload);
  if (profileError && /column .*status.*does not exist|status.*does not exist/i.test(profileError.message)) {
    delete profilePayload.status;
    profileError = await upsertProfile(profilePayload);
  }
  if (profileError) {
    await admin.auth.admin.deleteUser(invite.user.id);
    return NextResponse.json({ error: `No se pudo guardar el perfil: ${profileError.message}` }, { status: 500 });
  }

  if (role === 'admin') {
    const { error: roleError } = await admin.from('admin_users').upsert({ user_id: invite.user.id }, { onConflict: 'user_id' });
    if (roleError) {
      await admin.auth.admin.deleteUser(invite.user.id);
      return NextResponse.json({ error: `No se pudo asignar el rol admin: ${roleError.message}` }, { status: 500 });
    }
  }

  return NextResponse.json({
    user: {
      id: invite.user.id,
      name,
      email,
      role,
      business_id: businessId || undefined,
      status,
      created_at: invite.user.created_at,
    },
    invitationSent: true,
  }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const authorization = await authorizeAdmin();
  if ('response' in authorization) return authorization.response;

  let body: {
    id?: string;
    name?: string;
    role?: UserRole;
    business_id?: string | null;
    status?: 'active' | 'inactive';
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'La solicitud no contiene JSON válido.' }, { status: 400 });
  }

  if (!body.id || !UUID_PATTERN.test(body.id)) {
    return NextResponse.json({ error: 'El usuario seleccionado no es válido.' }, { status: 400 });
  }
  if (body.id === authorization.userId && (body.role === 'user' || body.status === 'inactive')) {
    return NextResponse.json({ error: 'No puedes quitarte a ti mismo el acceso de administrador.' }, { status: 400 });
  }
  if (body.business_id && !UUID_PATTERN.test(body.business_id)) {
    return NextResponse.json({ error: 'El negocio seleccionado no es válido.' }, { status: 400 });
  }

  const { admin } = authorization;
  if (body.role === 'admin') {
    const { error } = await admin.auth.admin.getUserById(body.id);
    if (error) return NextResponse.json({ error: 'No se encontró la cuenta Auth seleccionada.' }, { status: 404 });
    const { error: membershipError } = await admin.from('admin_users').upsert(
      { user_id: body.id },
      { onConflict: 'user_id' }
    );
    if (membershipError) return NextResponse.json({ error: membershipError.message }, { status: 500 });
  } else if (body.role === 'user') {
    const { error } = await admin.from('admin_users').delete().eq('user_id', body.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const profilePayload: Record<string, unknown> = {};
  if (body.name !== undefined) profilePayload.full_name = body.name.trim();
  if (body.role !== undefined) profilePayload.role = body.role;
  if (body.business_id !== undefined) profilePayload.business_id = body.business_id || null;
  if (body.status !== undefined) profilePayload.status = body.status;

  let profile: any = null;
  let profileError = null;
  const runProfileUpdate = async (payload: Record<string, unknown>) => {
    return admin
      .from('profiles')
      .update(payload)
      .eq('id', body.id)
      .select('*, businesses(name)')
      .maybeSingle();
  };

  const firstUpdate = await runProfileUpdate(profilePayload);
  profile = firstUpdate.data;
  profileError = firstUpdate.error;

  if (profileError && /column .*status.*does not exist|status.*does not exist/i.test(profileError.message)) {
    delete profilePayload.status;
    const retryUpdate = await runProfileUpdate(profilePayload);
    profile = retryUpdate.data;
    profileError = retryUpdate.error;
  }

  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 500 });
  if (!profile) return NextResponse.json({ error: 'No se encontró el perfil.' }, { status: 404 });

  return NextResponse.json({ user: {
    id: profile.id,
    name: profile.full_name || profile.email,
    email: profile.email,
    role: profile.role === 'admin' ? 'admin' : 'user',
    business_id: profile.business_id || undefined,
    business_name: profile.businesses?.name || undefined,
    status: profile.status === 'inactive' ? 'inactive' : 'active',
    created_at: profile.created_at,
  } });
}

export async function DELETE(request: NextRequest) {
  const authorization = await authorizeAdmin();
  if ('response' in authorization) return authorization.response;

  let body: { id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'La solicitud no contiene JSON válido.' }, { status: 400 });
  }

  if (!body.id || !UUID_PATTERN.test(body.id)) {
    return NextResponse.json({ error: 'El usuario seleccionado no es válido.' }, { status: 400 });
  }
  if (body.id === authorization.userId) {
    return NextResponse.json({ error: 'No puedes eliminar tu propia cuenta mientras tienes sesión iniciada.' }, { status: 400 });
  }

  const { error } = await authorization.admin.auth.admin.deleteUser(body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ deleted: true });
}
