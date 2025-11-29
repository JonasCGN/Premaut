"use client";
import { useState, useEffect } from "react";
import TopBar from "@/app/components/TopBarComponent";
import Icons from "@/app/components/assets/icons";
import Image from "@/app/components/assets/images";
import NextImage from "next/image";
import { listarUsuarios, buscarUsuarios, Usuario } from "../../../services/adminService";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useRouter } from 'next/navigation';

export default function TelaProfessor() {
  return (
    <ProtectedRoute requiredUserType="professor">
      <ProfessorContent />
    </ProtectedRoute>
  );
}

function ProfessorContent() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("PACIENTE");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenuUserId, setOpenMenuUserId] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<Usuario | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const filterOptions = [
    "PACIENTE",
  ];
 
  // Function to fetch users based on filter
  const fetchUsers = async (tipoUsuario: string, searchText?: string) => {
    try {
      setLoading(true);
      
      // Normalize filter to backend expected type
      const mapFilterToQueryType = (opt: string) => {
        const tipo = String(opt).toUpperCase();
        if (tipo === 'PACIENTE' || tipo === 'COMUM' || tipo === 'ALUNO') return 'comum';
        if (tipo === 'MONITOR') return 'monitor';
        if (tipo === 'PROFESSOR') return 'professor';
        if (tipo === 'FAMILIAR') return 'familia';
        return tipo.toLowerCase();
      };

      const queryTipo = mapFilterToQueryType(tipoUsuario);
      console.log('[Professor] fetchUsers queryTipo=', queryTipo, 'searchText=', searchText);

      let usuarios: Usuario[];
      if (searchText?.trim()) {
        usuarios = await buscarUsuarios({
          nome: searchText,
          tipo: queryTipo
        });
      } else {
        usuarios = await listarUsuarios({
          tipo: queryTipo
        });
      }
      
      setUsuarios(usuarios);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users when component mounts or filter changes
  useEffect(() => {
    fetchUsers(selectedFilter, searchTerm);
  }, [selectedFilter]);

  // Handle search
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement;
      setSearchTerm(target.value);
      fetchUsers(selectedFilter, target.value);
    }
  };

  const handleFilterChange = (option: string) => {
    setSelectedFilter(option);
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* TopBar */}
      <TopBar background_image={Image.fundoSomos} />

      {/* Conteúdo principal */}
      <main className="flex-1 bg-white px-8 py-10">
        {/* Barra de pesquisa e filtro */}
        <div className="flex justify-end items-center w-full">
          <div className="flex justify-end items-center gap-6 mb-12">
            {/* Campo de pesquisa */}
            <div className="flex items-center bg-white rounded-full px-5 py-3 shadow-lg w-80">
              <input
                type="text"
                placeholder="Pesquisa"
                className="flex-1 outline-none bg-transparent text-gray-700 text-lg"
                onKeyPress={handleSearch}
                defaultValue={searchTerm}
              />
              <NextImage src={Icons.lupa} alt="Buscar" width={26} height={26} />
            </div>
          </div>
        </div>

        {/* Grade de cartões */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="text-[#009B9E] text-xl">Carregando...</span>
          </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-10 mx-auto justify-center justify-items-center">
            {usuarios.length > 0 ? (
              usuarios.map((user, index) => (
                <div
                  key={user.id}
                  className="relative bg-white rounded-3xl shadow-xl p-10 w-80 h-96 flex flex-col items-center transition-transform"
                >
                  {/* Ícone três pontos */}
                  <div className="absolute top-5 right-5">
                    <button 
                      onClick={() => {
                        setOpenMenuUserId(openMenuUserId === user.id ? null : user.id);
                      }}
                    >
                      <NextImage
                        src={Icons.icone_3pontos}
                        alt="Opções"
                        width={8}
                        height={28}
                        className="object-contain"
                        style={{ 
                          cursor: "pointer" 
                        }}
                      />
                    </button>
                    
                    {/* Menu dropdown */}
                    {openMenuUserId === user.id && (
                      <div className="absolute top-8 right-0 bg-white rounded-lg shadow-xl z-10 overflow-hidden min-w-[120px]">
                        <button
                          className="w-full py-3 px-4 text-left text-sm font-medium text-gray-800 hover:bg-gray-50 border-b border-gray-200 cursor-pointer"
                          onClick={() => {
                            setOpenMenuUserId(null);
                            // Navega para a tela de edição baseada no tipo do usuário
                            const tipo = user.tipo_usuario?.toLowerCase();
                            let editPath = '/editar/usuario';
                            
                            if (tipo === 'comum' || tipo === 'paciente') editPath = '/editar/paciente';
                            else if (tipo === 'monitor') editPath = '/editar/monitor';
                            else if (tipo === 'professor') editPath = '/editar/professor';
                            else if (tipo === 'familia' || tipo === 'familiar') editPath = '/editar/familia';
                            
                            router.push(`${editPath}?id=${user.id}`);
                          }}
                        >
                          Editar
                        </button>
                        
                        <button
                          className="w-full py-3 px-4 text-left text-sm font-medium text-red-600 hover:bg-red-50 cursor-pointer"
                          onClick={() => {
                            setOpenMenuUserId(null);
                            setUserToDelete(user);
                            setShowDeleteConfirm(true);
                          }}
                        >
                          Excluir
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Foto de perfil */}
                  <NextImage
                    src={Icons.circuloPerfil}
                    alt="Perfil"
                    width={100}
                    height={100}
                    className="mb-6"
                  />

                  {/* Nome */}
                  <p className="text-2xl font-semibold text-gray-800 mb-6">
                    {user.nome}
                  </p>

                  {/* Botão */}
                  <button
                    className="bg-[#009B9E] text-white rounded-full px-6 py-3 text-base font-semibold shadow-md hover:bg-[#007f80] transition"
                    style={{
                      cursor: "pointer"
                    }}
                    onClick={() => {
                      // Professor só pode ver pacientes
                      console.log('[Professor] Verificar perfil click', { userId: user.id, path: '/perfil/paciente' });
                      router.push(`/perfil/paciente?id=${user.id}`);
                    }}
                  >
                    Verificar perfil
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 text-xl">
                Nenhum usuário encontrado para este filtro
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal de confirmação de exclusão */}
      {showDeleteConfirm && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Confirmar Exclusão
            </h2>
            <p className="text-gray-600 mb-6">
              Deseja realmente excluir o usuário <strong>{userToDelete.nome}</strong>? 
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setUserToDelete(null);
                }}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                onClick={() => {
                  console.log('Confirmando exclusão do usuário:', userToDelete);
                  // Aqui você pode adicionar a lógica de exclusão do usuário
                  // Exemplo: await excluirUsuario(userToDelete.id);
                  setShowDeleteConfirm(false);
                  setUserToDelete(null);
                  // Refresh da lista de usuários após exclusão
                  fetchUsers(selectedFilter, searchTerm);
                }}
              >
                Sim, desejo excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
