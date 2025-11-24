"use client";

import React from 'react';
import styles from '@/app/styles/topbar.module.css';
import Image from '@/app/components/assets/images';
import Icons from '@/app/components/assets/icons';
import { useAuth } from '@/app/contexts/AuthContext';
import { useUserRedirect } from '@/app/hooks/useUserRedirect';

export const TopBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isLoggedIn, user, logout } = useAuth();
  const { redirectToUserDashboard, canAccessPanel } = useUserRedirect();

  const handlePainelClick = (e: React.MouseEvent) => {
    e.preventDefault();
    redirectToUserDashboard();
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header
      className="fixed top-0 left-0 w-full z-40 flex items-center justify-between h-16 px-4 sm:px-6 shadow-lg"
      style={{
        backgroundImage: `url(${Image.fundoTopBottom})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'rgba(246, 244, 240,0.8)',
        transition: 'box-shadow 0.2s',
      }}
    >
      {/* Logo */}
      <div className="flex items-center space-x-1">
        <img src={Icons.solarHeartBroken} alt="Coração" className="h-8 w-8 sm:h-10 sm:w-10" />
        <span className="premautTitle text-sm sm:text-base">PREMAUT</span>
      </div>

      {/* Desktop Navigation */}
      <div
        className="hidden md:flex items-center space-x-4 px-4 py-2 rounded bg-white shadow-md"
        style={{ boxShadow: '0 8px 6px rgba(0, 0, 0, 0.3)' }}
      >
        <nav className="flex items-center space-x-4">
          <a href="/" className={styles.topbarLink}>Inicio</a>
          <a href="#noticias" className={styles.topbarLink}>Noticias</a>
          <a href="#sobre" className={styles.topbarLink}>Sobre</a>
          {isLoggedIn && canAccessPanel() && (
            <a href="#" onClick={handlePainelClick} className={styles.topbarLink}>Painel</a>
          )}
        </nav>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2 rounded bg-white shadow-md"
        style={{ boxShadow: '0 8px 6px rgba(0, 0, 0, 0.3)' }}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Menu"
      >
        <div className="w-5 h-5 flex flex-col justify-center space-y-1">
          <span className={`block h-0.5 bg-gray-600 transition-transform ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
          <span className={`block h-0.5 bg-gray-600 transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block h-0.5 bg-gray-600 transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
        </div>
      </button>

      {/* Auth Button - Desktop */}
      {isLoggedIn ? (
        <div className="hidden md:flex items-center space-x-3">
          {/* <span className="text-sm text-gray-700">Olá, {user?.nome}</span> */}
          <button 
            className="px-3 py-1 rounded bg-white text-white text-sm"
            style={{ 
              boxShadow: '0 8px 6px rgba(0, 0, 0, 0.3)', 
              cursor: 'pointer'
            }}
            onClick={handleLogout}
          >
            <span
              className={styles.topbarLink}
              style={{ fontSize: '12px', fontWeight: '600' }}
            >Sair</span>
          </button>
        </div>
      ) : (
        <button 
          className="hidden md:block px-3 py-1 rounded bg-white text-white text-sm"
          style={{ 
            boxShadow: '0 8px 6px rgba(0, 0, 0, 0.3)', 
            cursor: 'pointer'
          }}
          onClick={() => window.location.href = '/auth/login'}
        >
          <span
            className={styles.topbarLink}
            style={{ fontSize: '12px', fontWeight: '600' }}
          >Entrar</span>
        </button>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 md:hidden bg-white shadow-lg border-t">
          <nav className="flex flex-col p-4 space-y-3">
            <a href="#inicio" className={styles.topbarLink} onClick={() => setIsMenuOpen(false)}>Inicio</a>
            <a href="#noticias" className={styles.topbarLink} onClick={() => setIsMenuOpen(false)}>Noticias</a>
            <a href="#sobre" className={styles.topbarLink} onClick={() => setIsMenuOpen(false)}>Sobre</a>
            {isLoggedIn && canAccessPanel() && (
              <a href="#" onClick={handlePainelClick} className={styles.topbarLink}>Painel</a>
            )}
            
            {isLoggedIn ? (
              <div className="border-t pt-3 space-y-2">
                {/* <p className="text-sm text-gray-600">Olá, {user?.nome}</p> */}
                <button 
                  className="w-full text-left px-3 py-2 rounded bg-white text-sm border border-gray-300"
                  onClick={handleLogout}
                >
                  <span
                    className={styles.topbarLink}
                    style={{ fontSize: '12px', fontWeight: '600' }}
                  >
                    Sair
                  </span>
                </button>
              </div>
            ) : (
              <button className="px-3 py-2 rounded bg-white text-sm border border-gray-300 mt-2">
                <span
                  className={styles.topbarLink}
                  style={{ fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                  onClick={() => window.location.href = '/auth/login'}
                >
                  Entrar
                </span>
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default TopBar;
