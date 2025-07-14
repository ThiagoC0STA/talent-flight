# Configuração do Google Analytics 4

## 1. Configurar Service Account

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a Google Analytics Data API v1
4. Crie uma Service Account:
   - Vá para "IAM & Admin" > "Service Accounts"
   - Clique em "Create Service Account"
   - Dê um nome como "talentflight-ga4"
   - Adicione a role "Analytics Data Viewer"
   - Baixe o arquivo JSON da chave

## 2. Configurar Google Analytics

1. No Google Analytics, vá para "Admin" > "Property Settings"
2. Copie o Property ID (formato: 123456789)
3. Adicione a Service Account como usuário com permissões de "Viewer"

## 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` com:

```env
# Google Analytics 4 Configuration
GA4_PROPERTY_ID=properties/123456789
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json

# Google Analytics Measurement ID
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-6H0VCNQSW5
```

## 4. Implementar Autenticação OAuth2

Atualize a função `getAccessToken()` em `src/app/api/ga4/route.ts`:

```typescript
import { GoogleAuth } from 'google-auth-library';

async function getAccessToken(): Promise<string> {
  const auth = new GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  });
  
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  
  return token.token || '';
}
```

## 5. Instalar Dependências

```bash
npm install google-auth-library
```

## 6. Testar

1. Configure as credenciais
2. Reinicie o servidor
3. Acesse `/admin` para ver os dados reais do GA4

## Notas

- Os dados podem demorar algumas horas para aparecer no GA4
- Certifique-se de que o site está enviando dados para o GA4
- Em desenvolvimento, os dados mockados serão usados como fallback 