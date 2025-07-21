# Configuração do Resend para Envio de Emails

## Visão Geral

O Resend é um serviço de email moderno e confiável que oferece:
- **10.000 emails gratuitos** por mês
- **99.9% de deliverability**
- **API simples** e documentação clara
- **Templates HTML** suportados
- **Webhooks** para tracking

## Passo a Passo

### 1. Criar conta no Resend
- Acesse: https://resend.com/
- Clique em "Sign up"
- Crie uma conta gratuita
- Confirme seu email

### 2. Obter API Key
- Faça login no dashboard
- Vá em "API Keys"
- Clique em "Create API Key"
- Copie a chave (exemplo: `re_abc123...`)

### 3. Configurar no projeto
Adicione no arquivo `.env.local`:

```env
# Resend Configuration
RESEND_API_KEY=re_sua_api_key_aqui

# Outras configurações (já existentes)
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_key_aqui
```

### 4. Verificar domínio (Opcional)
Para usar `noreply@talentflight.com`:
- Vá em "Domains" no dashboard
- Adicione `talentflight.com`
- Configure os registros DNS
- Aguarde a verificação

### 5. Testar
```bash
npm run dev
```

Agora quando jobs forem importados e houver alerts compatíveis, emails serão enviados automaticamente!

## Funcionalidades Implementadas

### Email Template
- ✅ **Design responsivo** com CSS inline
- ✅ **Informações do job** (título, empresa, localização)
- ✅ **Keywords que deram match** destacadas
- ✅ **Botão "Apply Now"** direto para a vaga
- ✅ **Link para gerenciar alerts**

### Integração
- ✅ **API route** `/api/send-email`
- ✅ **Função `sendJobAlertNotification`** atualizada
- ✅ **Tratamento de erros** robusto
- ✅ **Logs detalhados** para debug

## Exemplo de Email

O email enviado inclui:
- **Header** com gradiente da marca
- **Título e empresa** da vaga
- **Keywords que deram match** (tags coloridas)
- **Detalhes** (localização, tipo, experiência)
- **Preview** da descrição (primeiros 300 chars)
- **Botão CTA** para aplicar
- **Footer** com links úteis

## Troubleshooting

### Erro de API Key
- Verifique se `RESEND_API_KEY` está no `.env.local`
- Confirme se a key é válida no dashboard

### Emails não chegam
- Verifique a pasta de spam
- Confirme se o domínio está verificado
- Teste com um email diferente

### Erro de CORS
- A API route está configurada corretamente
- Verifique se o servidor está rodando

## Próximos Passos

1. **Verificar domínio** para usar `noreply@talentflight.com`
2. **Configurar webhooks** para tracking
3. **Adicionar templates** para diferentes tipos de alert
4. **Implementar unsubscribe** nos emails
5. **Adicionar analytics** de abertura/clique

## Limites Gratuitos

- **10.000 emails/mês** (suficiente para testes)
- **100 domínios verificados**
- **API rate limits** generosos
- **Suporte por email** incluído 