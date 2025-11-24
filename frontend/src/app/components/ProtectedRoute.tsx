"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedUserTypes?: string[];
  // alias para facilitar uso em páginas que passavam `requiredUserType`
  requiredUserType?: string | string[];
  redirectTo?: string;
  requireAuth?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  allowedUserTypes = [], 
  requiredUserType,
  redirectTo = '/home',
  requireAuth = true
}: ProtectedRouteProps) {
  const { isLoggedIn, user, loading } = useAuth();
  const router = useRouter();
  const [shouldRender, setShouldRender] = useState(false);

  // Normaliza allowedUserTypes considerando o alias `requiredUserType`
  const effectiveAllowedUserTypes: string[] = (allowedUserTypes && allowedUserTypes.length > 0)
    ? allowedUserTypes
    : (requiredUserType ? ([] as string[]).concat(requiredUserType as any) : []);

  useEffect(() => {
    if (loading) {
      console.log('[ProtectedRoute] loading auth state...');
      return; // Aguarda carregar o estado de autenticação
    }

    // Se não requer autenticação, permite acesso
    if (!requireAuth) {
      setShouldRender(true);
      return;
    }

    // Se requer autenticação mas usuário não está logado
    if (requireAuth && !isLoggedIn) {
      console.log('[ProtectedRoute] user not logged in -> redirect', { redirectTo });
      router.push(redirectTo);
      return;
    }

    // Se tem tipos permitidos especificados, verifica se o usuário tem permissão
    // Admin deve ter acesso a todas as rotas protegidas
    if (user && user.tipo_usuario === 'admin') {
      console.log('[ProtectedRoute] user is admin -> allow access');
      setShouldRender(true);
      return;
    }

    if (effectiveAllowedUserTypes.length > 0 && user) {
      console.log('[ProtectedRoute] checking permissions', { effectiveAllowedUserTypes, userType: user.tipo_usuario });
      const hasPermission = effectiveAllowedUserTypes.includes(user.tipo_usuario);
      if (!hasPermission) {
        console.log('[ProtectedRoute] permission denied -> redirecting to user dashboard', { userType: user.tipo_usuario });
        // Redireciona para a página apropriada do usuário
        redirectToUserDashboard(user.tipo_usuario);
        return;
      }
    }

    setShouldRender(true);
  }, [isLoggedIn, user, loading, requireAuth, allowedUserTypes, redirectTo, router]);

  const redirectToUserDashboard = (userType: string) => {
    console.log('[ProtectedRoute] redirectToUserDashboard helper', { userType });
    switch (userType) {
      case 'admin':
        router.push('/painel/admin');
        break;
      case 'professor':
        router.push('/painel/professor');
        break;
      case 'monitor':
        router.push('/perfil/monitor');
        break;
      case 'familiar':
        router.push('/perfil/familia');
        break;
      case 'paciente':
        router.push('/perfil/paciente');
        break;
      default:
        router.push('/home');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-medium text-gray-700">Carregando...</div>
      </div>
    );
  }

  // Se não deve renderizar, retorna loading
  if (!shouldRender) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-medium text-gray-700">Redirecionando...</div>
      </div>
    );
  }

  return <>{children}</>;
}