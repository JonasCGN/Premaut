import Cookies from 'js-cookie';

const USER_ID_KEY = 'user_id';
const USER_KEY = 'user_data';

export interface UserData {
  id: string;
  nome: string;
  email: string;
  tipo_usuario: string;
}

// Salvar UUID do usuário e seus dados
export function setAuthUserId(userId: string, userData: UserData): void {
  // Cookie expira em 7 dias
  const expires = 7;
  
  Cookies.set(USER_ID_KEY, userId, { 
    expires, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  
  Cookies.set(USER_KEY, JSON.stringify(userData), { 
    expires, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
}

// Obter UUID do usuário
export function getAuthUserId(): string | undefined {
  return Cookies.get(USER_ID_KEY);
}

// Obter dados do usuário
export function getUserData(): UserData | null {
  const userData = Cookies.get(USER_KEY);
  if (!userData) return null;
  
  try {
    return JSON.parse(userData);
  } catch (error) {
    console.error('Erro ao fazer parse dos dados do usuário:', error);
    return null;
  }
}

// Verificar se está logado
export function isAuthenticated(): boolean {
  const userId = getAuthUserId();
  const userData = getUserData();
  return !!(userId && userData);
}

// Fazer logout (limpar cookies)
export function logout(): void {
  Cookies.remove(USER_ID_KEY);
  Cookies.remove(USER_KEY);
  
  // Também limpa do localStorage se existir (compatibilidade)
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
}

// Migrar dados do localStorage para cookies (se existirem)
export function migrateFromLocalStorage(): void {
  if (typeof window === 'undefined') return;
  
  const localUser = localStorage.getItem('user');
  
  if (localUser) {
    try {
      const userData = JSON.parse(localUser);
      // Usa o ID do usuário como identificador
      if (userData.id) {
        setAuthUserId(userData.id, userData);
      }
      
      // Remove do localStorage após migrar
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Erro ao migrar dados do localStorage:', error);
    }
  }
}

// Headers para requisições autenticadas (com UUID)
export function getAuthHeaders(): Record<string, string> {
  const userId = getAuthUserId();
  
  if (!userId) {
    return {
      'Content-Type': 'application/json',
    };
  }
  
  return {
    'Content-Type': 'application/json',
    'X-User-ID': userId,
  };
}