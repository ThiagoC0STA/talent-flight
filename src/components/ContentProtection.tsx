"use client";

import { useState, useEffect } from "react";
import { Shield, AlertTriangle } from "lucide-react";

interface ContentProtectionProps {
  children: React.ReactNode;
  jobId: string;
}

export default function ContentProtection({
  children,
  jobId,
}: ContentProtectionProps) {
  const [isBlocked, setIsBlocked] = useState(false);
  const [isHuman, setIsHuman] = useState(true);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Detectar bots e scrapers
    const detectBot = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const botPatterns = [
        "bot",
        "crawler",
        "spider",
        "scraper",
        "scraping",
        "headless",
        "phantom",
        "selenium",
        "puppeteer",
        "curl",
        "wget",
        "python",
        "requests",
        "scrapy",
      ];

      const isBot = botPatterns.some((pattern) => userAgent.includes(pattern));

      // Verificar se é um navegador real
      const hasRealBrowserFeatures =
        typeof window !== "undefined" &&
        typeof navigator !== "undefined" &&
        typeof document !== "undefined" &&
        navigator.userAgent &&
        navigator.language &&
        window.screen &&
        window.innerWidth > 0 &&
        window.innerHeight > 0;

      // Verificar comportamento suspeito
      const suspiciousBehavior =
        !hasRealBrowserFeatures ||
        !navigator.cookieEnabled ||
        !navigator.onLine ||
        window.screen.width === 0 ||
        window.screen.height === 0;

      if (isBot || suspiciousBehavior) {
        setIsBlocked(true);
        setIsHuman(false);

        return true;
      }

      return false;
    };

    // Rate limiting baseado em views
    const checkRateLimit = () => {
      const viewKey = `job_views_${jobId}`;
      const currentViews = parseInt(localStorage.getItem(viewKey) || "0");

      if (currentViews > 10) {
        // Limite de 10 views por job
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 5000);
      }

      localStorage.setItem(viewKey, (currentViews + 1).toString());
    };

    // Verificar se é humano através de interação
    const checkHumanInteraction = () => {
      let interactionCount = 0;

      const interactionEvents = ["mousemove", "click", "scroll", "keypress"];

      const handleInteraction = () => {
        interactionCount++;
        if (interactionCount > 5) {
          setIsHuman(true);
          interactionEvents.forEach((event) => {
            document.removeEventListener(event, handleInteraction);
          });
        }
      };

      interactionEvents.forEach((event) => {
        document.addEventListener(event, handleInteraction, { once: true });
      });

      // Timeout para detectar falta de interação
      setTimeout(() => {
        if (interactionCount < 3) {
          setIsHuman(false);
          setShowWarning(true);
        }
      }, 10000);
    };

    // Executar verificações
    if (!detectBot()) {
      checkRateLimit();
      checkHumanInteraction();
    }
  }, [jobId]);

  // Se bloqueado, mostrar mensagem de erro
  if (isBlocked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Access Restricted
              </h2>
              <p className="text-sm text-gray-600">Content protection active</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="font-medium text-red-700">Bot Detection</span>
              </div>
              <p className="text-sm text-red-600">
                Automated access has been detected. This content is protected
                against scraping.
              </p>
            </div>

            <div className="text-sm text-gray-600 space-y-2">
              <p>• This job listing is protected</p>
              <p>• Automated access is not allowed</p>
              <p>• Please use a real browser</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Se não é humano, mostrar aviso
  if (!isHuman && showWarning) {
    return (
      <div className="fixed top-4 right-4 bg-yellow-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-top-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm font-medium">
            Suspicious activity detected
          </span>
        </div>
      </div>
    );
  }

  // Renderizar conteúdo normalmente
  return (
    <>
      {children}

      {/* Indicador de proteção discreto */}
      <div className="fixed bottom-4 left-4 opacity-30 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Shield className="w-3 h-3" />
          <span>Protected</span>
        </div>
      </div>
    </>
  );
}
