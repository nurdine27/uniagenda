# UniAgenda
### Sistema de Agendamento de Reunioes — Universidade Zambeze
**G2ENSW1LAB2026 | MD02 Engenharia de Software**

---

## Estrutura do Projecto
```
uniagenda/
├── backend/           # Node.js + Express + Prisma + PostgreSQL
├── frontend/          # React Native + Expo
├── README.md          # Este ficheiro (Linux/Mac)
└── README_WINDOWS.md  # Guia especifico para Windows
```

---

## Guia rapido — Linux / Mac

### Pre-requisitos
- Node.js 18+ (`nvm install 18`)
- PostgreSQL instalado e a correr
- Expo Go no telemovel (Play Store / App Store)

### Backend (Terminal 1)
```bash
cd backend
npm install

# Criar base de dados (uma so vez)
psql -U postgres -c "CREATE DATABASE uniagenda;"
psql -U postgres -c "CREATE USER uniagenda_user WITH PASSWORD '123456';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE uniagenda TO uniagenda_user;"

# Migracoes e seed (uma so vez)
npx prisma migrate dev --name init
node prisma/seed.js

# Iniciar servidor
npm run dev
# -> UniAgenda API rodando na porta 3000
```

### Frontend (Terminal 2)
```bash
cd frontend

# Descobrir o teu IP local
hostname -I
# Edita src/services/api.js e substitui 10.0.2.2 pelo teu IP

npm install
npx expo start
# -> Scaneia o QR Code com o Expo Go
```

---

## Guia rapido — Windows

Ver o ficheiro **README_WINDOWS.md** incluido neste projecto.

---

## Contas de demonstracao (apos seed)

| Perfil    | Email                              | Senha  |
|-----------|------------------------------------|--------|
| Estudante | estudante@unizambeze.ac.mz         | 123456 |
| Docente   | taheer.mitha@unizambeze.ac.mz      | 123456 |
| Admin     | admin@unizambeze.ac.mz             | 123456 |

---

## Tecnologias

| Camada     | Tecnologia                     |
|------------|-------------------------------|
| Mobile     | React Native + Expo            |
| Navegacao  | React Navigation v6            |
| Backend    | Node.js + Express.js           |
| ORM        | Prisma                         |
| BD         | PostgreSQL                     |
| Auth       | JWT + bcryptjs                 |

---

*UniAgenda 2025 — Universidade Zambeze*
