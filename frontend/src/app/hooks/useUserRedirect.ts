"use client";

import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export function useUserRedirect() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();

  const redirectToUserDashboard = () => {
    console.log('[useUserRedirect] redirectToUserDashboard called', { isLoggedIn, user });
    if (!isLoggedIn || !user) {
      console.log('[useUserRedirect] not logged in or missing user -> pushing /home');
      router.push('/home');
      return;
    }

    switch (user.tipo_usuario) {
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

  const canAccessPanel = () => {
    if (!isLoggedIn || !user) return false;
    
    // Pacientes não têm acesso ao painel
    return user.tipo_usuario !== 'paciente';
  };

  const getUserDashboardPath = () => {
    if (!isLoggedIn || !user) return '/home';

    switch (user.tipo_usuario) {
      case 'admin':
        return '/painel/admin';
      case 'professor':
        return '/painel/professor';
      case 'monitor':
        return '/perfil/monitor';
      case 'familiar':
        return '/perfil/familia';
      case 'paciente':
        return '/perfil/paciente';
      default:
        return '/home';
    }
  };

  return {
    redirectToUserDashboard,
    canAccessPanel,
    getUserDashboardPath,
    userType: user?.tipo_usuario,
    isLoggedIn
  };
}