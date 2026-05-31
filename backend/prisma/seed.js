const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed...');
  const hashedPassword = await bcrypt.hash('123456', 10);

  // Admin
  const admin = await prisma.user.upsert({
    where: { email: 'nurdine.saide@unizambeze.ac.mz' },
    update: {},
    create: {
      nome: 'Nurdine',
      email: 'nurdine.saide@unizambeze.ac.mz',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin criado:', admin.email);

  // Docente 1
  const docente1 = await prisma.user.upsert({
    where: { email: 'taheer.mitha@unizambeze.ac.mz' },
    update: {},
    create: {
      nome: 'Eng. Taheer A. Mitha',
      email: 'taheer.mitha@unizambeze.ac.mz',
      password: hashedPassword,
      role: 'DOCENTE',
      departamento: 'Engenharia de Software',
    },
  });
  console.log('Docente criado:', docente1.email);

  // Docente 2
  const docente2 = await prisma.user.upsert({
    where: { email: 'felix.macueia@unizambeze.ac.mz' },
    update: {},
    create: {
      nome: 'Felix Macueia',
      email: 'felix.macueia@unizambeze.ac.mz',
      password: hashedPassword,
      role: 'DOCENTE',
      departamento: 'Programação Web',
    },
  });
  console.log('Docente criado:', docente2.email);

  // Disponibilidades para docente1
  await prisma.disponibilidade.deleteMany({ where: { docenteId: docente1.id } });
  const dias = [1, 2, 3, 4, 5];
  for (const dia of dias) {
    await prisma.disponibilidade.create({
      data: { docenteId: docente1.id, diaSemana: dia, horaInicio: '08:00', horaFim: '12:00', duracao: 30 },
    });
    await prisma.disponibilidade.create({
      data: { docenteId: docente1.id, diaSemana: dia, horaInicio: '14:00', horaFim: '17:00', duracao: 30 },
    });
  }
  console.log('Disponibilidades criadas para', docente1.nome);

  // Disponibilidades para docente2
  await prisma.disponibilidade.deleteMany({ where: { docenteId: docente2.id } });
  for (const dia of [1, 3, 5]) {
    await prisma.disponibilidade.create({
      data: { docenteId: docente2.id, diaSemana: dia, horaInicio: '09:00', horaFim: '13:00', duracao: 45 },
    });
  }

  // Estudante
  const estudante1 = await prisma.user.upsert({
    where: { email: 'augusta.mussa@unizambeze.ac.mz' },
    update: {},
    create: {
      nome: 'Augusta Mussa',
      email: 'augusta.mussa@unizambeze.ac.mz',
      password: hashedPassword,
      role: 'ESTUDANTE',
      curso: 'Engenharia informática',
    },
  });
  console.log('Estudante criado:', estudante1.email);

  const estudante2 = await prisma.user.upsert({
    where: { email: 'veloso.assuate@unizambeze.ac.mz' },
    update: {},
    create: {
      nome: 'Veloso Carlos Assuate',
      email: 'veloso.assuate@unizambeze.ac.mz',
      password: hashedPassword,
      role: 'ESTUDANTE',
      curso: 'Engenharia informática',
    },
  });
  console.log('Estudante criado:', estudante2.email);

  const estudante3 = await prisma.user.upsert({
    where: { email: 'sidney.jeque@unizambeze.ac.mz' },
    update: {},
    create: {
      nome: 'Sidney Jeque',
      email: 'sidney.jeque@unizambeze.ac.mz',
      password: hashedPassword,
      role: 'ESTUDANTE',
      curso: 'Engenharia informática',
    },
  });
  console.log('Estudante criado:', estudante3.email);

  console.log('\nOK: Seed concluido!');
  console.log('\nContas de demonstracao:');
  console.log('  Estudante:  augusta.mussa@unizambeze.ac.mz  /  123456');
  console.log('  Estudante:  veloso.assuate@unizambeze.ac.mz  /  123456');
  console.log('  Estudante:  sidney.jeque@unizambeze.ac.mz  /  123456');
  console.log('  Docente:    taheer.mitha@unizambeze.ac.mz  /  123456');
  console.log('  Admin:      nurdine.saide@unizambeze.ac.mz  /  123456');
}

main()
  .catch((e) => { console.error('Erro no seed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
