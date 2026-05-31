const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sendMessage = async (req, res) => {
  try {
    const { texto } = req.body;
    const message = await prisma.message.create({
      data: { meetingId: parseInt(req.params.meetingId), userId: req.user.id, texto },
      include: { user: { select: { id: true, nome: true, avatar: true, role: true } } },
    });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: { meetingId: parseInt(req.params.meetingId) },
      include: { user: { select: { id: true, nome: true, avatar: true, role: true } } },
      orderBy: { createdAt: 'asc' },
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { sendMessage, getMessages };
