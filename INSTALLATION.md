# Cliniq — Guia de Instalação, Execução e Deploy

Este documento é o guia definitivo de instalação para compradores e desenvolvedores que adquiriram o código-fonte comercial de **Cliniq**.

---

## 1. Pré-Requisitos do Sistema

Antes de iniciar, certifique-se de que seu ambiente de desenvolvimento atende aos seguintes requisitos:

- **Node.js**: Versão `18.18.0` ou superior (recomendado `20.x LTS` ou `22.x LTS`)
- **Gerenciador de Pacotes**: `npm` (versão 9+ ou 10+), `yarn`, `pnpm` ou `bun`
- **Navegador**: Qualquer navegador moderno com suporte a ES Modules (Chrome, Safari, Firefox, Edge)
- **Editor Recomendado**: VS Code, Cursor ou WebStorm com extensões para TypeScript e Tailwind CSS

---

## 2. Passo a Passo de Instalação Local

### Passo 1: Descompactar e Entrar no Diretório
Descompacte os arquivos do pacote no diretório de sua preferência e navegue até a raiz:

```bash
cd cliniq
```

### Passo 2: Instalar as Dependências
Execute o comando de instalação para baixar todos os módulos necessários:

```bash
npm install
```

*(Caso use yarn, pnpm ou bun: `yarn install`, `pnpm install` ou `bun install`)*.

### Passo 3: Configuração do Arquivo de Ambiente (.env)
Copie o template de variáveis de ambiente:

```bash
cp .env.example .env
```

> **Nota**: Cliniq foi desenhado para **funcionar 100% pronto para uso (out-of-the-box)** mesmo sem configurar chaves de API externas! O modo de demonstração local e o motor heurístico de mobilidade operam imediatamente sem custos.

Caso deseje ativar os recursos opcionais:
- `GEMINI_API_KEY`: Para utilizar a busca em linguagem natural com a IA do Google Gemini.
- `VITE_GOOGLE_MAPS_API_KEY`: Para substituir o motor local de mobilidade pela API do Google Maps Platform.

### Passo 4: Iniciar o Servidor de Desenvolvimento
Inicie o servidor de desenvolvimento Vite:

```bash
npm run dev
```

O terminal exibirá a URL local:
```text
  VITE v8.x.x  ready in 180 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://0.0.0.0:3000/
```

Abra `http://localhost:3000` em seu navegador para explorar a aplicação.

---

## 3. Comandos Disponíveis (Scripts npm)

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento local na porta 3000 com recarregamento rápido. |
| `npm run build` | Compila os ativos estáticos otimizados para produção na pasta `/dist`. |
| `npm run lint` | Executa a verificação estrita de tipagem TypeScript (`tsc --noEmit`). |
| `npm run preview` | Inicia um servidor local para testar a pasta `/dist` compilada de produção. |
| `npm run clean` | Remove os artefatos de build anteriores (`dist/`). |

---

## 4. Como Testar e Auditar Antes do Deploy

Para validar a integridade completa do código-fonte:

```bash
# 1. Checagem de tipos estrita (Zero TypeScript Errors)
npm run lint

# 2. Compilação de produção com minificação e tree-shaking
npm run build
```

Ambos os comandos devem finalizar com código de saída 0 sem warnings impeditivos.

---

## 5. Guias de Deploy para Produção

Cliniq é uma Single Page Application (SPA) construída em React 19 e Vite, gerando arquivos estáticos HTML, CSS e JavaScript puros na pasta `dist/`.

### Opção A: Vercel
1. Instale a CLI ou conecte seu repositório no dashboard da Vercel.
2. Defina o Framework Preset como **Vite**.
3. O comando de build será `npm run build` e o Output Directory será `dist`.
4. Crie um arquivo `vercel.json` na raiz para garantir o roteamento SPA:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

### Opção B: Netlify
1. Conecte o repositório ou faça upload manual da pasta `dist/`.
2. Configure o Build Command como `npm run build` e Publish Directory como `dist`.
3. Crie um arquivo `public/_redirects`:
   ```text
   /*    /index.html   200
   ```

### Opção C: Servidor Nginx / Apache
Para hospedar em uma VPS (Ubuntu, Debian, etc.):
1. Execute `npm run build`.
2. Copie o conteúdo da pasta `dist/` para `/var/www/cliniq`.
3. Configure o bloco de servidor Nginx com rewrite para `/index.html`:
   ```nginx
   server {
       listen 80;
       server_name seudominio.com.br;
       root /var/www/cliniq;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # Cache de ativos estáticos
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
           expires 1y;
           add_header Cache-Control "public, no-transform";
       }
   }
   ```

### Opção D: Docker
Exemplo de `Dockerfile` multi-stage:
```dockerfile
# Estágio 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio 2: Nginx para servir ativos
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 6. Resolução de Problemas Comuns (Troubleshooting)

### Erro: `Port 3000 is already in use`
- **Causa**: Outro processo já está ocupando a porta 3000.
- **Solução**: Você pode matar o processo anterior ou rodar com porta alternativa:
  ```bash
  npx vite --port 3001
  ```

### Erro: Versão de Node incompatível
- **Causa**: Node.js instalado é anterior a `18.0.0`.
- **Solução**: Atualize o Node.js usando `nvm` (Node Version Manager):
  ```bash
  nvm install 20
  nvm use 20
  ```

### Estilos Tailwind não aparecem
- Cliniq utiliza Tailwind CSS v4 com `@tailwindcss/vite`.
- Certifique-se de que `src/index.css` contém `@import "tailwindcss";` e que `vite.config.ts` inclui o plugin `@tailwindcss/vite`.
