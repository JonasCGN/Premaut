"use client";

import Icons from '@/app/components/assets/icons';
import Colors from '@/app/components/color';
import React from 'react';
import { useParams } from 'next/navigation';
import { buscarMateriais } from '@/app/services/materiaisService';

export const MaterialDetalhe: React.FC = () => {
    const params = useParams();
    const id = params?.id;
    const [material, setMaterial] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const isValidUrl = (u?: string) => {
        if (!u) return false;
        try {
            const parsed = new URL(u);
            if (!['http:', 'https:'].includes(parsed.protocol)) return false;
            // evitar domínios de placeholder
            if (parsed.hostname.includes('example.com')) return false;
            return true;
        } catch {
            return false;
        }
    };

    const handleDownload = async () => {
        if (!material?.url) return;
        // tenta baixar via fetch -> blob (evita abrir placeholder)
        try {
            const res = await fetch(material.url);
            if (!res.ok) throw new Error('Falha ao baixar arquivo');
            const blob = await res.blob();
            const objectUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = objectUrl;
            const safeName = (material.nome || 'arquivo').replace(/[^a-z0-9_\-\.]/gi, '_');
            a.download = `${safeName}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(objectUrl);
        } catch (err) {
            console.warn('Download falhou, abrindo em nova aba como fallback', err);
            // fallback: abrir em nova aba
            window.open(material.url, '_blank');
        }
    };

    React.useEffect(() => {
        buscarMateriais()
            .then((data) => {
                const found = data.find((mat: any) => String(mat.id) === String(id));
                setMaterial(found);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="p-8">Carregando...</div>;
    if (error) return <div className="p-8 text-red-600">Erro: {error}</div>;
    if (!material) return <div className="p-8">Material não encontrado.</div>;

    return (
        <div className="flex flex-col min-h-screen p-4">
            <div>
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    style={{
                        cursor: 'pointer'
                    }}
                    aria-label="Voltar"
                >
                    <img src={Icons.mdi_arrow_back} alt="Voltar" className="w-12 h-12" />
                </button>
            </div>
            <div
                className="flex flex-row p-4 m-8 gap-4"
                style={{
                    backgroundColor: Colors.verdeClarinho,
                    padding: '16px',
                    borderRadius: '8px',
                }}
            >
                <img
                    src={material.capa_url}
                    alt={`Capa de ${material.nome}`}
                    style={{
                        width: '100px',
                        height: 'auto',
                        borderRadius: '4px',
                    }}
                />
                <div className="flex flex-col justify-center gap-2">
                    <h2
                        style={{
                            color: '#3B3B3B',
                            fontFamily: '"Inria Serif"',
                            fontSize: '24px',
                            fontStyle: 'normal',
                            fontWeight: 700,
                            lineHeight: 'normal',
                            marginTop: '12px',
                        }}
                    >
                        {material.nome}
                    </h2>
                    <p
                        style={{
                            color: '#000',
                            fontFamily: '"Inria Serif"',
                            fontSize: '14px',
                            fontStyle: 'normal',
                            fontWeight: 700,
                            lineHeight: 'normal',
                        }}
                    >
                        {material.descricao || 'Sem descrição.'}
                    </p>
                    {material.qtd_paginas && (
                        <span style={{ color: '#666', fontSize: '13px', marginTop: '8px' }}>
                            {material.qtd_paginas} páginas
                        </span>
                    )}
                    {material.url && (
                        <button
                            onClick={handleDownload}
                            style={{
                                marginTop: '12px',
                                padding: '8px 16px',
                                backgroundColor: Colors.verdeBase,
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontFamily: '"Inria Serif"',
                                fontSize: '14px',
                                fontWeight: 600
                            }}
                        >
                            Baixar PDF
                        </button>
                    )}
                </div>
            </div>
            
            {/* Visualizador de PDF */}
            {material.url && isValidUrl(material.url) && (
                <div className="mt-8 mx-8">
                    <h3 
                        style={{
                            color: '#3B3B3B',
                            fontFamily: '"Inria Serif"',
                            fontSize: '20px',
                            fontWeight: 700,
                            marginBottom: '16px'
                        }}
                    >
                        Visualizar PDF
                    </h3>
                    <div 
                        style={{
                            border: '2px solid #ddd',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            backgroundColor: '#f5f5f5'
                        }}
                    >
                        <iframe
                            src={material.url}
                            style={{
                                width: '100%',
                                height: '600px',
                                border: 'none'
                            }}
                            title={`PDF: ${material.nome}`}
                        />
                    </div>
                    <p style={{ 
                        fontSize: '12px', 
                        color: '#666', 
                        marginTop: '8px',
                        fontStyle: 'italic'
                    }}>
                        Se o PDF não carregar acima, clique no botão "Baixar PDF" ou abra em nova aba
                    </p>
                </div>
            )}
            {!isValidUrl(material.url) && (
                <div style={{ padding: 16, color: '#666' }}>
                    URL do material inválida ou de placeholder. Você pode tentar abrir em nova aba ou contatar o administrador.
                </div>
            )}
        </div>
    );
};

export default MaterialDetalhe;