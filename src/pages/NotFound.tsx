import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import ConfidentialBanner from "@/components/ConfidentialBanner";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <ConfidentialBanner />
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-secondary/20">
        <div className="text-center space-y-6 p-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">404</h1>
          <p className="text-xl text-muted-foreground">Oops! Page not found</p>
          <Link to="/">
            <Button variant="hero" size="lg" className="rounded-full">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
