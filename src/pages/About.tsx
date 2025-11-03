import Navigation from "@/components/Navigation";
import ConfidentialBanner from "@/components/ConfidentialBanner";
import { Card } from "@/components/ui/card";
import { Target, Users, Award, Heart } from "lucide-react";
import teamImage from "@/assets/team.jpg";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();
  
  const values = [
    {
      icon: Heart,
      title: t('about.value1Title'),
      description: t('about.value1Desc'),
    },
    {
      icon: Award,
      title: t('about.value2Title'),
      description: t('about.value2Desc'),
    },
    {
      icon: Users,
      title: t('about.value3Title'),
      description: t('about.value3Desc'),
    },
    {
      icon: Target,
      title: t('about.value4Title'),
      description: t('about.value4Desc'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <ConfidentialBanner />
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('about.title')}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              {t('about.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold">{t('about.missionTitle')}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('about.missionText1')}
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('about.missionText2')}
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
              <img
                src={teamImage}
                alt="Healthcare Team"
                className="relative rounded-2xl shadow-2xl w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('about.valuesTitle')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('about.valuesSubtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card
                  key={index}
                  className="p-8 hover:shadow-lg transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/50"
                >
                  <div className="bg-gradient-to-br from-primary to-accent p-3 rounded-xl w-fit mb-4 shadow-md">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: t('about.stat1'), label: t('about.stat1Label') },
              { number: t('about.stat2'), label: t('about.stat2Label') },
              { number: t('about.stat3'), label: t('about.stat3Label') },
              { number: t('about.stat4'), label: t('about.stat4Label') },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold">{t('about.techTitle')}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('about.techDesc')}
            </p>
            <Card className="p-8 bg-gradient-to-br from-card to-card/50 border-border/50">
              <p className="text-muted-foreground italic">
                {t('about.techQuote')}
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
