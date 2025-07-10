# 🚀 SEO & Performance Tasks TalentFlight

## 1. Schema.org JobPosting nas páginas de vaga

- [ ] Adicionar dados estruturados do tipo `JobPosting` no <head> de cada vaga
- [ ] Gerar o objeto `metadata` dinâmico para cada vaga (title, description, canonical, etc)

## 2. Meta tags dinâmicas por vaga

- [ ] Garantir que cada vaga tenha meta tags únicas e otimizadas (title, description, keywords, og, twitter, canonical)

## 3. Canonical dinâmico

- [ ] Adicionar tag `<link rel="canonical">` correta em cada página de vaga

## 4. Breadcrumbs (visual + schema)

- [ ] Criar componente visual de breadcrumbs nas páginas de vaga
- [ ] Adicionar dados estruturados `BreadcrumbList` no <head>

## 5. Lazy loading em imagens

- [ ] Garantir que todas as imagens usam lazy loading (`<Image>` do Next já faz isso, mas revisar `<img>`)

## 6. Acessibilidade avançada

- [ ] Rodar Lighthouse e axe
- [ ] Corrigir eventuais problemas de contraste, labels, navegação por teclado, ARIA, etc

## 7. Sitemap dinâmico com todas as vagas

- [ ] Automatizar o next-sitemap para buscar todas as vagas do banco e gerar o sitemap.xml a cada build/deploy

## 8. Verificação de links quebrados

- [ ] Rodar um crawler para identificar links 404
- [ ] Automatizar no CI/CD se possível

## 9. Core Web Vitals no Google Analytics

- [ ] Integrar o tracking de Web Vitals no Google Analytics (GA4)

---

## 10. Monetização (AdSense)

- [ ] Só iniciar após o site estar pronto e com 50+ vagas postadas
- [ ] Criar/adicionar arquivo `ads.txt` quando for a hora
- [ ] Adicionar o código do AdSense no layout
