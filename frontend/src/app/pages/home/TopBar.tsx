"use client";

import React, { useState, useRef, useEffect } from 'react';
import styles from '@/app/styles/topbar.module.css';
import Image from '@/app/components/assets/images';
import Icons from '@/app/components/assets/icons';

export const TopBar: React.FC = () => {
  const [painelOpen, setPainelOpen] = useState(false);
  const painelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleDoc(e: MouseEvent) {
      if (!painelRef.current) return;
      if (e.target instanceof Node && !painelRef.current.contains(e.target)) {
        setPainelOpen(false);
      }
    }
    document.addEventListener('mousedown', handleDoc);
    return () => document.removeEventListener('mousedown', handleDoc);
  }, []);

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between h-16 px-6"
      style={{
        backgroundImage: `url(${Image.fundoTopBottom})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'rgba(246, 244, 240,0.8)',
      }}
    >
      <div className="flex items-center space-x-1">
        <img src={Icons.solarHeartBroken} alt="Coração" className="h-10 w-10" />
        <span className="premautTitle">PREMAUT</span>
      </div>
      <div
        className="flex items-center space-x-4 px-4 py-2 rounded bg-white shadow-md"
        style={
          { 
            boxShadow: '0 8px 6px rgba(0, 0, 0, 0.3)' 
          }
        }
      >
        <nav className="hidden sm:flex items-center space-x-4" style={{ position: 'relative' }}>
          <a href="" className={styles.topbarLink}>Inicio</a>
          <a href="#noticias" className={styles.topbarLink}>Noticias</a>
          <a href="#sobre" className={styles.topbarLink}>Sobre</a>

          <div ref={painelRef} style={{ position: 'relative' }}>
            <button
              type="button"
              className={styles.topbarLink}
              onClick={() => setPainelOpen((v) => !v)}
              aria-expanded={painelOpen}
              aria-haspopup="menu"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              Painel ▾
            </button>

            {painelOpen && (
              <div
                role="menu"
                aria-label="Opções do Painel"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  minWidth: 160,
                  background: '#fff',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
                  borderRadius: 8,
                  padding: '6px 0',
                  zIndex: 120,
                }}
              >
                <a href="/painel/admin" role="menuitem" className={styles.topbarLink} style={{ display: 'block', padding: '8px 12px' }}>
                  Painel do Admin
                </a>
                <a href="/painel/professor" role="menuitem" className={styles.topbarLink} style={{ display: 'block', padding: '8px 12px' }}>
                  Painel do Professor
                </a>
              </div>
            )}
          </div>
        </nav>
      </div>
      <button 
      className="px-3 py-1 rounded bg-white text-white text-sm"
      style={
        {
            boxShadow: '0 8px 6px rgba(0, 0, 0, 0.3)' 
        }
      }
      >
        <a
          href="/auth/login"
          className={styles.topbarLink}
          style={
            {
              fontSize: '12px',
              fontWeight: '600'
            }
          }
        >Entrar</a>
      </button>

    </header>
  );
};

export default TopBar;
