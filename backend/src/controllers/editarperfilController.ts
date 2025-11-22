import { Request, Response } from "express";
import { SupabaseClient } from "@supabase/supabase-js";

export const usuarioController = (supabase: SupabaseClient) => {
  return {
    /**
     * GET /api/usuarios/me
     * Busca perfil do usuário autenticado
     */
    async buscarPerfil(req: Request, res: Response) {
      try {
        // Obtém o token do header Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return res.status(401).json({ message: "Token não fornecido." });
        }

        const token = authHeader.replace("Bearer ", "");

        // Valida o token com Supabase Auth
        const { data: userData, error: authError } = await supabase.auth.getUser(token);

        if (authError || !userData?.user) {
          return res.status(401).json({ message: "Token inválido ou expirado." });
        }

        const userEmail = userData.user.email;

        // Busca dados do usuário na tabela usuarios
        const { data, error } = await supabase
          .from("usuarios")
          .select("nome, genero, telefone, email, nascimento")
          .eq("email", userEmail)
          .maybeSingle();

        if (error) {
          console.error("Erro ao buscar perfil:", error);
          return res.status(500).json({ message: "Erro interno do servidor." });
        }

        if (!data) {
          return res.status(404).json({ message: "Usuário não encontrado." });
        }

        return res.status(200).json(data);
      } catch (error) {
        console.error("Erro inesperado ao buscar perfil:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
      }
    },

    /**
     * PUT /api/usuarios/me
     * Atualiza perfil do usuário autenticado
     */
    async atualizarPerfil(req: Request, res: Response) {
      try {
        // Obtém o token do header Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return res.status(401).json({ message: "Token não fornecido." });
        }

        const token = authHeader.replace("Bearer ", "");

        // Valida o token com Supabase Auth
        const { data: userData, error: authError } = await supabase.auth.getUser(token);

        if (authError || !userData?.user) {
          return res.status(401).json({ message: "Token inválido ou expirado." });
        }

        const userEmail = userData.user.email;

        // Extrai apenas os campos permitidos para atualização
        const { nome, genero, telefone, nascimento } = req.body;

        // Monta objeto com apenas os campos que foram enviados
        const updateData: any = {};
        if (nome !== undefined) updateData.nome = nome;
        if (genero !== undefined) updateData.genero = genero;
        if (telefone !== undefined) updateData.telefone = telefone;
        if (nascimento !== undefined) updateData.nascimento = nascimento;

        // Verifica se há algo para atualizar
        if (Object.keys(updateData).length === 0) {
          return res.status(400).json({ message: "Nenhum campo para atualizar." });
        }

        // Atualiza apenas o usuário autenticado
        const { data, error } = await supabase
          .from("usuarios")
          .update(updateData)
          .eq("email", userEmail)
          .select()
          .maybeSingle();

        if (error) {
          console.error("Erro ao atualizar perfil:", error);
          return res.status(500).json({ message: "Erro interno do servidor." });
        }

        if (!data) {
          return res.status(404).json({ message: "Usuário não encontrado." });
        }

        return res.status(200).json({
          message: "Perfil atualizado com sucesso.",
          data,
        });
      } catch (error) {
        console.error("Erro inesperado ao atualizar perfil:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
      }
    },
  };
};