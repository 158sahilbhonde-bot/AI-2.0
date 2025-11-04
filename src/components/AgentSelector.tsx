import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import hindiAgentImg from "@/assets/hindi-agent.jpeg";
import englishAgentImg from "@/assets/english-agent.jpeg";
import gujratiAgentImg from "@/assets/gujrati-agent.png";
import { useNavigate } from "react-router-dom";

const AgentSelector = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleAgentSelect = (language: string) => {
    navigate(`/virtual-doctor?lang=${language}`);
  };

  // Safely resolve translations: if a key is missing i18next returns the same key,
  // so fall back to Gujarati strings when translation isn't present.
  const gujaratiTitle = t('agents.gujarati');
  const gujaratiSelect = t('agents.selectGujarati');
  const displayGujaratiTitle = gujaratiTitle === 'agents.gujarati' ? 'ગુજરાતી સહાયક' : gujaratiTitle;
  const displayGujaratiSelect = gujaratiSelect === 'agents.selectGujarati' ? 'ગુજરાતી સહાયક નિર્વાચન' : gujaratiSelect;

  return (
    <div className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className={`${i18n.language !== 'en' ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-3xl lg:text-5xl'} font-bold mb-4 px-2 md:px-4 py-3 leading-[1.35] md:leading-[1.45] bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent`}
          >
            {t('hero.selectAgent')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('agents.selectLanguage')}
          </p>
        </div>
        
  <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card 
            className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            onClick={() => handleAgentSelect('Hindi')}
          >
            <div className="aspect-square overflow-hidden">
              <img 
                src={hindiAgentImg} 
                alt="Hindi Virtual Assistant" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="p-4 md:p-6 text-center bg-gradient-to-r from-primary to-accent">
              <h3 className="text-lg md:text-xl font-bold text-white mb-2">{t('agents.hindi')}</h3>
              <Button variant="secondary" className="w-full text-sm md:text-base">
                {t('agents.selectHindi')}
              </Button>
            </div>
          </Card>

          <Card 
            className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            onClick={() => handleAgentSelect('English')}
          >
            <div className="aspect-square overflow-hidden">
              <img 
                src={englishAgentImg} 
                alt="English Virtual Assistant" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="p-4 md:p-6 text-center bg-gradient-to-r from-primary to-accent">
              <h3 className="text-lg md:text-xl font-bold text-white mb-2">{t('agents.english')}</h3>
              <Button variant="secondary" className="w-full text-sm md:text-base">
                {t('agents.selectEnglish')}
              </Button>
            </div>
          </Card>

          <Card 
            className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            onClick={() => handleAgentSelect('Gujarati')}
          >
            <div className="aspect-square overflow-hidden">
              <img 
                src={gujratiAgentImg} 
                alt="Gujarati Virtual Assistant" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="p-4 md:p-6 text-center bg-gradient-to-r from-primary to-accent">
              <h3 className="text-lg md:text-xl font-bold text-white mb-2">{displayGujaratiTitle}</h3>
              <Button variant="secondary" className="w-full text-sm md:text-base">
                {displayGujaratiSelect}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgentSelector;
