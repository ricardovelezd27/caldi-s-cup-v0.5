import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Coffee, Home, ArrowLeft } from "lucide-react";
import caldiScanning from "@/assets/characters/caldi-scanning.png";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const handleGoBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center">
        {/* Caldi character */}
        <img
          src={caldiScanning}
          alt="Caldi looking confused"
          className="w-32 h-32 mx-auto mb-6 object-contain animate-bounce"
          style={{ animationDuration: "2s" }}
        />

        {/* Fun 404 heading */}
        <h1 className="font-bangers text-6xl text-primary mb-2 tracking-wide">
          4
          <Coffee className="inline w-12 h-12 text-accent mx-1 -mt-2" />
          4
        </h1>

        <h2 className="font-bangers text-2xl text-foreground mb-3 tracking-wide">
          Oops! This brew doesn't exist
        </h2>

        <p className="text-muted-foreground font-inter mb-2">
          Looks like this page got over-extracted and disappeared.
        </p>
        <p className="text-muted-foreground font-inter text-sm mb-8">
          Don't worry — Caldi's got your back. Let's get you back to
          the good stuff. ☕
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={handleGoBack} variant="default" size="lg">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Take Me Back
          </Button>
          <Button onClick={() => navigate("/")} variant="outline" size="lg">
            <Home className="w-4 h-4 mr-2" />
            Home Base
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
