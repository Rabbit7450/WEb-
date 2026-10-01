import { NextRequest, NextResponse } from 'next/server';
import { EmailOtpType } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const tokenHash = request.nextUrl.searchParams.get('token_hash');
  const type = request.nextUrl.searchParams.get('type');
  const next = request.nextUrl.searchParams.get('next');
  const redirectPath = next === '/restablecer-contrasena' || next === '/restablecer-contrasena?invite=1'
    ? next
    : '/login?recovery=invalid';

  const supabase = await createClient();
  let authError;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    authError = error;
  } else if (tokenHash && (type === 'invite' || type === 'recovery')) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as EmailOtpType,
    });
    authError = error;
  } else {
    return NextResponse.redirect(new URL('/login?recovery=invalid', request.url));
  }

  if (authError) {
    return NextResponse.redirect(new URL('/login?recovery=invalid', request.url));
  }

  return NextResponse.redirect(new URL(redirectPath, request.url));
}
