# UniAgenda — Guia para Windows
### Do zero até rodar no telemóvel com Expo Go

---

## Pré-requisitos
- Windows 10 ou 11
- Telemóvel Android ou iOS com Expo Go instalado
- Telemóvel e computador na **mesma rede Wi-Fi**

---

## Passo 1 — Instalar Node.js

1. Acede a: **https://nodejs.org**
2. Descarrega a versão **LTS** (recomendada)
3. Executa o instalador `.msi` e segue os passos (deixa todas as opções por defeito)
4. Abre o **Prompt de Comando (CMD)** e verifica:

```cmd
node --version
npm --version
```
Deve mostrar `v18.x.x` ou superior.

---

## Passo 2 — Instalar PostgreSQL

1. Acede a: **https://www.postgresql.org/download/windows/**
2. Clica em "Download the installer" → escolhe a versão mais recente
3. Executa o instalador:
   - **Password** do superuser postgres: define `postgres` (ou outra que te lembres)
   - **Port**: 5432 (deixa por defeito)
   - Instala todos os componentes incluindo **pgAdmin 4**
4. Após a instalação, abre o **pgAdmin 4** (fica no Menu Iniciar)

### Criar a base de dados no pgAdmin 4:
1. Abre o pgAdmin 4
2. Clica em **Servers → PostgreSQL** (introduz a password que definiste)
3. Clica com o botão direito em **Databases → Create → Database**
4. Nome: `uniagenda` → clica **Save**
5. Clica com o botão direito em **Login/Group Roles → Create → Login/Group Role**
   - Name: `uniagenda_user`
   - Password (aba Definition): `123456`
   - Privileges (aba Privileges): activa **Can login**
   - Clica **Save**
6. Clica com o botão direito na base `uniagenda → Properties → Security`
   - Adiciona `uniagenda_user` com privilégio `ALL`
   - Clica **Save**

---

## Passo 3 — Extrair o Projecto

1. Clica com o botão direito em `UniAgenda.zip`
2. Selecciona **Extrair Tudo...**
3. Escolhe uma pasta (ex: `C:\Projectos\uniagenda`)

---

## Passo 4 — Configurar o Backend

Abre o **CMD** ou **PowerShell** e executa:

```cmd
cd C:\Projectos\uniagenda\backend
npm install
```

### Editar o ficheiro .env

Abre o ficheiro `backend\.env` com o **Bloco de Notas** e confirma:

```
DATABASE_URL="postgresql://uniagenda_user:123456@localhost:5432/uniagenda"
JWT_SECRET="uniagenda_super_secret_key_2024"
JWT_EXPIRES_IN="7d"
PORT=3000
```

> Se definiste outra password para o PostgreSQL, altera o `123456` acima.

### Executar as migrações:

```cmd
npx prisma migrate dev --name init
```

### Popular com dados de teste:

```cmd
node prisma/seed.js
```
Deve aparecer: `OK: Seed concluido!`

### Iniciar o servidor:

```cmd
npm run dev
```
Deve aparecer: `UniAgenda API rodando na porta 3000`

**Deixa este CMD aberto!**

---

## Passo 5 — Descobrir o IP do Computador

Abre um **novo CMD** e executa:

```cmd
ipconfig
```

Procura a linha **"Endereço IPv4"** (ou "IPv4 Address") na secção da tua rede Wi-Fi.
Exemplo: `192.168.1.45`

**Anota este número — vais precisar no passo seguinte.**

---

## Passo 6 — Configurar o IP no Frontend

Abre o ficheiro `frontend\src\services\api.js` com o **Bloco de Notas** ou VS Code.

Procura esta linha:
```javascript
const API_URL = 'http://10.0.2.2:3000/api';
```

Substitui pelo teu IP (o que descobriste no Passo 5):
```javascript
const API_URL = 'http://192.168.1.45:3000/api';
```

Guarda o ficheiro.

---

## Passo 7 — Instalar e Iniciar o Frontend

Num **novo CMD**:

```cmd
npm install -g expo-cli
cd C:\Projectos\uniagenda\frontend
npm install
npx expo start
```

Vai aparecer um **QR Code** no terminal.

---

## Passo 8 — Instalar Expo Go no Telemóvel

- **Android**: Google Play Store → pesquisa "Expo Go" → instala
- **iOS**: App Store → pesquisa "Expo Go" → instala

### Scanear o QR Code:
1. Garante que o telemóvel está na mesma rede Wi-Fi do computador
2. Abre o Expo Go
3. Toca em **"Scan QR Code"**
4. Aponta para o QR Code no CMD
5. Aguarda — a app carrega no telemóvel!

---

## Contas de Demonstração

| Perfil | Email | Senha |
|---|---|---|
| Estudante | estudante@unizambeze.ac.mz | 123456 |
| Docente | taheer.mitha@unizambeze.ac.mz | 123456 |
| Admin | admin@unizambeze.ac.mz | 123456 |

---

## Resolução de Problemas — Windows

| Problema | Solução |
|---|---|
| `'node' não é reconhecido` | Reinstala o Node.js e reinicia o CMD |
| Erro de ligação à base de dados | Confirma que o PostgreSQL está a correr em Serviços do Windows |
| `npx não é reconhecido` | Fecha e abre o CMD novamente após instalar o Node.js |
| App não abre no telemóvel | Confirma que estão na mesma Wi-Fi e que o IP em api.js está correcto |
| Porta 3000 ocupada | No CMD: `netstat -ano \| findstr :3000` depois `taskkill /PID <numero> /F` |
| Erro no Prisma | Confirma que a base de dados `uniagenda` foi criada no pgAdmin |

---

## Resumo — Dois CMDs Simultâneos

**CMD 1 — Backend:**
```cmd
cd uniagenda\backend
npm run dev
```

**CMD 2 — Frontend:**
```cmd
cd uniagenda\frontend
npx expo start
```

---

*UniAgenda © 2025 — G2ENSW1LAB2026 — Universidade Zambeze*
