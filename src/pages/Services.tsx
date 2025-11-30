import { useState } from "react";
import Navigation from "@/components/Navigation";
import ConfidentialBanner from "@/components/ConfidentialBanner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Stethoscope,
  Heart,
  Brain,
  Pill,
  Activity,
  MessageCircle,
  FileText,
  Users,
  Clock,
  Shield,
  Globe,
  CheckCircle,
  BookOpen,
  Search,
  UserCheck,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DiseaseSearch } from "@/components/DiseaseSearch";
import { SymptomChecker } from "@/components/SymptomChecker";

import { commonDiseasesIndia } from "@/data/commonDiseases";

type ActiveTool = "disease" | "symptom";

const Services = () => {
  const { t } = useTranslation();
  const [activeTool, setActiveTool] = useState<ActiveTool>("disease");
  
  const services = [
    {
      icon: Stethoscope,
      title: t('services.service1Title'),
      description: t('services.service1Desc'),
      features: [t('services.service1Feature1'), t('services.service1Feature2'), t('services.service1Feature3')],
    },
    {
      icon: Heart,
      title: t('services.service2Title'),
      description: t('services.service2Desc'),
      features: [t('services.service2Feature1'), t('services.service2Feature2'), t('services.service2Feature3')],
    },
    {
      icon: Pill,
      title: t('services.service3Title'),
      description: t('services.service3Desc'),
      features: [t('services.service3Feature1'), t('services.service3Feature2'), t('services.service3Feature3')],
    },
    {
      icon: Brain,
      title: t('services.service4Title'),
      description: t('services.service4Desc'),
      features: [t('services.service4Feature1'), t('services.service4Feature2'), t('services.service4Feature3')],
    },
    {
      icon: Activity,
      title: t('services.service5Title'),
      description: t('services.service5Desc'),
      features: [t('services.service5Feature1'), t('services.service5Feature2'), t('services.service5Feature3')],
    },
    {
      icon: FileText,
      title: t('services.service6Title'),
      description: t('services.service6Desc'),
      features: [t('services.service6Feature1'), t('services.service6Feature2'), t('services.service6Feature3')],
    },
  ];

  const additionalFeatures = [
    {
      icon: Clock,
      title: t('services.feature1Title'),
      description: t('services.feature1Desc'),
    },
    {
      icon: Shield,
      title: t('services.feature2Title'),
      description: t('services.feature2Desc'),
    },
    {
      icon: Globe,
      title: t('services.feature3Title'),
      description: t('services.feature3Desc'),
    },
    {
      icon: Users,
      title: t('services.feature4Title'),
      description: t('services.feature4Desc'),
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
              {t('services.title')}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              {t('services.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card
                  key={index}
                  className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 bg-gradient-to-br from-card to-card/50"
                >
                  <div className="bg-gradient-to-br from-primary to-accent p-3 rounded-xl w-fit mb-4 shadow-md">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">{t('services.whyChooseTitle')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('services.whyChooseSubtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="p-6 text-center hover:shadow-lg transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/50"
                >
                  <div className="bg-gradient-to-br from-primary to-accent p-3 rounded-xl w-fit mb-4 mx-auto shadow-md">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Health Tools Section - Disease Search & Symptom Checker */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              {t('services.healthGuidanceTitle')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              {t('services.healthGuidanceSubtitle')}
            </p>

            {/* Toggle Buttons */}
            <div className="flex justify-center gap-4 mb-8">
              <Button
                variant={activeTool === "disease" ? "default" : "outline"}
                size="lg"
                className="gap-2 min-w-[180px]"
                onClick={() => setActiveTool("disease")}
              >
                <Search className="h-5 w-5" />
                Disease Search
              </Button>
              <Button
                variant={activeTool === "symptom" ? "default" : "outline"}
                size="lg"
                className="gap-2 min-w-[180px]"
                onClick={() => setActiveTool("symptom")}
              >
                <UserCheck className="h-5 w-5" />
                Symptom Checker
              </Button>
            </div>
          </div>

          {/* Tool Content */}
          <div className="max-w-5xl mx-auto">
            <Card className={activeTool === "disease" ? "overflow-visible" : "overflow-hidden"}>
              {activeTool === "disease" ? (
                <div className="p-6 overflow-visible">
                  <DiseaseSearch />
                </div>
              ) : (
                <SymptomChecker />
              )}
            </Card>
          </div>
        </div>
      </section>

      {/* 50 Common Diseases Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
              <h2 className="text-3xl lg:text-4xl font-bold">
                {t('services.commonDiseasesTitle')}
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('services.commonDiseasesSubtitle')}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {commonDiseasesIndia.map((disease, index) => (
                  <AccordionItem key={index} value={`disease-${index}`}>
                    <AccordionTrigger className="text-left hover:text-primary">
                      <span className="font-semibold">{disease.name}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <div>
                          <h4 className="font-semibold text-primary mb-2">Description:</h4>
                          <p className="text-muted-foreground">{disease.description}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-primary mb-2">Symptoms:</h4>
                          <p className="text-muted-foreground">{disease.symptoms}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-primary mb-2">Prevention:</h4>
                          <p className="text-muted-foreground">{disease.prevention}</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-20 bg-gradient-to-br from-accent/10 to-primary/10">
        <div className="container mx-auto px-4 lg:px-8">
          <Card className="p-8 bg-card/50 border-accent/20">
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold">{t('services.noticeTitle')}</h3>
              </div>
              <p className="text-muted-foreground">
                {t('services.noticeText1')}
              </p>
              <p className="text-muted-foreground">
                {t('services.noticeText2')}
              </p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Services;