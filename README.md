# Bridge — Dual-Evidence Skill Verification Engine

Mobile-optimized, dual-evidence skill verification platform bridging traditional vocational training with market requirements.

## Running Locally on Your Machine

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm** (or **pnpm** / **yarn** / **bun**)

### 1. Download or Clone the Codebase
You can download the project via AI Studio's **Settings > Export (ZIP or GitHub)**, or clone the repository to your local computer.

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your optional Gemini API key if you want live AI reasoning (the app also contains automatic robust simulation fallbacks):
```env
GEMINI_API_KEY="your-gemini-api-key"
```

### 4. Start the Development Server
```bash
npm run dev
```
The full-stack development server will boot on:
**`http://localhost:3000`**

### 5. Production Build & Execution
To verify or run the production build:
```bash
npm run build
npm start
```
This compiles the client via Vite and bundles `server.ts` into `dist/server.cjs`.
