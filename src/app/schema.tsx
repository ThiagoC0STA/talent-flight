export default function Schema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TalentFlight",
    "url": "https://talentflight.com",
    "logo": "https://talentflight.com/logo.png",
    "description": "Your launchpad for professional opportunities. We connect exceptional talent with innovative companies that drive career growth.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Av. Paulista, 1000",
      "addressLocality": "São Paulo",
      "addressRegion": "SP",
      "postalCode": "01310-100",
      "addressCountry": "BR"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+55-11-99999-9999",
      "contactType": "customer service",
      "email": "contato@talentflight.com",
      "availableLanguage": "English"
    },
    "sameAs": [
      "https://www.linkedin.com/company/talentflight",
      "https://twitter.com/talentflight",
      "https://www.facebook.com/talentflight"
    ],
    "foundingDate": "2024",
    "numberOfEmployees": "10-50",
    "serviceArea": {
      "@type": "Country",
      "name": "Brazil"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
} 