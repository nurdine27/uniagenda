
# ⚡ UniAgenda — Guia Rápido (Windows)
> Do zero ao telemóvel em minutos.

---

## 🛠️ Pré-requisitos Rápidos
* **Node.js LTS** instalado ([Download](https://nodejs.org))
* **PostgreSQL** instalado ([Download](https://www.postgresql.org/download/windows/)) -> *Senha padrão:* `postgres`
* Telemóvel com a app **Expo Go** instalado.

---

## 🗄️ 1. Base de Dados Express
Abre o **pgAdmin 4** e execute estes 3 passos visuais:
1. Botão direito em **Databases** ➔ *Create* ➔ Name: `uniagenda` ➔ *Save*.
2. Botão direito em **Login/Group Roles** ➔ *Create*:
   * **General:** Name = `uniagenda_user`
   * **Definition:** Password = `123456`
   * **Privileges:** Ative `Can login` ➔ *Save*.
3. Botão direito na base `uniagenda` ➔ *Properties* ➔ *Security* ➔ Adicione `uniagenda_user` com privilégio `ALL` ➔ *Save*.

---

## 🟢 2. Configurar & Rodar o Backend
Abre o terminal (CMD/PowerShell) na raiz do projeto:

```powershell
cd backend
npm install

```

### Configure o `.env`

Abra o ficheiro `backend\.env` no Bloco de Notas e cole:

```env
DATABASE_URL="postgresql://uniagenda_user:123456@localhost:5432/uniagenda"
JWT_SECRET="uniagenda_super_secret_key_2026"
JWT_EXPIRES_IN="7d"
PORT=3000

```

### Alimentar o Banco e Iniciar:

```powershell
npx prisma migrate dev --name init
node prisma/seed.js
npm run dev

```

*(Deixe este terminal aberto e rodando!)*

---

## 📱 3. Configurar & Rodar o Frontend

### Passo Crítico: Descobrir o IP

Olhe para o terminal do Expo (ou digite `ipconfig` num novo terminal) e localize o seu IPv4 (ex: `192.168.43.15`).

Abra `frontend\src\services\api.js` e atualize a URL com o seu IP e a porta do **Backend (3000)**:

```javascript
const API_URL = '[http://192.168.43.15:3000/api]'; 

```

### Instalar e Iniciar:

Abre um **segundo terminal** na raiz do projeto:

```powershell
cd frontend
npm install --legacy-peer-deps
npx expo start

```

---

## 🚀 4. Conectar ao Telemóvel

1. Conecte o computador ao **Wi-Fi** ou ao **Hotspot** do próprio telemóvel.
2. Abra o **Expo Go**, selecione **"Scan QR Code"** e aponte para a tela.

> 💡 **Dica de Ouro (Se falhar a conexão ou usar Roteador do Celular):**
> Se o telemóvel travar em 0% carregando, pressione **`d`** no terminal para abrir o menu no navegador. Na barra lateral esquerda, mude a conexão de **LAN** para **Tunnel**. Um novo QR Code ultra-compatível será gerado!

---

## 👥 Contas de Teste

* **Estudante:** `sidney.jeque@unizambeze.ac.mz`  | `123456`
* **Estudante:** `augusta.mussa@unizambeze.ac.mz` | `123456`
* **Estudante:** `veloso.assuate@unizambeze.ac.mz`| `123456`
* **Docente:** `taheer.mitha@unizambeze.ac.mz`    | `123456`
* **Docente:** `felix.macueia@unizambeze.ac.mz`   | `123456`
* **Admin:** `nurdine.saide@unizambeze.ac.mz`     | `123456`

---

## Resumo de como ligar

**Terminal 1 (Backend):**

```powershell
cd backend && npm run dev

```

**Terminal 2 (Frontend):**

```powershell
cd frontend && npx expo start

```

---

*UniAgenda © 2026*

