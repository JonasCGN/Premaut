import React from 'react';
import TopBar from './TopBar';
import BottomBar from './BottomBar';
import Content from './Content';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 relative">
      <TopBar />
      <div style={{ paddingTop: 64 }}>
        {/* Conteúdo principal */}
        <Content />
        {/* Rodapé */}
        <BottomBar />
      </div>
    </main>
  );
}
