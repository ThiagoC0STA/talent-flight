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
      "streetAddress": "123 Main Street",
      "addressLocality": "San Francisco",
      "addressRegion": "CA",
      "postalCode": "94105",
      "addressCountry": "US"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "hello@talentflight.com",
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
      "name": "United States"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Job Opportunities",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Job Board",
            "description": "Professional job opportunities and career growth platform"
          }
        }
      ]
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://talentflight.com/jobs?query={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "areaServed": [
      {
        "@type": "Country",
        "name": "United States"
      },
      {
        "@type": "Country", 
        "name": "Canada"
      },
      {
        "@type": "Country",
        "name": "United Kingdom"
      },
      {
        "@type": "Country",
        "name": "Germany"
      },
      {
        "@type": "Country",
        "name": "Brazil"
      }
    ],
    "knowsAbout": [
      "Remote Jobs",
      "Tech Careers", 
      "Software Development",
      "Web Development",
      "Mobile Development",
      "Data Science",
      "Artificial Intelligence",
      "DevOps",
      "Product Management",
      "UI/UX Design"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
} 