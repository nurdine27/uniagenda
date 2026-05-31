const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getDocentes = async (req, res) => {
  try {
    const { search, departamento } = req.query;
    const docentes = await prisma.user.findMany({
      where: {
        role: 'DOCENTE',
        ...(search && { nome: { contains: search, mode: 'insensitive' } }),
        ...(departamento && { departamento: { contains: departamento, mode: 'insensitive' } }),
      },
      select: { id: true, nome: true, email: true, departamento: true, avatar: true, curso: true },
    });
    res.json(docentes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDocenteById = async (req, res) => {
  try {
    const { id } = req.params;
    const docente = await prisma.user.findFirst({
      where: { id: parseInt(id), role: 'DOCENTE' },
      select: { id: true, nome: true, email: true, departamento: true, avatar: true, curso: true, disponibilidades: true },
    });
    if (!docente) return res.status(404).json({ error: 'Docente não encontrado' });
    res.json(docente);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { nome, curso, departamento } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { nome, curso, departamento },
    });
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getDocentes, getDocenteById, updateProfile };
