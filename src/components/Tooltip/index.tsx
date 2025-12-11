import { useState } from "react";

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  isShow?: boolean;
  position?: "top" | "bottom" | "left" | "right";
}

const Tooltip = ({
  content,
  children,
  isShow = true,
  position = "top",
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
  };

  const arrowClasses = {
    top: "top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-input",
    bottom:
      "bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-input",
    left: "left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-input",
    right:
      "right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-input",
  };

  return (
    <div className="relative inline-block h-full">
      {isVisible && isShow && (
        <div
          className={`absolute ${positionClasses[position]} px-2 py-1 bg-input text-tx-default text-sm rounded-lg whitespace-nowrap z-50 animate-in fade-in duration-200`}
        >
          {content}
          <div className={`absolute ${arrowClasses[position]}`}></div>
        </div>
      )}

      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="h-full"
      >
        {children}
      </div>
    </div>
  );
};
export default Tooltip;
