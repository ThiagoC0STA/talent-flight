# Sistema de Tracking de Candidaturas

## Visão Geral

O TalentFlight agora inclui um sistema completo de tracking de cliques nos links de "Apply Now". Este sistema permite:

- **Rastrear cliques**: Cada clique é registrado com timestamp, user agent e referrer
- **Validar links**: Verifica automaticamente se os links estão funcionando
- **Dashboard de analytics**: Visualize estatísticas no painel admin
- **Detectar links quebrados**: Identifica links que não estão mais funcionando

## Configuração

### 1. Banco de Dados

Execute o script SQL em `database-setup.sql` no SQL Editor do Supabase:

```sql
-- Execute o arquivo database-setup.sql completo
```

### 2. Estrutura das Tabelas

#### Tabela `job_clicks`
- `id`: UUID único
- `job_id`: Referência para a vaga
- `application_url`: URL clicada
- `clicked_at`: Timestamp do clique
- `user_agent`: Navegador/dispositivo
- `referrer`: Página de origem
- `is_valid`: Se o link está funcionando
- `error_message`: Mensagem de erro se inválido

### 3. Políticas de Segurança

- **Inserção pública**: Qualquer pessoa pode registrar cliques
- **Leitura restrita**: Apenas usuários autenticados podem ver analytics

## Como Funciona

### 1. Tracking de Cliques

Quando um usuário clica em "Apply Now":

1. O clique é registrado imediatamente na tabela `job_clicks`
2. O link é aberto em nova aba
3. Em background, o sistema valida o link
4. Se o link estiver quebrado, o registro é atualizado

### 2. Validação de Links

O sistema tenta:
- Verificar se a URL é válida
- Fazer uma requisição HEAD para testar o link
- Lidar com problemas de CORS
- Marcar links inválidos automaticamente

### 3. Dashboard de Analytics

Acesse `/admin/analytics` para ver:

- **Total de cliques**: Número total de cliques
- **Cliques válidos**: Links que funcionam
- **Cliques inválidos**: Links quebrados
- **Taxa de conversão**: Percentual de links válidos
- **Desempenho por vaga**: Estatísticas detalhadas

## Uso

### Para Usuários Finais

1. Navegue até uma vaga
2. Clique em "Apply Now"
3. O link abre automaticamente
4. O tracking acontece em background

### Para Administradores

1. Acesse `/admin/analytics`
2. Visualize estatísticas gerais
3. Veja desempenho por vaga
4. Identifique links que precisam ser atualizados

## Exemplos de Casos de Uso

### 1. Link do LinkedIn
```
application_url: "https://linkedin.com/jobs/view/123456"
```
- ✅ Funciona normalmente
- ✅ Tracking registrado como válido

### 2. Link Expirado
```
application_url: "https://empresa.com/vaga-antiga"
```
- ❌ Página não encontrada
- ❌ Tracking registrado como inválido
- ⚠️ Aparece no dashboard como problema

### 3. Link de Email
```
application_url: "mailto:jobs@empresa.com"
```
- ✅ Funciona (email abre)
- ✅ Tracking registrado como válido

## Monitoramento

### Métricas Importantes

1. **Taxa de Conversão**: Ideal > 80%
2. **Links Inválidos**: Deve ser < 5%
3. **Vagas Populares**: Maior número de cliques
4. **Tendências**: Cliques por período

### Alertas

- Links com > 10 cliques inválidos
- Taxa de conversão < 60%
- Vagas sem cliques por 30 dias

## Manutenção

### Verificação Regular

1. Acesse `/admin/analytics` semanalmente
2. Verifique links com alta taxa de inválidos
3. Atualize URLs quebradas
4. Monitore tendências de cliques

### Limpeza de Dados

```sql
-- Remover cliques antigos (opcional)
DELETE FROM job_clicks 
WHERE clicked_at < NOW() - INTERVAL '1 year';
```

## Troubleshooting

### Problema: Cliques não estão sendo registrados

**Solução:**
1. Verifique se a tabela `job_clicks` existe
2. Confirme as políticas RLS
3. Verifique logs do console

### Problema: Links válidos marcados como inválidos

**Solução:**
1. Verifique se o link não tem problemas de CORS
2. Confirme se a URL está correta
3. Teste manualmente o link

### Problema: Dashboard não carrega

**Solução:**
1. Verifique se está logado no admin
2. Confirme permissões de leitura
3. Verifique conexão com Supabase

## Próximos Passos

1. **Notificações**: Alertas automáticos para links quebrados
2. **Relatórios**: Exportação de dados para análise
3. **Integração**: Conectar com Google Analytics
4. **A/B Testing**: Testar diferentes textos de botão
5. **Geolocalização**: Rastrear localização dos cliques 