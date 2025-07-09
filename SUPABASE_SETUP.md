# Configuração do Supabase

## 1. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://zxitqabwhpwcwypomwry.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4aXRxYWJ3aHB3Y3lwb213cnd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMjQwNTMsImV4cCI6MjA2NzYwMDA1M30.swMdEvegAiSWplznume_Envzq63hC6ldjzlzZVOkrxY

# Environment
NODE_ENV=development
```

## 2. Configurar Banco de Dados

1. Acesse o painel do Supabase (https://supabase.com/dashboard)
2. Vá para o seu projeto
3. Navegue até **SQL Editor**
4. Execute o seguinte script SQL:

## 3. Estrutura da Tabela

A tabela `jobs` inclui os seguintes campos:

- `id`: UUID (chave primária)
- `title`: Título da vaga
- `company`: Nome da empresa
- `location`: Localização
- `type`: Tipo de contrato (full-time, part-time, contract, internship, freelance)
- `category`: Categoria (frontend, backend, fullstack, mobile, devops, design, product, data, ai, other)
- `experience`: Nível de experiência (junior, mid, senior, lead, executive)
- `salary_min` e `salary_max`: Faixa salarial
- `salary_currency`: Moeda (USD, EUR, BRL, etc.)
- `salary_period`: Período (hourly, daily, weekly, monthly, yearly)
- `description`: Descrição da vaga
- `requirements`: Array de requisitos
- `benefits`: Array de benefícios
- `is_remote`: Se é remoto
- `is_featured`: Se está em destaque
- `is_active`: Se está ativa
- `application_url`: URL para candidatura
- `company_logo`: URL do logo da empresa
- `tags`: Array de tags/skills
- `created_at` e `updated_at`: Timestamps

## 4. Políticas de Segurança (RLS)

O banco está configurado com Row Level Security:

- **Leitura pública**: Qualquer pessoa pode ver vagas ativas
- **Inserção**: Apenas usuários autenticados podem criar vagas
- **Atualização**: Apenas usuários autenticados podem atualizar vagas

## 5. Funcionalidades Implementadas

### Serviços (`src/lib/jobs.ts`)

- `getAllJobs()`: Buscar todas as vagas ativas
- `getFeaturedJobs()`: Buscar vagas em destaque
- `getJobById(id)`: Buscar vaga específica
- `searchJobs(filters)`: Buscar com filtros
- `createJob(job)`: Criar nova vaga
- `updateJob(id, updates)`: Atualizar vaga
- `deleteJob(id)`: Deletar vaga (soft delete)

### Páginas Atualizadas

- **Home**: Usa `getFeaturedJobs()` do Supabase
- **Jobs**: Usa `getAllJobs()` e `searchJobs()` do Supabase
- **Job Details**: Usa `getJobById()` do Supabase
- **Admin**: Usa `createJob()` do Supabase

## 6. Índices para Performance

O banco inclui índices otimizados para:

- Busca por status (ativo/destaque)
- Ordenação por data de criação
- Busca por empresa, localização, tipo, categoria
- Busca full-text em título, empresa, localização e descrição
- Busca por tags usando GIN index

## 7. Dados de Exemplo

O script SQL inclui 3 vagas de exemplo para testar a funcionalidade.

## 8. Próximos Passos

1. **Autenticação**: Implementar login/registro de usuários
2. **Upload de Logos**: Configurar storage para logos de empresas
3. **Notificações**: Implementar sistema de alertas por email
4. **Analytics**: Adicionar tracking de visualizações e candidaturas
5. **Moderação**: Sistema de aprovação de vagas
6. **API Rate Limiting**: Proteger contra spam

## 9. Troubleshooting

### Erro de Conexão

- Verifique se as variáveis de ambiente estão corretas
- Confirme se o projeto do Supabase está ativo

### Erro de Permissão

- Verifique as políticas RLS no painel do Supabase
- Confirme se a tabela foi criada corretamente

### Erro de Tipo

- Verifique se os dados estão no formato correto
- Confirme se os enums estão sendo respeitados
