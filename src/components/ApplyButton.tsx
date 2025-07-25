"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import Button from "@/components/ui/Button";
import { linkValidator } from "@/lib/linkValidator";
import { useAnalytics } from "@/hooks/useAnalytics";

interface ApplyButtonProps {
  jobId: string;
  applicationUrl: string;
  jobTitle?: string;
  company?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

export default function ApplyButton({
  jobId,
  applicationUrl,
  jobTitle,
  company,
  className = "",
  size = "lg",
  onClick,
}: ApplyButtonProps) {
  const [isTracking, setIsTracking] = useState(false);
  const { trackApply } = useAnalytics();

  const handleClick = async () => {
    if (isTracking) return;

    setIsTracking(true);

    try {
      // Registrar o clique e validar o link
      await linkValidator.validateAndUpdateClick(jobId, applicationUrl);

      // Track no Google Analytics
      if (jobTitle && company) {
        trackApply(jobTitle, company);
      }
    } catch (error) {
      console.error("Erro ao processar clique:", error);
      // Mesmo com erro, continuar
    } finally {
      setIsTracking(false);
    }
    
    if (onClick) {
      onClick();
    }
    // Sempre abrir o link, independente do tracking
    window.open(applicationUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Button
      onClick={handleClick}
      className={className}
      size={size}
      disabled={isTracking}
    >
      {isTracking ? "Aplicando..." : "Apply Now"}
      <ExternalLink className="w-4 h-4 ml-2" />
    </Button>
  );
}
