"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedUserTypes?: string[];
  redirectTo?: string;
  requireAuth?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  allowedUserTypes = [], 
  redirectTo = '/home',
  requireAuth = true
}: ProtectedRouteProps) {
  const { isLoggedIn, user, loading } = useAuth();
  const router = useRouter();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (loading) return; // Aguarda carregar o estado de autenticação

    // Se não requer autenticação, permite acesso
    if (!requireAuth) {
      setShouldRender(true);
      return;
    }

    // Se requer autenticação mas usuário não está logado
    if (requireAuth && !isLoggedIn) {
      router.push(redirectTo);
      return;
    }

    // Se tem tipos permitidos especificados, verifica se o usuário tem permissão
    if (allowedUserTypes.length > 0 && user) {
      const hasPermission = allowedUserTypes.includes(user.tipo_usuario);
      if (!hasPermission) {
        // Redireciona para a página apropriada do usuário
        redirectToUserDashboard(user.tipo_usuario);
        return;
      }
    }

    setShouldRender(true);
  }, [isLoggedIn, user, loading, requireAuth, allowedUserTypes, redirectTo, router]);

  const redirectToUserDashboard = (userType: string) => {
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