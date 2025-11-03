import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Clock, Shield, Video, CheckCircle, ArrowRight, Phone } from "lucide-react";
import Navigation from "@/components/Navigation";
import ConfidentialBanner from "@/components/ConfidentialBanner";
import AgentSelector from "@/components/AgentSelector";
import { useTranslation } from "react-i18next";
import { useGeoLocation } from "@/hooks/useGeoLocation";
import heroBg from "@/assets/hero-bg.jpg";

const Home = () => {
  const { t, i18n } = useTranslation();
  useGeoLocation();

  const features = [
    {
      icon: Clock,
      title: t('features.availability'),
      description: t('features.availabilityDesc'),
    },
    {
      icon: Video,
      title: t('features.aiPowered'),
      description: t('features.aiPoweredDesc'),
    },
    {
      icon: Shield,
      title: t('features.secure'),
      description: t('features.secureDesc'),
    },
    {
      icon: Heart,
      title: t('features.personalized'),
      description: t('features.personalizedDesc'),
    },
  ];

  const benefits = [
    t('benefits.instant'),
    t('benefits.medication'),
    t('benefits.tracking'),
    t('benefits.referrals'),
    t('benefits.mental'),
    t('benefits.multilingual'),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <ConfidentialBanner />
      <Navigation />
      
      {/* Visible Banner Text */}
      <div className="bg-primary/10 border-y border-primary/20 py-4 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-semibold text-foreground">
            <strong>Note:</strong> Confidential and Private Property of MS International and Shah Happiness Foundation
          </p>
        </div>
      </div>
 
      {/* Hero Section */}
      <section className="relative pt-48 pb-20 lg:pt-56 lg:pb-32 overflow-visible">
        <div
          className="absolute inset-0 opacity-10 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block animate-fade-in">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Heart className="h-4 w-4" />
                {t('hero.advancedHealthcare')}
              </span>
            </div>
            
            <h1
              className={`${i18n.language !== 'en' ? 'text-3xl md:text-4xl lg:text-5xl' : 'text-4xl md:text-5xl lg:text-7xl'} px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in leading-[1.25] md:leading-[1.25] lg:leading-[1.35]`}
            >
              {t('hero.title')}
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
              {t('hero.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
              <a href="tel:+18665204146">
                <Button variant="hero" size="xl" className="rounded-full group">
                  <Phone className="mr-2 h-5 w-5" />
                  {t('hero.call247')}
                </Button>
              </a>
              <Link to="/about">
                <Button variant="outline" size="xl" className="rounded-full">
                  {t('hero.learnMore')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Agent Selection Section */}
      <AgentSelector />

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-secondary/20 to-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className={`${i18n.language !== 'en' ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-3xl lg:text-5xl'} font-bold mb-4 px-2 md:px-4 py-2 md:py-3 lg:py-4 leading-[1.35] md:leading-[1.45] lg:leading-[1.5] bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent`}
            >
              {t('features.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-gradient-to-br from-card to-card/50"
                >
                  <div className="bg-gradient-to-br from-primary to-accent p-3 rounded-xl w-fit mb-4 shadow-md">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t('benefits.title')}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t('benefits.subtitle')}
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
              <Card className="relative p-8 shadow-xl border-border/50">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                      AI
                    </div>
                    <div>
                      <p className="font-semibold">Virtual Doctor Available</p>
                      <p className="text-sm text-muted-foreground">Ready to assist you</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {["Analyzing symptoms...", "Providing recommendations...", "Connecting you to care..."].map((text, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                        <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                        <span className="text-sm text-muted-foreground">{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <Card className="relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-90" />
            <div className="relative z-10 p-12 lg:p-20 text-center text-white">
              <h2 className="text-3xl lg:text-5xl font-bold mb-6">
                {t('cta.title')}
              </h2>
              <p className="text-lg lg:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                {t('cta.subtitle')}
              </p>
              <a href="tel:+18665204146">
                <Button 
                  variant="glass" 
                  size="xl" 
                  className="rounded-full text-white border-white/30"
                >
                  {t('cta.start')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </div>
          </Card>
        </div>
      </section>

    </div>
  );
};

export default Home;
