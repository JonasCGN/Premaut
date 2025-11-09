import { Request, Response } from "express";
import {
  criarPaciente,
  listarPacientes,
  buscarPacientePorId,
  deletarPaciente,
} from "../models/pacienteModel";

export async function postPaciente(req: Request, res: Response) {
  try {
    const paciente = await criarPaciente(req.body);
    res.status(201).json(paciente);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getPacientes(req: Request, res: Response) {
  try {
    const pacientes = await listarPacientes();
    res.status(200).json(pacientes);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getPacientePorId(req: Request, res: Response) {
  try {
    const paciente = await buscarPacientePorId(req.params.id);
    res.status(200).json(paciente);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
}

export async function deletePaciente(req: Request, res: Response) {
  try {
    const result = await deletarPaciente(req.params.id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
