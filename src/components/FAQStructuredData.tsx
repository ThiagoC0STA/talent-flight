export default function FAQStructuredData() {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How often do I receive emails?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You receive emails only when we find jobs that match your keywords. No spam - just relevant opportunities. Typically, you'll get 1-3 emails per week depending on your keyword specificity and job market activity."
        }
      },
      {
        "@type": "Question",
        "name": "Can I cancel the alerts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Each email has a link to cancel the alert. You can also contact us to remove your email from the list. Cancellation is immediate and you won't receive any more emails from that specific alert."
        }
      },
      {
        "@type": "Question",
        "name": "Is my email safe?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely! Your email is only used to send job alerts. We don't share with third parties and you can cancel at any time. We follow strict privacy policies and never sell or share your personal information."
        }
      },
      {
        "@type": "Question",
        "name": "Can I create multiple alerts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! You can create as many alerts as you want with different keywords to cover different interests or technologies. For example, you could have one for 'React developer' and another for 'Python backend'."
        }
      },
      {
        "@type": "Question",
        "name": "What keywords should I use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Be specific! Instead of just 'developer', try 'React developer', 'Python backend', or 'Senior frontend developer'. Include technologies (React, Node.js, AWS), locations (remote, New York), and experience levels (senior, junior, lead)."
        }
      },
      {
        "@type": "Question",
        "name": "How quickly do I get notified?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We check for new jobs every hour and send notifications immediately when we find matches. You'll typically receive emails within 1-2 hours of a job being posted, giving you a competitive advantage."
        }
      },
      {
        "@type": "Question",
        "name": "Do you send international jobs?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! We monitor jobs from companies worldwide. You can include location keywords like 'remote', 'London', 'New York', or 'Berlin' to filter for specific locations or remote opportunities."
        }
      },
      {
        "@type": "Question",
        "name": "Is this service free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Job alerts are completely free. We believe everyone should have access to great job opportunities without any cost. We may introduce premium features in the future, but basic alerts will always remain free."
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqData),
      }}
    />
  );
} 