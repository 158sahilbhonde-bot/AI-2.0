import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import ConfidentialBanner from "@/components/ConfidentialBanner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Maximize, Minimize } from "lucide-react";

interface UserInfo {
  name: string;
  age: string;
  gender: string;
  language: string;
}

const VirtualDoctor = () => {
  const [searchParams] = useSearchParams();
  const language = searchParams.get('lang') || 'English';
  const [agentTargetId, setAgentTargetId] = useState<string>("did-agent-target");
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setAgentTargetId(`did-agent-target-${Date.now()}`);
  }, [language]);

  useEffect(() => {
    if (!agentTargetId) return;

    const clientKey =
      "YXV0aDB8NjhmNTQ5Njc4NGIwYTcyOGI0NGQyODExOmhMaVJ2eHQ0d1Fia1NKTWg1VEJoOA==";
    const englishAgentId = "v2_agt_yrQiTlnz";
    const hindiAgentId = "v2_agt_M-FVJ1Tg";

    const targetContainer = document.getElementById(agentTargetId);
    if (!targetContainer) return;

    // Aggressive cleanup before loading (remove prior embeds and assets)
    const cleanup = () => {
      document.querySelectorAll("did-agent").forEach((el) => el.remove());
      document.querySelectorAll("iframe[data-did-english]").forEach((el) => el.remove());
      document
        .querySelectorAll('script[src^="https://agent.d-id.com/v2/index.js"]')
        .forEach((s) => s.remove());
      document
        .querySelectorAll('link[href*="agent.d-id.com"], link[href*="d-id.com"]')
        .forEach((l) => l.remove());
        targetContainer.innerHTML = "";
      };
 
      cleanup();
 
      // Show loader
      targetContainer.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:16px;">
          <div style="height:40px;width:40px;border-radius:50%;border:4px solid rgba(0,0,0,0.08);border-top-color:rgba(99,102,241,1);animation:spin 1s linear infinite;"></div>
          <p style="font-size:14px;color:#6b7280;margin:0;">Loading Virtual Assistant...</p>
        </div>
        <style>@keyframes spin{to{transform:rotate(360deg);}}</style>
      `;

    // Hindi agent → use D-ID script with robust retry and loader reset
    if (language === "Hindi") {
      let attempts = 0;
      const maxAttempts = 3;
      const timers: number[] = [];

      const setLoader = () => {
        const c = document.getElementById(agentTargetId);
        if (!c) return;
          c.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:16px;">
              <div style="height:40px;width:40px;border-radius:50%;border:4px solid rgba(0,0,0,0.08);border-top-color:rgba(99,102,241,1);animation:spin 1s linear infinite;"></div>
              <p style="font-size:14px;color:#6b7280;margin:0;">Loading Virtual Assistant...</p>
            </div>
            <style>@keyframes spin{to{transform:rotate(360deg);}}</style>
          `;
      };

      const tryMount = () => {
        cleanup();
        setLoader();

        const script = document.createElement("script");
        script.type = "module";
        script.src = `https://agent.d-id.com/v2/index.js?v=${Date.now()}-${attempts}`;
        script.setAttribute("data-mode", "full");
        script.setAttribute("data-client-key", clientKey);
        script.setAttribute("data-agent-id", hindiAgentId);
        script.setAttribute("data-name", "did-agent");
        script.setAttribute("data-monitor", "true");
        script.setAttribute("data-target-id", agentTargetId);
        document.body.appendChild(script);

        const verifyId = window.setTimeout(() => {
          const container = document.getElementById(agentTargetId);
          const hasAgent = !!container?.querySelector("did-agent, iframe[src*='agent.d-id.com']");
          if (!hasAgent && attempts < maxAttempts) {
            attempts++;
            tryMount();
          }
        }, 5000);
        timers.push(verifyId);
      };

      const startId = window.setTimeout(() => {
        attempts = 0;
        tryMount();
      }, 120);
      timers.push(startId);

      return () => {
        timers.forEach((t) => clearTimeout(t));
        cleanup();
      };
    }

    // English agent → iframe method
    const iframe = document.createElement("iframe");
    iframe.src = `https://studio.d-id.com/agents/share?id=${encodeURIComponent(
      englishAgentId
    )}&utm_source=copy&key=WVhWMGFEQjhOamhtTlRRNU5qYzROR0l3WVRjeU9HSTBOR1F5T0RFeE9taE1hVkoyZUhRMGQxRmlhMU5LVFdnMVZFSm9PQT09`;
    iframe.allow = "microphone; camera; autoplay";
    iframe.allowFullscreen = true;
    iframe.setAttribute("data-did-english", "true");

    // Responsive landscape frame
    Object.assign(targetContainer.style, {
      position: "relative",
      width: "90vw",
      height: "50vw",
      maxWidth: "1000px",
      maxHeight: "560px",
      margin: "0 auto",
      overflow: "hidden",
      borderRadius: "16px",
      background: "transparent",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    });

    // Centered, less zoom, fits container width
    Object.assign(iframe.style, {
      width: "1500px",
      height: "900px",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%) scale(0.78)", // ✅ reduced zoom
      transformOrigin: "center center",
      border: "none",
    });

    targetContainer.innerHTML = "";
    targetContainer.appendChild(iframe);

    return () => {
      cleanup();
    };
  }, [agentTargetId, language]);

  const toggleFullscreen = () => {
    const element = document.getElementById(agentTargetId);
    if (!element) return;

    if (!isFullscreen) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <ConfidentialBanner />
      <Navigation />

      <section className="pb-12 md:pb-20 pt-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Card className="overflow-hidden shadow-2xl border-border/50">
              <div className="bg-gradient-to-r from-primary to-accent p-4 md:p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-xl md:text-2xl font-bold">
                      AIHealthHappiness Virtual Assistant - {language}
                    </h2>
                    <p className="text-white/90 mt-1 md:mt-2 text-sm md:text-base">
                      Powered by advanced AI technology
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleFullscreen}
                    className="text-white hover:bg-white/20 ml-2"
                  >
                    {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
              <div className="relative bg-gradient-to-br from-secondary/20 to-primary/5">
                <div
                  id={agentTargetId}
                  key={agentTargetId}
                  className="w-full aspect-video flex items-center justify-center text-muted-foreground text-sm md:text-base lg:text-lg"
                  style={{ minHeight: isFullscreen ? "100vh" : "400px" }}
                >
                  <div className="flex flex-col items-center justify-center gap-3 p-4">
                    <div className="h-8 w-8 md:h-10 md:w-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                    <p className="text-xs md:text-sm">Loading Virtual Assistant...</p>
                  </div>
                </div>
              </div>
              <div className="bg-secondary/30 p-4 md:p-6 border-t border-border">
                <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                  <span className="font-medium">
                    Virtual Assistant is online and ready to help
                  </span>
                </div>
              </div>
            </Card>

            <Card className="mt-6 md:mt-8 p-4 md:p-6 bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground text-sm md:text-base">
                    Important Healthcare Notice
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    This virtual assistant service provides health information and preliminary guidance only.
                    It is not a substitute for professional medical advice, diagnosis, or treatment. Always
                    consult with qualified healthcare providers for medical concerns.
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    <strong>In case of emergency:</strong> Call your local emergency services immediately.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VirtualDoctor;
