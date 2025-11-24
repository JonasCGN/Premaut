"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Importa Next Image para otimização
import { esqueciSenha, EsqueciSenhaData } from "../../../services/authService";
import "./styles.css";

const EsqueciASenha: React.FC = () => {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  const router = useRouter();

  const handleEnviarCodigo = async () => {
    if (!email) {
      setMensagem("Por favor, insira seu e-mail.");
      return;
    }

    setCarregando(true);
    setMensagem("");

    try {
      const data: EsqueciSenhaData = { email };
      await esqueciSenha(data);
      
      setMensagem("Código enviado com sucesso!");
      setTimeout(() => {
        router.push(`./codigo?email=${encodeURIComponent(email)}`);
      }, 1000);

    } catch (erro: any) {
      setMensagem(erro.message || "Erro ao enviar código.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="container">
      <div className="content">
        <div className="logo-icon">
          <Image
            src="/assets/images/logo_completa.png"
            alt="Logo PREMAUT"
            width={200} // ajuste conforme necessário
            height={60} // ajuste conforme necessário
            className="logo-img"
          />
        </div>

        <div className="login-card">
          <h2 className="login-title">Esqueceu sua senha</h2>
          <p className="login-description">
            Digite o seu e-mail para recuperar sua conta.
            Um código de confirmação será enviado para o seu e-mail.
          </p>

          <div className="campo">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email" // melhor prática usar type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            className="login-button"
            onClick={handleEnviarCodigo}
            disabled={carregando}
          >
            {carregando ? "Enviando..." : "Continuar"}
          </button>

          {mensagem && <p className="mensagem-feedback">{mensagem}</p>}

          <div className="register-link">
            <span>Não possui cadastro? </span>
            <Link href="./cadastro" className="register-link-highlight">
              Cadastre-se
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EsqueciASenha;
