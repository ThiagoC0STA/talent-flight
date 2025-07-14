import { supabase } from "./supabase";

// Serviço para validar links de aplicação
export const linkValidator = {
  async validateUrl(url: string): Promise<{
    isValid: boolean;
    errorMessage?: string;
  }> {
    try {
      // Verificar se é uma URL válida
      const urlObj = new URL(url);

      // Verificar se é HTTP ou HTTPS
      if (!["http:", "https:"].includes(urlObj.protocol)) {
        return { isValid: false, errorMessage: "URL deve usar HTTP ou HTTPS" };
      }

      // Para links de email, consideramos sempre válidos
      if (url.startsWith("mailto:")) {
        return { isValid: true };
      }

      // Tentar fazer uma requisição para verificar se o link está ativo
      try {
        await fetch(url, {
          method: "HEAD",
          mode: "no-cors", // Para evitar problemas de CORS
          cache: "no-cache",
        });

        return { isValid: true };
      } catch (fetchError) {
        // Se há erro de CORS, ainda pode ser um link válido
        if (
          fetchError instanceof TypeError &&
          fetchError.message.includes("CORS")
        ) {
          return { isValid: true };
        }
        throw fetchError;
      }
    } catch (error) {
      console.error("Erro ao validar URL:", error);
      return {
        isValid: false,
        errorMessage: "Link não acessível ou inválido",
      };
    }
  },

  async validateAndUpdateClick(jobId: string, applicationUrl: string) {
    try {
      // Primeiro registrar o clique
      const { data: clickData, error: clickError } = await supabase
        .from("job_clicks")
        .insert({
          job_id: jobId,
          application_url: applicationUrl,
          clicked_at: new Date().toISOString(),
          user_agent:
            typeof window !== "undefined" ? window.navigator.userAgent : null,
          referrer: typeof window !== "undefined" ? document.referrer : null,
          is_valid: true, // Inicialmente assumimos que é válido
          error_message: null,
        })
        .select()
        .single();

      if (clickError) {
        console.error("Erro ao registrar clique:", clickError);
        return false;
      }

      // Em background, validar o link
      this.validateUrl(applicationUrl).then(async (validation) => {
        if (!validation.isValid) {
          // Atualizar o clique como inválido
          await supabase
            .from("job_clicks")
            .update({
              is_valid: false,
              error_message: validation.errorMessage,
            })
            .eq("id", clickData.id);
        }
      });

      return true;
    } catch (error) {
      console.error("Erro ao processar clique:", error);
      return false;
    }
  },
};

// Importar supabase
