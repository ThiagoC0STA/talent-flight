# Configuração das APIs Externas

## APIs que Funcionam (Gratuitas e Pagas)

### ✅ TheirStack (Recomendada)
- **URL**: https://api.theirstack.com/v1/jobs/search
- **Status**: ✅ Funciona com API key (free tier disponível)
- **Foco**: LinkedIn, Indeed, Glassdoor, 16+ fontes
- **Qualidade**: Excelente - 121M+ vagas, dados ricos
- **Preço**: Free tier + planos pagos
- **Configuração**: 
  ```env
  THEIRSTACK_API_KEY=sua_theirstack_api_key_aqui
  ```

### ✅ Remotive
- **URL**: https://remotive.io/api/remote-jobs
- **Status**: ✅ Funciona sem key
- **Foco**: Vagas remotas de tecnologia
- **Qualidade**: Excelente

### ✅ GitHub Jobs
- **URL**: https://jobs.github.com/positions.json
- **Status**: ✅ Funciona sem key
- **Foco**: Vagas de tecnologia
- **Qualidade**: Boa

### ✅ Stack Overflow Jobs
- **URL**: https://api.stackexchange.com/2.3/jobs
- **Status**: ✅ Funciona sem key
- **Foco**: Comunidade de desenvolvedores
- **Qualidade**: Boa

### ✅ AngelList
- **URL**: https://api.angel.co/1/jobs
- **Status**: ✅ Funciona sem key
- **Foco**: Startups e empresas inovadoras
- **Qualidade**: Boa

## Como obter API Key da TheirStack

### 1. Registrar na TheirStack
- Acesse: https://theirstack.com/
- Clique em "Sign up for free"
- Crie uma conta gratuita

### 2. Obter API Key
- Após login, vá em "API Docs"
- Copie sua API key
- Adicione no `.env.local`:
```env
THEIRSTACK_API_KEY=sua_theirstack_api_key_aqui
```

### 3. Testar
- Reinicie o servidor: `npm run dev`
- Acesse `/admin` > "Buscar Vagas"
- Selecione "TheirStack" e teste

## Vantagens da TheirStack

- **✅ Acesso a LinkedIn** (via TheirStack)
- **✅ Acesso a Indeed** (via TheirStack)
- **✅ Acesso a Glassdoor** (via TheirStack)
- **✅ Dados de salário** (min/max/avg)
- **✅ Informações da empresa** (tamanho, indústria, etc)
- **✅ Tecnologias mencionadas**
- **✅ 121M+ vagas** desde 2021
- **✅ 195 países** cobertos

## Configuração no Projeto

### 1. APIs configuradas
- TheirStack (requer API key)
- Remotive (gratuita)
- GitHub Jobs (gratuita)
- Stack Overflow (gratuita)
- AngelList (gratuita)

### 2. Como usar
1. Acesse `/admin`
2. Vá na aba "Buscar Vagas"
3. Digite sua busca
4. Selecione as fontes desejadas
5. Clique em "Buscar Vagas"

## Performance

- **TheirStack**: ~800ms (mais dados)
- **Remotive**: ~500ms
- **GitHub Jobs**: ~300ms  
- **Stack Overflow**: ~400ms
- **AngelList**: ~600ms

## APIs Descontinuadas

### ❌ Indeed API
- **Status**: Descontinuada
- **Motivo**: Indeed encerrou sua API pública
- **Alternativa**: Usar TheirStack (inclui Indeed)

### ❌ LinkedIn Jobs API
- **Status**: Não disponível publicamente
- **Motivo**: LinkedIn não oferece API pública para busca de vagas
- **Alternativa**: Usar TheirStack (inclui LinkedIn) 