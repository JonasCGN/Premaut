"use client";

import React from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useUserRedirect } from "@/app/hooks/useUserRedirect";
import { FaBars, FaUser, FaBoxOpen, FaCog } from "react-icons/fa";

interface BarraLateralProps {
  lado?: "esquerdo" | "direito";
  onClose?: () => void;
}

export default function BarraLateral({ lado = "esquerdo", onClose }: BarraLateralProps) {
  const { user } = useAuth();
  const { redirectToUserDashboard } = useUserRedirect();
  const posicao = lado === "direito" ? "right-0 border-l-4 border-[#2696ad]" : "left-0 border-r-4 border-[#2696ad]";

  const handlePerfilClick = (e: React.MouseEvent) => {
    e.preventDefault();
    redirectToUserDashboard();
    onClose?.();
  };

  const handleMaterialClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Aqui pode adicionar redirecionamento para materiais de apoio
    onClose?.();
  };

  const handleConfigClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Aqui pode adicionar redirecionamento para configurações
    onClose?.();
  };

  return (
    <aside
      className={`fixed top-0 ${posicao} h-full w-64 bg-[#d1d0cd] flex flex-col items-center py-8 z-50`}
      style={{ minWidth: 220 }}
    >
        {/* Menu Icon */}
        <div
        className="w-full flex items-center px-6 mb-8 cursor-pointer"
        onClick={onClose}
        tabIndex={0}
        role="button"
        aria-label="Fechar barra lateral"
        onKeyPress={e => {
            if (e.key === "Enter" || e.key === " ") onClose?.();
        }}
        >
        <FaBars size={32} color="#2696ad" />
    </div>

      {/* Avatar e nome */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-full border-2 border-[#2696ad] bg-white flex items-center justify-center mb-2" /> 
        <span className="text-[#2696ad] text-lg font-semibold" style={{ fontFamily: 'Inria Serif, serif' }}>
          Olá, {user?.nome || 'Usuário'}
        </span>
      </div>

      {/* Perfis */}
      <div className="w-full flex flex-col items-start px-10 gap-8">
        <a href="#" onClick={handlePerfilClick} className="flex items-center gap-3 text-[#2696ad] text-lg font-semibold mb-2 hover:underline" style={{ fontFamily: 'Inria Serif, serif' }}>
          <FaUser size={24} /> Perfis
        </a>
        <a href="/apoio/materiais" className="flex items-center gap-3 text-black text-lg font-bold mb-2 hover:underline" style={{ fontFamily: 'Inria Serif, serif' }}>
          <FaBoxOpen size={24} /> Matérias de apoio
        </a>
        {/* <a href="#" onClick={handleConfigClick} className="flex items-center gap-3 text-black text-lg font-bold" style={{ fontFamily: 'Inria Serif, serif' }}>
          <FaCog size={24} /> Configurações
        </a> */}
      </div>

      {/* Bolinha azul na lateral */}
      <div
        className={`absolute top-1/3 ${lado === "direito" ? "left-[-16px]" : "right-[-16px]"} w-8 h-8 bg-[#2696ad] rounded-full border-4 border-[#d1d0cd]`}
        style={{ zIndex: 60 }}
      />
    </aside>
  );
}
