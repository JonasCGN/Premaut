import { Request, Response } from "express";

interface DBClient {
  query(sql: string, values?: any[]): Promise<any>;
}

export const usuarioController = (db: DBClient) => {
  return {
    async buscarPerfil(req: Request, res: Response) {
      try {
        // Pega o e-mail do token (ou simula por enquanto)
        const email = req.query.email || "teste@exemplo.com";

        const [rows]: any = await db.query(
          "SELECT nome, genero, telefone, email, nascimento FROM usuarios WHERE email = ?",
          [email]
        );

        if (!rows.length) {
          return res.status(404).json({ message: "Usuário não encontrado." });
        }

        return res.status(200).json(rows[0]);
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
      }
    },

    async atualizarPerfil(req: Request, res: Response) {
      try {
        const { nome, genero, telefone, email, nascimento } = req.body;

        if (!email) {
          return res.status(400).json({ message: "O campo 'email' é obrigatório." });
        }

        const [result]: any = await db.query(
          `UPDATE usuarios
           SET nome = ?, genero = ?, telefone = ?, nascimento = ?
           WHERE email = ?`,
          [nome, genero, telefone, nascimento, email]
        );

        const affected = result?.affectedRows ?? 0;
        if (affected === 0) {
          return res.status(404).json({ message: "Usuário não encontrado." });
        }

        return res.status(200).json({
          message: "Perfil atualizado com sucesso.",
          data: { nome, genero, telefone, email, nascimento },
        });
      } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
      }
    },
  };
};
