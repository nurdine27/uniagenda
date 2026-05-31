const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getDisponibilidades = async (req, res) => {
  try {
    const { docenteId } = req.params;
    const disps = await prisma.disponibilidade.findMany({
      where: { docenteId: parseInt(docenteId), ativo: true },
      orderBy: [{ diaSemana: 'asc' }, { horaInicio: 'asc' }],
    });
    res.json(disps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createDisponibilidade = async (req, res) => {
  try {
    const { diaSemana, horaInicio, horaFim, duracao } = req.body;
    const disp = await prisma.disponibilidade.create({
      data: { docenteId: req.user.id, diaSemana: parseInt(diaSemana), horaInicio, horaFim, duracao: parseInt(duracao) || 30 },
    });
    res.status(201).json(disp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteDisponibilidade = async (req, res) => {
  try {
    await prisma.disponibilidade.update({
      where: { id: parseInt(req.params.id) },
      data: { ativo: false },
    });
    res.json({ message: 'Disponibilidade removida' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getDisponibilidades, createDisponibilidade, deleteDisponibilidade };
