"use client";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import TopBar from "@/app/components/TopBar";

export default function TelaProfessor() {
  return (
    <ProtectedRoute requiredUserType="professor">
      <ProfessorContent />
    </ProtectedRoute>
  );
}

function ProfessorContent() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <main className="flex-1 bg-white px-8 py-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Painel do Professor
          </h1>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-lg text-gray-600">
              Bem-vindo ao painel do professor! Aqui você pode gerenciar suas atividades e monitores.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
