import { Lock } from "lucide-react";

const ConfidentialBanner = () => {
  return (
    <div className="bg-accent/90 text-white py-2 px-4 text-center text-sm font-medium flex items-center justify-center gap-2 sticky top-0 z-50 shadow-md">
      <Lock className="h-4 w-4" />
      <span><strong>Note:</strong> Confidential and Private Property of MS International and Shah Happiness Foundation</span>
    </div>
  );
};

export default ConfidentialBanner;
