# 🛍️ Brechó da Navi

Um e-commerce moderno e responsivo para um brechó de moda consciente. Este projeto une uma interface elegante para os clientes a um painel administrativo robusto para a gestão de produtos.

## 🚀 Tecnologias

### Frontend (SPA)
- **Framework**: Angular 18+
- **Estilização**: SCSS, Angular Material, Responsividade Mobile-First
- **Funcionalidades**:
  - Catálogo de produtos dinâmico
  - Sacola de compras local
  - Integração com WhatsApp para finalização de pedido
  - Painel Administrativo protegido por API Key
  - Design premium com animações e transições suaves

### Backend (BrechoApi)
- **Framework**: .NET 8 (Web API)
- **ORM**: Entity Framework Core
- **Banco de Dados**: PostgreSQL (Neon.tech)
- **Segurança**: Autenticação via Middleware de API Key
- **Documentação**: Swagger/OpenAPI

## 📂 Estrutura do Projeto

```bash
Brecho-Da-Navi/
├── BrechoApi/          # Backend .NET Core
│   ├── Data/           # Contexto do Banco e Repositórios
│   ├── Endpoints/      # Definição de rotas da API
│   ├── Migrations/     # Migrações do EF Core
│   └── appsettings.json # Configurações (excluído do tracking)
├── SPA/                # Frontend Angular
│   ├── src/app/        # Componentes e Lógica
│   ├── public/         # Ativos estáticos e Favicon
│   └── angular.json    # Configurações do Angular
└── .gitignore          # Proteção de segredos e artefatos de build
```

## 🛠️ Como Executar

### Pré-requisitos
- .NET 8 SDK
- Node.js & npm
- Angular CLI (`npm install -g @angular/cli`)

### 1. Configurar o Banco de Dados
No diretório `BrechoApi`, crie um arquivo `appsettings.json` com sua string de conexão:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=...;Database=...;Username=...;Password=...;"
  },
  "ApiKey": "sua-chave-secreta"
}
```

### 2. Rodar o Backend
```bash
cd BrechoApi
dotnet ef database update  # Aplica as migrações
dotnet run                 # Inicia a API
```
Acesse `http://localhost:5031/swagger` para ver a documentação.

### 3. Rodar o Frontend
```bash
cd SPA
npm install
ng serve                   # Inicia o servidor de desenvolvimento
```
Acesse `http://localhost:4200` no seu navegador.

## 📱 Responsividade
O projeto foi otimizado para funcionar em:
- Smartwatches e Smartphones (Mobile-First)
- Tablets
- Desktops (Wide & Ultra-Wide)

---
*Moda com consciência. Brechó da Navi &copy; 2025*
# BrechoDaNavi
