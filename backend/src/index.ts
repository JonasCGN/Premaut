import express from "express";
import cors from "cors";
import routes from "./routes/index";

const app = express();

// Configure CORS para aceitar requisições do Next.js
app.use(cors({
  origin: 'http://localhost:3000', // URL do seu frontend Next.js
  credentials: true
}));

app.use(express.json());

app.use("/api", routes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando: http://localhost:${PORT}`);
});