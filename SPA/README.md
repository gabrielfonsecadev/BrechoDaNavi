# Brechó da Navi (Angular)

Guia rápido para instalar, rodar e construir o projeto Angular do Brechó da Navi.

## Pré‑requisitos
- Node.js 18.18+ ou 20+ (recomendado: LTS)
- npm 9+ (vem com o Node)
- Windows PowerShell ou Git Bash

Verifique versões:
```powershell
node -v
npm -v
```

## Instalação
1. Entre na pasta do projeto Angular:
```powershell
cd ng
```
2. Instale as dependências:
```powershell
npm install
```

## Desenvolvimento
Inicie o servidor de desenvolvimento:
```powershell
npm start
```
- Acesse: `http://localhost:4200/`
- O servidor faz reload automático ao salvar arquivos.

Se preferir CLI direta:
```powershell
npx ng serve
```

## Build de produção
Gere os artefatos otimizados em `dist/`:
```powershell
npm run build
```
O output fica em `dist/brecho-da-navi/browser/` (nome pode variar conforme `angular.json`).

Para servir o build estaticamente (opcional):
```powershell
npm i -g http-server
http-server .\dist\brecho-da-navi\browser -p 8080
```
Acesse: `http://localhost:8080/`

## Estrutura relevante
- `src/app/app.component.ts` — componente standalone principal (Angular 19), lógica de carrossel, carrinho e chat.
- `src/app/app.component.html` — template com navegação, hero, produtos, carrinho e chat.
- `src/app/app.component.scss` — estilos escopados ao componente (migrado para SCSS).
- `src/assets/` — imagens e estilos legados:
  - `imagem.png` — logo do hero.
  - `produtos/` — imagens de produtos.
  - `legacy.scss` — estilos originais incorporados via SCSS.
- `src/styles.css` — estilos globais (mínimos). A maior parte dos estilos está em `app.component.scss`.

## Dicas e solução de problemas
- Porta ocupada (4200):
  - Feche outra instância do dev server ou altere a porta: `npx ng serve --port 4300`.
- Cache do navegador:
  - Faça “hard reload” (`Ctrl+F5`) se mudanças visuais não aparecerem.
- Imagens não carregam:
  - Confirme os arquivos em `src/assets/` e caminhos no HTML (ex.: `assets/produtos/produto1.jpg`).
- Erro sobre `assets/styles.css` no console:
  - O projeto usa `app.component.scss` e `legacy.scss`. Não existe mais `assets/styles.css` sendo importado em runtime. Certifique-se de que não há `<link>` antigo em `src/index.html` (já removido) e atualize o cache do navegador.

## Comandos úteis
```powershell
# Lint (se configurado)
npm run lint

# Testes (se adicionados)
npm test

# Servir com outra porta
npx ng serve --port 4300
```

## Sobre
- Framework: Angular 19 (standalone components)
- Estilos: SCSS com escopo no `AppComponent`, preservando a identidade visual original com melhorias de layout.

Se precisar de ajuda para publicar (Firebase Hosting, Vercel, Netlify, GitHub Pages), me avise que preparo o passo‑a‑passo.
