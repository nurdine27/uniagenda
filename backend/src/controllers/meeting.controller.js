const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const userSelect = { id: true, nome: true, email: true, departamento: true, curso: true, avatar: true };

const createMeeting = async (req, res) => {
  try {
    const { docenteId, titulo, descricao, data, horaInicio, horaFim, local } = req.body;
    const meeting = await prisma.meeting.create({
      data: {
        estudanteId: req.user.id,
        docenteId: parseInt(docenteId),
        titulo, descricao,
        data: new Date(data),
        horaInicio, horaFim, local,
      },
      include: { estudante: { select: userSelect }, docente: { select: userSelect } },
    });
    res.status(201).json(meeting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMyMeetings = async (req, res) => {
  try {
    const { status } = req.query;
    const isDocente = req.user.role === 'DOCENTE';
    const where = {
      ...(isDocente ? { docenteId: req.user.id } : { estudanteId: req.user.id }),
      ...(status && { status }),
    };
    const meetings = await prisma.meeting.findMany({
      where,
      include: { estudante: { select: userSelect }, docente: { select: userSelect } },
      orderBy: { data: 'desc' },
    });
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMeetingById = async (req, res) => {
  try {
    const meeting = await prisma.meeting.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        estudante: { select: userSelect },
        docente: { select: userSelect },
        mensagens: { include: { user: { select: userSelect } }, orderBy: { createdAt: 'asc' } },
        avaliacao: true,
      },
    });
    if (!meeting) return res.status(404).json({ error: 'Reunião não encontrada' });
    res.json(meeting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateMeetingStatus = async (req, res) => {
  try {
    const { status, motivoRecusa } = req.body;
    const meeting = await prisma.meeting.update({
      where: { id: parseInt(req.params.id) },
      data: { status, ...(motivoRecusa && { motivoRecusa }) },
      include: { estudante: { select: userSelect }, docente: { select: userSelect } },
    });
    res.json(meeting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const cancelMeeting = async (req, res) => {
  try {
    const meeting = await prisma.meeting.update({
      where: { id: parseInt(req.params.id) },
      data: { status: 'CANCELADA' },
    });
    res.json(meeting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const avaliarMeeting = async (req, res) => {
  try {
    const { estrelas, comentario } = req.body;
    const avaliacao = await prisma.avaliacao.create({
      data: {
        meetingId: parseInt(req.params.id),
        userId: req.user.id,
        estrelas: parseInt(estrelas),
        comentario,
      },
    });
    res.status(201).json(avaliacao);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createMeeting, getMyMeetings, getMeetingById, updateMeetingStatus, cancelMeeting, avaliarMeeting };
