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
                </div>
            </div>
        </div>
    );
};

export default MaterialDetalhe;