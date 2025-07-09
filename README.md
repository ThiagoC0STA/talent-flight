# TalentFlight 🛩️

**Sua plataforma de lançamento para oportunidades profissionais.**

TalentFlight é um job board moderno e elegante que conecta profissionais talentosos com empresas inovadoras. Não é apenas mais um job board — é sua plataforma de lançamento para o próximo passo na carreira.

## ✨ Características

- 🎨 **Design Moderno**: Interface limpa e profissional com foco na experiência do usuário
- 🔍 **Busca Inteligente**: Filtros por localização, tags e busca por texto
- 📱 **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- 📝 **Markdown Support**: Descrições de vagas com formatação rica
- 🎯 **SEO Ready**: Otimizado para motores de busca e compartilhamento social
- 📊 **AdSense Ready**: Layout preparado para integração de anúncios
- ⚡ **Performance**: Construído com Next.js 15 e Tailwind CSS 4

## 🚀 Tecnologias

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Icons**: Lucide React
- **Markdown**: markdown-it
- **Fonts**: Inter + Playfair Display

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router pages
│   ├── admin/             # Admin page for posting jobs
│   ├── job/[slug]/        # Individual job details
│   ├── jobs/              # All jobs listing
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── not-found.tsx      # 404 page
├── components/            # Reusable components
│   ├── Header.tsx         # Navigation header
│   ├── Footer.tsx         # Site footer
│   ├── JobCard.tsx        # Job listing card
│   └── AdPlaceholder.tsx  # Ad space placeholders
├── data/                  # Mock data
│   └── jobs.ts           # Job data and utilities
└── types/                # TypeScript definitions
    └── job.ts            # Job interface
```

## 🎯 Páginas Principais

### 1. Home (`/`)
- Hero section com branding
- Vagas em destaque
- Newsletter signup
- Banner de anúncio

### 2. Todas as Vagas (`/jobs`)
- Lista completa de vagas
- Filtros por localização e tags
- Busca por texto
- Anúncios inline

### 3. Detalhes da Vaga (`/job/[slug]`)
- Descrição completa com markdown
- Informações da empresa
- Botão de candidatura
- Sidebar com anúncios

### 4. Admin (`/admin`)
- Formulário para postar vagas
- Validação de campos
- Preview de markdown
- Dicas para boas descrições

## 🎨 Design System

### Cores
- **Primary**: Blue-600 (#2563eb)
- **Secondary**: Purple-600 (#9333ea)
- **Background**: White (#ffffff)
- **Text**: Gray-900 (#111827)

### Tipografia
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

### Componentes
- Cards com sombras suaves
- Botões com estados hover
- Formulários com validação visual
- Tags coloridas para categorização

## 🚀 Como Executar

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd talentflight
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute em desenvolvimento**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador**
   ```
   http://localhost:3000
   ```

## 📈 Próximos Passos

### Funcionalidades Futuras
- [ ] Autenticação de usuários
- [ ] Dashboard para empresas
- [ ] Sistema de candidaturas
- [ ] Notificações por email
- [ ] Integração com AdSense
- [ ] Analytics e métricas
- [ ] API REST para integrações
- [ ] Sistema de reviews de empresas

### Melhorias Técnicas
- [ ] Testes automatizados
- [ ] PWA capabilities
- [ ] Cache e performance
- [ ] Internacionalização
- [ ] Dark mode
- [ ] Acessibilidade avançada

## 🎯 Objetivos do MVP

✅ **Funcional**: Job board completo com dados mock
✅ **Responsivo**: Funciona em todos os dispositivos
✅ **SEO Ready**: Meta tags e Open Graph configurados
✅ **Ad Ready**: Layout preparado para anúncios
✅ **Scalable**: Fácil de expandir com backend real
✅ **Professional**: Design moderno e elegante

## 📝 Licença

Este projeto é um MVP para demonstração. Sinta-se livre para usar como base para seus próprios projetos.

---

**TalentFlight** - Seu talento, pronto para decolar! ✈️
