import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, AlertCircle, Check } from "lucide-react";

const DisclaimerDialog = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem("disclaimerAccepted");
    if (!hasAccepted) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    if (checked) {
      localStorage.setItem("disclaimerAccepted", "true");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gradient-to-br from-primary to-accent p-3 rounded-full">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">
                {t('disclaimer.welcome')}
              </DialogTitle>
              <DialogDescription className="text-base mt-2">
                {t('disclaimer.subtitle')}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Features */}
          <div className="space-y-4 bg-secondary/30 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold">{t('disclaimer.availableLanguage')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('disclaimer.availableLanguageDesc')}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold">{t('disclaimer.freeAccessible')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('disclaimer.freeAccessibleDesc')}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold">{t('disclaimer.aiPowered')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('disclaimer.aiPoweredDesc')}
                </p>
              </div>
            </div>
          </div>

          {/* Important Disclaimers */}
          <div className="border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">{t('disclaimer.importantDisclaimers')}</h3>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground">{t('disclaimer.disclaimer1')}</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground">{t('disclaimer.disclaimer2')}</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground">{t('disclaimer.disclaimer3')}</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground">{t('disclaimer.disclaimer4')}</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground">{t('disclaimer.disclaimer5')}</p>
              </div>
            </div>
          </div>

          {/* Property Notice */}
          <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg">
            <p className="text-sm leading-relaxed">
              {t('disclaimer.propertyNotice')}
            </p>
            <p className="text-sm font-semibold mt-3">
              {t('disclaimer.acceptTerms')}
            </p>
          </div>

          {/* Checkbox */}
          <div className="flex items-start gap-3 p-4 bg-secondary/20 rounded-lg">
            <Checkbox
              id="disclaimer-check"
              checked={checked}
              onCheckedChange={(checked) => setChecked(checked as boolean)}
              className="mt-1"
            />
            <label
              htmlFor="disclaimer-check"
              className="text-sm leading-relaxed cursor-pointer"
            >
              {t('disclaimer.checkboxText')}
            </label>
          </div>

          {/* Accept Button */}
          <Button
            onClick={handleAccept}
            disabled={!checked}
            className="w-full py-6 text-base font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
          >
            {t('disclaimer.acceptButton')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DisclaimerDialog;
