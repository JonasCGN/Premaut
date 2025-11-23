import express from 'express';
import cors from 'cors';
import routes from './routes';
import uploadRouter from './routes/uploadRoutes';
import relatorioRoutes from './routes/relatorioRoutes';
import materiaisRoutes from './routes/materiaisRoutes';
import usuariosRoutes from "./routes/usuarios";
import professorRoutes from "./routes/professorRoutes";
import professorMonitoresRoutes from "./routes/professorMonitoresRoutes";

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.use('/api/relatorios', relatorioRoutes);
app.use('/api/upload', uploadRouter);
app.use('/api/materiais', materiaisRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/professor", professorRoutes);
app.use("/api/professor-monitores", professorMonitoresRoutes);

export default app;