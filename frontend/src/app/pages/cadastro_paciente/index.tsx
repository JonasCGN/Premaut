"use client";

import React, { useState } from "react";
import TopBar from "../../components/TopBar";
import "./styles.css";

export default function CadastroPaciente() {
    const [genero, setGenero] = useState("");
    const [suporte, setSuporte] = useState("");
    const [descricao, setDescricao] = useState("");
    const [nome, setNome] = useState("");
    const [reforcoNegativo, setReforcoNegativo] = useState("");
    const [reforcoPositivo, setReforcoPositivo] = useState("");
    const [estereotipia, setEstereotipia] = useState("");
    const [remedios, setRemedios] = useState("");

    const [nascimento, setNascimento] = useState("");
    const [comodidade, setComodidade] = useState("");
    const [telefone, setTelefone] = useState("");
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const paciente = {
            nome,
            genero,
            suporte,
            nascimento,
            comodidade,
            telefone,
            email,
            remedios,
            estereotipia,
            reforcoPositivo,
            reforcoNegativo,
            descricao,
        };
        console.log("Paciente cadastrado:", paciente);
        // TODO: enviar para API / mostrar feedback
        // exemplo: limpar campos
        // setNome(""); setGenero(""); setSuporte(""); setNascimento(""); setComodidade("");
        // setTelefone(""); setEmail(""); setRemedios(""); setEstereotipia(""); setReforcoPositivo(""); setReforcoNegativo(""); setDescricao("");
    };

    return (
        <div
            className=""
            style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
        >
            {/* TopBar fixada no topo */}
            <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}>
                <TopBar background_image="/assets/images/fundo_top_bottom.png" />
            </div>

            <div
                className="relatorio-content"
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    // Espaço para a TopBar fixa (ajuste o valor se a TopBar tiver outra altura)
                    paddingTop: 80,
                }}
            >
                <button
                    className="back-button"
                    type="button"
                    onClick={() => window.history.back()}
                >
                    <img
                        src="/assets/images/mdi_arrow-up.svg"
                        alt="Voltar"
                        width="54"
                        height="54"
                    />
                </button>

                <div style={{ marginTop: "50px", marginBottom: "50px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <h1 className="titulo" style={{ margin: 0 }}>Cadastro de Paciente</h1>

                        <div className="patient-info" style={{ display: "flex", alignItems: "center" }}>
                            <div className="circle-avatar">
                                <img
                                    src="/assets/images/mdi_user.svg"
                                    alt="Icon_perfil"
                                    style={{ width: 54, height: 54 }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <form className="form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                    <div className="campo">
                        <label htmlFor="nome">Nome</label>
                        <input
                            id="nome"
                            type="text"
                            placeholder="Digite o nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </div>

                    <div className="linha">
                        <div className="campo metade">
                            <label htmlFor="genero">Gênero</label>
                            <select
                                id="genero"
                                name="genero"
                                value={genero}
                                onChange={(e) => setGenero(e.target.value)}
                            >
                                <option value="">Selecione o gênero</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                            </select>
                        </div>

                        <div className="campo metade">
                            <label htmlFor="suporte">Nível de Suporte</label>
                            <input
                                id="suporte"
                                type="text"
                                placeholder="Digite o nível de suporte"
                                value={suporte}
                                onChange={(e) => setSuporte(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="linha">
                        <div className="campo metade">
                            <label htmlFor="nascimento">Nascimento</label>
                            <input
                                id="nascimento"
                                name="nascimento"
                                type="date"
                                value={nascimento}
                                onChange={(e) => setNascimento(e.target.value)}
                            />
                        </div>

                        <div className="campo metade">
                            <label htmlFor="comodidade">Comodidade</label>
                            <input
                                id="comodidade"
                                name="comodidade"
                                type="text"
                                placeholder="Informe a comodidade"
                                value={comodidade}
                                onChange={(e) => setComodidade(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="linha">
                        <div className="campo metade">
                            <label htmlFor="telefone">Telefone</label>
                            <input
                                id="telefone"
                                name="telefone"
                                type="tel"
                                placeholder="(99) 99999-9999"
                                value={telefone}
                                onChange={(e) => setTelefone(e.target.value)}
                            />
                        </div>

                        <div className="campo metade">
                            <label htmlFor="email">E-mail</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="email@exemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="campo" style={{ flex: 1 }}>
                        <label htmlFor="remedios">Remédios</label>
                        <textarea
                            id="remedios"
                            rows={4}
                            placeholder="Informe os remédios"
                            value={remedios}
                            onChange={(e) => setRemedios(e.target.value)}
                            style={{ height: "100%" }}
                        />
                    </div>

                    <div className="campo" style={{ flex: 1 }}>
                        <label htmlFor="estereotipia">Estereotipia</label>
                        <textarea
                            id="estereotipia"
                            rows={4}
                            placeholder="Descreva estereotipias"
                            value={estereotipia}
                            onChange={(e) => setEstereotipia(e.target.value)}
                            style={{ height: "100%" }}
                        />
                    </div>

                    <div className="campo" style={{ flex: 1 }}>
                        <label htmlFor="reforco_positivo">Reforço Positivo</label>
                        <textarea
                            id="reforco_positivo"
                            rows={4}
                            placeholder="Descreva reforços positivos"
                            value={reforcoPositivo}
                            onChange={(e) => setReforcoPositivo(e.target.value)}
                            style={{ height: "100%" }}
                        />
                    </div>

                    <div className="campo" style={{ flex: 1 }}>
                        <label htmlFor="reforco_negativo">Reforço Negativo</label>
                        <textarea
                            id="reforco_negativo"
                            rows={4}
                            placeholder="Descreva reforços negativos"
                            value={reforcoNegativo}
                            onChange={(e) => setReforcoNegativo(e.target.value)}
                            style={{ height: "100%" }}
                        />
                    </div>

                    <div className="actions">
                        <button className="submit-button" type="submit">
                            CADASTRAR
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}