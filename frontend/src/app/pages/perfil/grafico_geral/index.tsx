"use client";

import React, { useState, useEffect } from 'react';
import TopBar from "@/app/components/TopBarComponent";
import { useRouter } from 'next/navigation';
import './styles.css';
import Image from '@/app/components/assets/images';
import Icons from '@/app/components/assets/icons';
import { useSearchParams } from 'next/navigation';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ChartDataPoint {
  date: string;
  displayDate: string;
  incidentes: number;
  autocorrecao: number;
}

export default function HomePage() {
  const searchParams = useSearchParams();
  const pacienteId = searchParams.get('id');

  const [selectedType, setSelectedType] = useState('Filtrar');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawRelatorios, setRawRelatorios] = useState<any[]>([]);

  const options = ['INCIDENTES', 'OCORRÊNCIAS'];

  const API_BASE = process.env.NEXT_PUBLIC_URL_API || 'http://localhost:3001';

  useEffect(() => {
    if (!pacienteId) return;

    const fetchRelatorios = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/relatorios/paciente/${pacienteId}`);
        if (!res.ok) {
          if (res.status === 404) {
            setChartData([]);
            setLoading(false);
            return;
          }
          throw new Error(`Erro ${res.status} ao buscar relatórios`);
        }

        const relatorios = await res.json();
        setRawRelatorios(relatorios || []);
        // calcula gráfico inicial sem filtro
        computeChartFromRelatorios(relatorios || [], selectedType);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar gráfico');
      } finally {
        setLoading(false);
      }
    };

    fetchRelatorios();
  }, [pacienteId]);

  // Recalcula o gráfico quando o filtro mudar
  useEffect(() => {
    if (!rawRelatorios) return;
    computeChartFromRelatorios(rawRelatorios, selectedType);
  }, [selectedType, rawRelatorios]);

  // Função que processa relatórios e seta chartData conforme filtro
  const computeChartFromRelatorios = (relatorios: any[], filter: string) => {
    const grouped: Record<string, ChartDataPoint> = {};

    const normalizeTipo = (t: string) => (t || '').toLowerCase();

    const matchesFilter = (t: string) => {
      if (!filter || filter === 'Filtrar') return true;
      const lower = filter.toLowerCase();
      const tipo = normalizeTipo(t);
      if (lower.includes('incidente')) return tipo.includes('incidente');
      if (lower.includes('ocorr')) return tipo.includes('ocorr');
      if (lower.includes('observ')) return tipo.includes('observ');
      if (lower.includes('evolu')) return tipo.includes('evolu');
      return true;
    };

    relatorios.forEach((r: any) => {
      const dateIso = new Date(r.created_at).toISOString().split('T')[0];
      if (!grouped[dateIso]) {
        grouped[dateIso] = {
          date: dateIso,
          displayDate: new Date(r.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
          incidentes: 0,
          autocorrecao: 0,
        };
      }

      const tipo = normalizeTipo(r.tipo);

      // se sem filtro, contamos incidentes e autocorreção separadamente
      if (!filter || filter === 'Filtrar') {
        if (tipo.includes('incidente')) grouped[dateIso].incidentes += 1;
        else if (tipo.includes('autocorreção') || tipo.includes('autocorrecao')) grouped[dateIso].autocorrecao += 1;
      } else {
        // com filtro: se o relatório bate com o filtro, incrementa a 'incidentes' (representa a métrica selecionada)
        if (matchesFilter(r.tipo)) {
          // se for realmente incidente, conta em incidentes, senão conta em incidentes mesmo (única série de interesse)
          if (tipo.includes('incidente')) grouped[dateIso].incidentes += 1;
          else if (tipo.includes('autocorreção') || tipo.includes('autocorrecao')) grouped[dateIso].autocorrecao += 1;
          else grouped[dateIso].incidentes += 1;
        }
      }
    });

    const array = Object.values(grouped).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setChartData(array);
  };

  const router = useRouter();

  return (
    <div className="relatorio-container">
      <TopBar background_image='' />
      <div className="relatorio-content">
        <button
          className="back-button"
          onClick={() => router.back()}
          aria-label="Voltar"
        >
          <img src={Icons.mdi_arrow_back} alt="Voltar" width="54" height="54" />
        </button>

        <div className="header-section">
          <div className="type-selector">
            <div className="dropdown">
              <button
                className="type-button active"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {selectedType}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}
                >
                  <path d="M4 6L8 10L12 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="dropdown-menu">
                  {options.map((option) => (
                    <button
                      key={option}
                      className={`dropdown-item ${selectedType === option ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedType(option);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="graph-container">
            <div className="w-[70%] mx-auto flex justify-center bg-white rounded-lg p-4 h-[520px]">
              {loading ? (
                <div className="flex items-center justify-center h-full">Carregando gráfico...</div>
              ) : error ? (
                <div className="flex items-center justify-center h-full text-red-500">{error}</div>
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" vertical={false} />
                    <XAxis
                      dataKey="displayDate"
                      tick={{ fontSize: 12, fill: '#666' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 12, fill: '#666' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                      }}
                    />
                    <Legend verticalAlign="top" height={30} />
                    <Line
                      type="monotone"
                      dataKey="incidentes"
                      stroke="#ef4444"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                      name="Incidentes"
                    />
                    <Line
                      type="monotone"
                      dataKey="autocorrecao"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                      name="Autocorreção"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>Sem dados suficientes para gerar o gráfico para este paciente.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
