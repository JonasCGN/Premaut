import express from "express";
import cors from "cors";
import routes from "./routes/index";
import eventoRoutes from './routes/eventoRoutes';
import pacienteRoutes from './routes/pacienteRoutes';

const app = express();

// Configure CORS para aceitar requisições do Next.js
app.use(cors({
  origin: 'http://localhost:3000', // URL do seu frontend Next.js
  credentials: true
}));

app.use(express.json());

app.use('/api/eventos', eventoRoutes);
app.use('/api/pacientes', pacienteRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando: http://localhost:${PORT}`);
});