# Configuração da TheirStack API

## Visão Geral

A TheirStack é uma API que agrega vagas de **16+ fontes**, incluindo:
- LinkedIn ✅
- Indeed ✅  
- Glassdoor ✅
- AngelList ✅
- Naukri, Infojobs, etc ✅

## Vantagens

- **121M+ vagas** desde 2021
- **195 países** cobertos
- **Dados de salário** (min/max/avg)
- **Informações da empresa** (tamanho, indústria, etc)
- **Tecnologias mencionadas**
- **Free tier** disponível

## ⚠️ Importante

A TheirStack API:
- **Usa método POST** (não GET)
- **Requer filtros obrigatórios** (posted_at_max_age_days, etc)
- **Rate limit**: 300 requests/minuto
- **Consome 1 crédito** por vaga retornada

## Passo a Passo

### 1. Criar conta gratuita
- Acesse: https://theirstack.com/
- Clique em "Sign up for free"
- Preencha os dados
- Confirme o email

### 2. Obter API Key
- Faça login na plataforma
- Vá em "API Docs" ou "Developers"
- Copie sua API key
- Exemplo: `sk_live_abc123...`

### 3. Configurar no projeto
Crie/edite o arquivo `.env.local`:

```env
# TheirStack API
THEIRSTACK_API_KEY=sua_theirstack_api_key_aqui

# Outras APIs (já configuradas)
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_key_aqui
```

### 4. Testar
```bash
npm run dev
```

Acesse `/admin` > "Buscar Vagas" e teste!

## Implementação Técnica

### Método: POST
```bash
curl https://api.theirstack.com/v1/jobs/search \
  --request POST \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --data '{
    "limit": 25,
    "posted_at_max_age_days": 30,
    "job_title_or": ["frontend"],
    "remote": null
  }'
```

### Filtros Obrigatórios
Você DEVE especificar pelo menos um destes filtros:
- `posted_at_max_age_days`: Vagas dos últimos X dias
- `posted_at_gte`: Vagas a partir de uma data
- `posted_at_lte`: Vagas até uma data
- `company_name_or`: Buscar por empresa específica

## Exemplo de Resposta da API

```json
{
  "metadata": {
    "total_results": 2034,
    "truncated_results": 0
  },
  "data": [
    {
      "id": 129469901,
      "job_title": "Product Security Engineer",
      "company_object": {
        "name": "Autodesk",
        "logo": "https://...",
        "domain": "autodesk.com",
        "industry": "information technology & services",
        "employee_count": 14626
      },
      "location": "Georgia, United States",
      "remote": true,
      "salary_string": "$159.8K/yr - $258.5K/yr",
      "min_annual_salary": 159800,
      "max_annual_salary": 258500,
      "salary_currency": "USD",
      "seniority": "Mid-Level",
      "description": "Job description...",
      "url": "https://www.linkedin.com/jobs/view/...",
      "final_url": "https://autodesk.wd1.myworkdayjobs.com/..."
    }
  ]
}
```

## Planos e Preços

### Free Tier
- **Limite**: 100 requests/mês
- **Dados**: Vagas recentes
- **Perfeito para**: Testes e projetos pequenos

### Planos Pagos
- **Starter**: $99/mês - 10K requests
- **Growth**: $299/mês - 50K requests  
- **Enterprise**: Customizado

## Integração no Sistema

A TheirStack já está integrada no sistema:

1. **API Route**: `/api/external-jobs` (método POST)
2. **Componente**: `JobAggregator.tsx`
3. **Fontes**: Selecionável no admin
4. **Mapeamento**: Dados convertidos para formato padrão

## Troubleshooting

### Erro 401 (Unauthorized)
- Verifique se a API key está correta
- Confirme se a conta está ativa

### Erro 422 (Validation Error)
- Verifique se incluiu filtros obrigatórios
- Confirme formato do payload

### Erro 429 (Rate Limit)
- Aguarde alguns minutos
- Considere upgrade do plano

### Sem resultados
- Tente termos mais genéricos
- Verifique se as fontes estão selecionadas
- Confirme se os filtros obrigatórios estão corretos

## Próximos Passos

1. **Teste com free tier** primeiro
2. **Avalie a qualidade** dos dados
3. **Considere upgrade** se necessário
4. **Monitore performance** das requisições

## Suporte

- **Documentação**: https://theirstack.com/docs
- **Email**: support@theirstack.com
- **Discord**: TheirStack Community 