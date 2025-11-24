"use client";

import React from 'react';
import TopBar from '@/app/components/TopBar';
import MaterialDetalhe from './Content';

export default function MaterialPage() {
  return (
    <main>
        <TopBar />
        <MaterialDetalhe />
    </main>
  );
}