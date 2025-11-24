"use client";

import React, { useState } from "react";
import "./styles.css";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { verificarCodigo, VerificarCodigoData } from "../../../services/authService";

const Codigo: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email") || "";

  const [codigo, setCodigo] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState<"erro" | "sucesso" | "">("");
  const [carregando, setCarregando] = useState(false);

  const handleVerificarCodigo = async () => {
    if (!codigo) {
      setMensagem("Digite o código enviado para o e-mail.");
      setTipoMensagem("erro");
      return;
    }

    if (!email) {
      setMensagem("Link inválido. Solicite novamente o código de recuperação.");
      setTipoMensagem("erro");
      return;
    }

    setCarregando(true);
    setMensagem("");

    try {
      const API_BASE = process.env.NEXT_PUBLIC_URL_API || 'http://localhost:3001';
      const response = await fetch(`${API_BASE}/api/usuarios/verificar-codigo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, codigo }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem("Código verificado com sucesso!");
        setTipoMensagem("sucesso");


      setTimeout(() => {
        router.push(`./redefinir_senha?email=${email}&codigo=${codigo}`);
      }, 1000);
    } catch (error: any) {
      setMensagem(error.message || "Erro de conexão com o servidor.");
      setTipoMensagem("erro");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="container">
      <div className="content">
        <div className="logo-icon">
          <img
            src="/assets/images/logo_completa.png"
            alt="Logo PREMAUT"
            className="logo-img"
          />
        </div>

        <div className="login-card">
          <div className="login-title">Esqueceu sua senha</div>
          <div className="login-description">
            Digite o código que mandamos para seu e-mail <b>({email})</b>.
          </div>

          <div className="campo">
            <label htmlFor="codigo">Código</label>
            <input
              id="codigo"
              type="text"
              placeholder="Digite o código"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
            />
          </div>

          <button
            onClick={handleVerificarCodigo}
            className="login-button"
            disabled={carregando}
          >
            {carregando ? "Verificando..." : "Verificar Código"}
          </button>

          {mensagem && (
            <p className={`mensagem-feedback ${tipoMensagem === "erro" ? "erro" : "sucesso"}`}>
              {mensagem}
            </p>
          )}

          <div className="register-link">
            <span>Não possui cadastro? </span>
            <Link href="./cadastro" className="register-link-highlight">
              <span>Cadastre-se</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Codigo;
