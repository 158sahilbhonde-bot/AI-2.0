import { useState } from "react";

interface BodyMapProps {
  selectedPart: string | null;
  onSelectPart: (part: string) => void;
}

type BodyType = "male" | "female";

export const BodyMap = ({ selectedPart, onSelectPart }: BodyMapProps) => {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [bodyType, setBodyType] = useState<BodyType>("male");

  const getPartStyle = (partName: string) => {
    const isSelected = selectedPart === partName;
    const isHovered = hoveredPart === partName;
    
    return {
      fill: isSelected 
        ? "hsl(var(--primary))" 
        : isHovered 
          ? "hsl(var(--primary) / 0.5)" 
          : "#C5CCD3",
      stroke: "white",
      strokeWidth: "1px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      filter: isHovered ? "brightness(1.1)" : "none"
    };
  };

  const handlePartClick = (partName: string) => {
    onSelectPart(partName);
  };

  return (
    <div className="flex flex-col items-center justify-center py-4">
      {/* Gender Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setBodyType("male")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            bodyType === "male"
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
            <path d="M9.5 11c1.93 0 3.5 1.57 3.5 3.5S11.43 18 9.5 18 6 16.43 6 14.5 7.57 11 9.5 11zm0-2C6.46 9 4 11.46 4 14.5S6.46 20 9.5 20s5.5-2.46 5.5-5.5c0-1.16-.36-2.23-.97-3.12L18 7.42V10h2V4h-6v2h2.58l-3.97 3.97C11.73 9.36 10.66 9 9.5 9z"/>
          </svg>
          Male
        </button>
        <button
          onClick={() => setBodyType("female")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            bodyType === "female"
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
            <path d="M12 4c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5zm0-2C8.13 2 5 5.13 5 9c0 2.99 1.86 5.54 4.5 6.57V17H7v2h2.5v3h3v-3H15v-2h-2.5v-1.43C15.14 14.54 17 11.99 17 9c0-3.87-3.13-7-7-7z"/>
          </svg>
          Female
        </button>
      </div>

      <svg
        viewBox="0 0 300 700"
        className="w-full max-w-[300px] h-auto"
        style={{ maxHeight: "550px" }}
        fill="none"
      >
        {bodyType === "male" ? (
          /* ==================== MALE BODY ==================== */
          <>
            {/* Head */}
            <path
              d="M150 15 C125 15 110 35 110 60 C110 85 125 100 150 100 C175 100 190 85 190 60 C190 35 175 15 150 15 Z"
              style={getPartStyle("Head")}
              onClick={() => handlePartClick("Head")}
              onMouseEnter={() => setHoveredPart("Head")}
              onMouseLeave={() => setHoveredPart(null)}
            />
            
            {/* Neck - Male: Thicker */}
            <path
              d="M132 95 L132 115 Q150 120 168 115 L168 95 Q150 105 132 95 Z"
              style={getPartStyle("Neck")}
              onClick={() => handlePartClick("Neck")}
              onMouseEnter={() => setHoveredPart("Neck")}
              onMouseLeave={() => setHoveredPart(null)}
            />

            {/* Left Shoulder - Male: Broader */}
            <path
              d="M105 125 Q75 125 70 160 Q90 175 105 155 Z"
              style={getPartStyle("Left Shoulder")}
              onClick={() => handlePartClick("Left Shoulder")}
              onMouseEnter={() => setHoveredPart("Left Shoulder")}
              onMouseLeave={() => setHoveredPart(null)}
            />

            {/* Right Shoulder - Male: Broader */}
            <path
              d="M195 125 Q225 125 230 160 Q210 175 195 155 Z"
              style={getPartStyle("Right Shoulder")}
              onClick={() => handlePartClick("Right Shoulder")}
              onMouseEnter={() => setHoveredPart("Right Shoulder")}
              onMouseLeave={() => setHoveredPart(null)}
            />

            {/* Chest - Male: Broader, more angular */}
            <path
              d="M105 125 C105 125 125 115 150 115 C175 115 195 125 195 125 L195 155 L190 185 C190 185 150 195 110 185 L105 155 Z"
              style={getPartStyle("Chest")}
              onClick={() => handlePartClick("Chest")}
              onMouseEnter={() => setHoveredPart("Chest")}
              onMouseLeave={() => setHoveredPart(null)}
            />

            {/* Abdomen - Male: Straighter sides */}
            <path
              d="M110 185 C150 195 190 185 190 185 L185 250 C185 250 150 260 115 250 L110 185 Z"
              style={getPartStyle("Abdomen")}
              onClick={() => handlePartClick("Abdomen")}
              onMouseEnter={() => setHoveredPart("Abdomen")}
              onMouseLeave={() => setHoveredPart(null)}
            />

            {/* Pelvis - Male: Narrower hips */}
            <path
              d="M115 250 C150 260 185 250 185 250 L190 295 C190 295 150 310 110 295 L115 250 Z"
              style={getPartStyle("Pelvis")}
              onClick={() => handlePartClick("Pelvis")}
              onMouseEnter={() => setHoveredPart("Pelvis")}
              onMouseLeave={() => setHoveredPart(null)}
            />

            {/* Left Upper Arm - Male: More muscular */}
            <path
              d="M70 160 C58 195 55 220 50 245 L75 250 C80 220 90 185 105 155 Z"
              style={getPartStyle("Left Arm")}
              onClick={() => handlePartClick("Left Arm")}
              onMouseEnter={() => setHoveredPart("Left Arm")}
              onMouseLeave={() => setHoveredPart(null)}
            />

            {/* Left Lower Arm */}
            <path
              d="M50 245 L32 320 L55 325 L75 250 Z"
              style={getPartStyle("Left Arm")}
              onClick={() => handlePartClick("Left Arm")}
              onMouseEnter={() => setHoveredPart("Left Arm")}
              onMouseLeave={() => setHoveredPart(null)}
            />

            {/* Right Upper Arm - Male: More muscular */}
            <path
              d="M230 160 C242 195 245 220 250 245 L225 250 C220 220 210 185 195 155 Z"
              style={getPartStyle("Right Arm")}
              onClick={() => handlePartClick("Right Arm")}
              onMouseEnter={() => setHoveredPart("Right Arm")}
              onMouseLeave={() => setHoveredPart(null)}
            />

            {/* Right Lower Arm */}
            <path
              d="M250 245 L268 320 L245 325 L225 250 Z"
              style={getPartStyle("Right Arm")}
              onClick={() => handlePartClick("Right Arm")}
              onMouseEnter={() => setHoveredPart("Right Arm")}
              onMouseLeave={() => setHoveredPart(null)}
            />

            {/* Left Hand */}
            <path
              d="M32 320 Q20 345 28 370 Q50 368 55 325 Z"
              style={getPartStyle("Left Hand")}
              onClick={() => handlePartClick("Left Hand")}
              onMouseEnter={() => setHoveredPart("Left Hand")}
              onMouseLeave={() => setHoveredPart(null)}
            />

            {/* Right Hand */}
            <path
              d="M268 320 Q280 345 272 370 Q250 368 245 325 Z"
              style={getPartStyle("Right Hand")}
              onClick={() => handlePartClick("Right Hand")}
              onMouseEnter={() => setHoveredPart("Right Hand")}
              onMouseLeave={() => setHoveredPart(null)}
            />

            {/* Left Thigh - Male */}
            <path
              d="M110 295 C98 350 100 400 108 440 L142 440 C148 400 152 350 150 305 Z"
              style={getPartStyle("Left Leg")}
              onClick={() => handlePartClick("Left Leg")}
              onMouseEnter={() => setHoveredPart("Left Leg")}
              onMouseLeave={() => setHoveredPart(null)}
            />

            {/* Left Lower Leg */}
            <path
              d="M108 440 C102 475 105 510 110 555 L138 555 C143 510 148 475 142 440 Z"
              style={getPartStyle("Left Leg")}
              onClick={() => handlePartClick("Left Leg")}
              onMouseEnter={() => setHoveredPart("Left Leg")}
              onMouseLeave={() => setHoveredPart(null)}
            />

            {/* Right Thigh - Male */}
            <path
              d="M190 295 C202 350 200 400 192 440 L158 440 C152 400 148 350 150 305 Z"
              style={getPartStyle("Right Leg")}
              onClick={() => handlePartClick("Right Leg")}
              onMouseEnter={() => setHoveredPart("Right Leg")}
              onMouseLeave={() => setHoveredPart(null)}
            />

            {/* Right Lower Leg */}
            <path
              d="M192 440 C198 475 195 510 190 555 L162 555 C157 510 152 475 158 440 Z"
              style={getPartStyle("Right Leg")}
              onClick={() => handlePartClick("Right Leg")}
              onMouseEnter={() => setHoveredPart("Right Leg")}
              onMouseLeave={() => setHoveredPart(null)}
            />

            {/* Left Foot */}
            <path
              d="M110 555 L100 590 Q120 600 145 590 L138 555 Z"
              style={getPartStyle("Left Foot")}
              onClick={() => handlePartClick("Left Foot")}
              onMouseEnter={() => setHoveredPart("Left Foot")}
              onMouseLeave={() => setHoveredPart(null)}
            />

            {/* Right Foot */}
            <path
              d="M190 555 L200 590 Q180 600 155 590 L162 555 Z"
              style={getPartStyle("Right Foot")}
              onClick={() => handlePartClick("Right Foot")}
              onMouseEnter={() => setHoveredPart("Right Foot")}
              onMouseLeave={() => setHoveredPart(null)}
            />
          </>
        ) : (
          /* ==================== FEMALE BODY ==================== */
          <>
            {/* Head - Female: Slightly smaller, softer shape */}
            <path
              d="M150 18 C128 18 115 38 115 62 C115 86 130 100 150 100 C170 100 185 86 185 62 C185 38 172 18 150 18 Z"
              style={getPartStyle("Head")}
              onClick={() => handlePartClick("Head")}
              onMouseEnter={() => setHoveredPart("Head")}
              onMouseLeave={() => setHoveredPart(null)}
            />
            
            {/* Neck - Female: Slimmer, longer */}
            <path
              d="M138 95 L138 118 Q150 122 162 118 L162 95 Q150 102 138 95 Z"
              style={getPartStyle("Neck")}
              onClick={() => handlePartClick("Neck")}
              onMouseEnter={() => setHoveredPart("Neck")}
              onMouseLeave={() => setHoveredPart(null)}
            />

            {/* Left Shoulder - Female: Narrower, more rounded */}
            <path
              d="M115 130 Q95 132 90 158 Q105 168 115 152 Z"
              style={getPartStyle("Left Shoulder")}
              onClick={() => handlePartClick("Left Shoulder")}
              onMouseEnter={() => setHoveredPart("Left Shoulder")}
              onMouseLeave={() => setHoveredPart(null)}
            />

            {/* Right Shoulder - Female: Narrower, more rounded */}
            <path
              d="M185 130 Q205 132 210 158 Q195 168 185 152 Z"
              style={getPartStyle("Right Shoulder")}
              onClick={() => handlePartClick("Right Shoulder")}
              onMouseEnter={() => setHoveredPart("Right Shoulder")}
              onMouseLeave={() => setHoveredPart(null)}
            />

            {/* Chest - Female: Narrower shoulders with bust */}
            <path
              d="M115 130 C115 130 130 118 150 118 C170 118 185 130 185 130 L185 152 L182 180 C182 180 150 192 118 180 L115 152 Z"
              style={getPartStyle("Chest")}
              onClick={() => handlePartClick("Chest")}
              onMouseEnter={() => setHoveredPart("Chest")}
              onMouseLeave={() => setHoveredPart(null)}
            />

            {/* Abdomen - Female: Curved waist (hourglass) */}
            <path
              d="M118 180 C150 192 182 180 182 180 L175 245 C175 245 150 255 125 245 L118 180 Z"
              style={getPartStyle("Abdomen")}
              onClick={() => handlePartClick("Abdomen")}
              onMouseEnter={() => setHoveredPart("Abdomen")}
              onMouseLeave={() => setHoveredPart(null)}
            />

            {/* Pelvis - Female: Wider hips */}
            <path
              d="M125 245 C150 255 175 245 175 245 L195 300 C195 300 150 320 105 300 L125 245 Z"
              style={getPartStyle("Pelvis")}
              onClick={() => handlePartClick("Pelvis")}
              onMouseEnter={() => setHoveredPart("Pelvis")}
              onMouseLeave={() => setHoveredPart(null)}
            />

            {/* Left Upper Arm - Female: Slimmer */}
            <path
              d="M90 158 C80 188 78 215 75 240 L95 245 C98 218 105 185 115 152 Z"
              style={getPartStyle("Left Arm")}
              onClick={() => handlePartClick("Left Arm")}
              onMouseEnter={() => setHoveredPart("Left Arm")}
              onMouseLeave={() => setHoveredPart(null)}
            />

            {/* Left Lower Arm - Female */}
            <path
              d="M75 240 L60 310 L80 315 L95 245 Z"
              style={getPartStyle("Left Arm")}
              onClick={() => handlePartClick("Left Arm")}
              onMouseEnter={() => setHoveredPart("Left Arm")}
              onMouseLeave={() => setHoveredPart(null)}
            />

            {/* Right Upper Arm - Female: Slimmer */}
            <path
              d="M210 158 C220 188 222 215 225 240 L205 245 C202 218 195 185 185 152 Z"
              style={getPartStyle("Right Arm")}
              onClick={() => handlePartClick("Right Arm")}
              onMouseEnter={() => setHoveredPart("Right Arm")}
              onMouseLeave={() => setHoveredPart(null)}
            />

            {/* Right Lower Arm - Female */}
            <path
              d="M225 240 L240 310 L220 315 L205 245 Z"
              style={getPartStyle("Right Arm")}
              onClick={() => handlePartClick("Right Arm")}
              onMouseEnter={() => setHoveredPart("Right Arm")}
              onMouseLeave={() => setHoveredPart(null)}
            />

            {/* Left Hand - Female: Smaller */}
            <path
              d="M60 310 Q50 332 55 355 Q75 352 80 315 Z"
              style={getPartStyle("Left Hand")}
              onClick={() => handlePartClick("Left Hand")}
              onMouseEnter={() => setHoveredPart("Left Hand")}
              onMouseLeave={() => setHoveredPart(null)}
            />

            {/* Right Hand - Female: Smaller */}
            <path
              d="M240 310 Q250 332 245 355 Q225 352 220 315 Z"
              style={getPartStyle("Right Hand")}
              onClick={() => handlePartClick("Right Hand")}
              onMouseEnter={() => setHoveredPart("Right Hand")}
              onMouseLeave={() => setHoveredPart(null)}
            />

            {/* Left Thigh - Female: Fuller, curved */}
            <path
              d="M105 300 C92 355 95 405 105 445 L140 445 C148 405 155 355 150 315 Z"
              style={getPartStyle("Left Leg")}
              onClick={() => handlePartClick("Left Leg")}
              onMouseEnter={() => setHoveredPart("Left Leg")}
              onMouseLeave={() => setHoveredPart(null)}
            />

            {/* Left Lower Leg - Female */}
            <path
              d="M105 445 C100 480 102 515 108 558 L135 558 C140 515 145 480 140 445 Z"
              style={getPartStyle("Left Leg")}
              onClick={() => handlePartClick("Left Leg")}
              onMouseEnter={() => setHoveredPart("Left Leg")}
              onMouseLeave={() => setHoveredPart(null)}
            />

            {/* Right Thigh - Female: Fuller, curved */}
            <path
              d="M195 300 C208 355 205 405 195 445 L160 445 C152 405 145 355 150 315 Z"
              style={getPartStyle("Right Leg")}
              onClick={() => handlePartClick("Right Leg")}
              onMouseEnter={() => setHoveredPart("Right Leg")}
              onMouseLeave={() => setHoveredPart(null)}
            />

            {/* Right Lower Leg - Female */}
            <path
              d="M195 445 C200 480 198 515 192 558 L165 558 C160 515 155 480 160 445 Z"
              style={getPartStyle("Right Leg")}
              onClick={() => handlePartClick("Right Leg")}
              onMouseEnter={() => setHoveredPart("Right Leg")}
              onMouseLeave={() => setHoveredPart(null)}
            />

            {/* Left Foot - Female: Smaller */}
            <path
              d="M108 558 L100 590 Q118 598 140 590 L135 558 Z"
              style={getPartStyle("Left Foot")}
              onClick={() => handlePartClick("Left Foot")}
              onMouseEnter={() => setHoveredPart("Left Foot")}
              onMouseLeave={() => setHoveredPart(null)}
            />

            {/* Right Foot - Female: Smaller */}
            <path
              d="M192 558 L200 590 Q182 598 160 590 L165 558 Z"
              style={getPartStyle("Right Foot")}
              onClick={() => handlePartClick("Right Foot")}
              onMouseEnter={() => setHoveredPart("Right Foot")}
              onMouseLeave={() => setHoveredPart(null)}
            />
          </>
        )}
      </svg>

      {/* Hovered Part Label */}
      {hoveredPart && (
        <div className="mt-4 text-center animate-fade-in">
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            {hoveredPart}
          </span>
        </div>
      )}

      {/* Selected Part Display */}
      {selectedPart && !hoveredPart && (
        <div className="mt-4 text-center">
          <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
            Selected: {selectedPart}
          </span>
        </div>
      )}

      {/* Instructions */}
      {!selectedPart && !hoveredPart && (
        <div className="mt-4 text-center text-muted-foreground text-sm">
          Click on a body part to select it
        </div>
      )}
    </div>
  );
};