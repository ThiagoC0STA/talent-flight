# Sistema de Rate Limiting para Job Alerts

## 🚀 Visão Geral

O sistema de rate limiting previne spam de emails enviando **máximo 1 email por hora** para cada usuário, mesmo quando múltiplas vagas são adicionadas simultaneamente.

## ⚙️ Como Funciona

### 1. **Verificação de Rate Limit**
- Antes de enviar cada email, o sistema verifica se o usuário recebeu um email na última hora
- Se sim, o email é **pulado** e não enviado
- Se não, o email é enviado normalmente

### 2. **Controle por Usuário**
- Cada email de usuário tem seu próprio controle independente
- Usuários diferentes não interferem entre si
- Rate limit é baseado no campo `last_email_sent` da tabela `job_alerts`

### 3. **Logs Detalhados**
- Todos os emails pulados são logados no console
- Estatísticas disponíveis no painel admin
- Monitoramento em tempo real

## 📊 Configuração

### 1. **Executar Script SQL**
Execute o arquivo `database-update-rate-limit.sql` no SQL Editor do Supabase:

```sql
-- Adicionar campo last_email_sent na tabela job_alerts
ALTER TABLE job_alerts 
ADD COLUMN IF NOT EXISTS last_email_sent TIMESTAMP WITH TIME ZONE;

-- Adicionar índice para performance
CREATE INDEX IF NOT EXISTS idx_job_alerts_email_last_sent 
ON job_alerts(user_email, last_email_sent) 
WHERE is_active = true;
```

### 2. **Verificar Implementação**
O sistema já está implementado em:
- ✅ `src/lib/jobAlerts.ts` - Função `checkRateLimit()`
- ✅ `src/lib/jobAlerts.ts` - Função `sendJobAlertNotification()` atualizada
- ✅ `src/components/admin/RateLimitStats.tsx` - Dashboard de estatísticas

## 📈 Monitoramento

### Painel Admin (`/admin/alerts`)
- **Rate Limited**: Número de alerts atualmente limitados
- **Active Alerts**: Total de alerts ativos
- **Emails (24h)**: Emails enviados nas últimas 24 horas
- **Rate Limit %**: Percentual de alerts rate limited

### Logs do Console
```
Rate limit hit for user@example.com, skipping email
```

## 🔧 Personalização

### Alterar Intervalo de Rate Limit
Edite em `src/lib/jobAlerts.ts`:

```typescript
// Mudar de 1 hora para 30 minutos
const oneHourAgo = new Date(now.getTime() - 30 * 60 * 1000);

// Mudar para 2 horas
const oneHourAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
```

### Adicionar Rate Limit por Dia
```typescript
// Máximo 5 emails por dia
const dailyLimit = 5;
const emailsToday = await getEmailsSentToday(userEmail);
if (emailsToday >= dailyLimit) {
  return true; // Rate limit hit
}
```

## 📋 Exemplos de Uso

### Cenário 1: Adição em Lote
```
1. Adiciona 10 vagas de React
2. 50 usuários têm alert para "React"
3. Sistema verifica rate limit para cada usuário
4. Envia 1 email por usuário (não 10)
5. Próximos emails são pulados por 1 hora
```

### Cenário 2: Usuário Único
```
1. Usuário recebe email às 14:00
2. Nova vaga adicionada às 14:30
3. Sistema verifica: último email < 1 hora
4. Email é pulado
5. Vaga adicionada às 15:30
6. Sistema verifica: último email > 1 hora
7. Email é enviado
```

## 🛠️ Troubleshooting

### Problema: Rate limit não está funcionando
**Solução:**
1. Verifique se o campo `last_email_sent` foi adicionado
2. Confirme se o índice foi criado
3. Verifique logs do console

### Problema: Usuários não recebem emails
**Solução:**
1. Verifique se o alert está ativo (`is_active = true`)
2. Confirme se as keywords fazem match
3. Verifique se não está rate limited

### Problema: Estatísticas não aparecem
**Solução:**
1. Verifique se o componente `RateLimitStats` está importado
2. Confirme se as funções estão sendo chamadas
3. Verifique logs de erro no console

## 📊 Métricas Importantes

### Taxa de Rate Limit Ideal
- **< 20%**: Sistema funcionando bem
- **20-50%**: Muitas vagas sendo adicionadas
- **> 50%**: Considerar aumentar o intervalo

### Monitoramento Diário
- **Emails enviados**: Deve ser menor que total de alerts
- **Rate limit %**: Deve ser < 30% em condições normais
- **Alertas ativos**: Monitorar crescimento

## 🔄 Próximas Melhorias

1. **Rate Limit Dinâmico**: Baseado no comportamento do usuário
2. **Agregação de Emails**: Enviar resumo diário em vez de emails individuais
3. **Preferências do Usuário**: Permitir configurar frequência
4. **Notificações Push**: Alternativa aos emails
5. **Dashboard Avançado**: Gráficos de tendências

## ✅ Status da Implementação

- ✅ **Rate limiting básico**: 1 email/hora por usuário
- ✅ **Verificação eficiente**: Usando campo `last_email_sent`
- ✅ **Logs detalhados**: Console e painel admin
- ✅ **Estatísticas em tempo real**: Dashboard atualizado
- ✅ **Índices otimizados**: Performance melhorada
- ✅ **Tratamento de erros**: Fallback em caso de problemas

O sistema está **pronto para produção** e funcionando corretamente! 🚀 