const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getStats = async (req, res) => {
  try {
    const [totalUsers, totalMeetings, pendentes, confirmadas] = await Promise.all([
      prisma.user.count(),
      prisma.meeting.count(),
      prisma.meeting.count({ where: { status: 'PENDENTE' } }),
      prisma.meeting.count({ where: { status: 'CONFIRMADA' } }),
    ]);
    res.json({ totalUsers, totalMeetings, pendentes, confirmadas });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, nome: true, email: true, role: true, curso: true, departamento: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const toggleUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Utilizador actualizado', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getStats, getAllUsers, toggleUser };
