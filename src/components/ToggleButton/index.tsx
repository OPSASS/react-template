import { useCallback, useMemo, useState } from "react";

export type ToggleButtonProps<T extends readonly string[]> = {
  options: T;
  value?: T[number];
  disabled?: boolean;
  width?: string;
  height?: string;
  onChange?: (value: T[number]) => void;
};

const ToggleButton = <T extends readonly string[]>(
  props: ToggleButtonProps<T>
) => {
  const {
    options,
    value,
    disabled = false,
    width = "140px",
    height = "36px",
    onChange,
  } = props;
  const [hovered, setHovered] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const selectedIndex = useMemo(
    () => options.indexOf(value as T[number]),
    [options, value]
  );

  const handleChange = useCallback(
    (option: T[number]) => {
      if (!disabled && onChange) {
        onChange(option);
      }
    },
    [disabled, onChange]
  );

  const handleMouseEnter = useCallback(() => {
    if (!disabled) setHovered(true);
  }, [disabled]);

  const handleMouseLeave = useCallback(() => {
    if (!disabled) setHovered(false);
  }, [disabled]);

  const handleFocus = useCallback(
    (index: number) => {
      if (!disabled) setFocusedIndex(index);
    },
    [disabled]
  );

  const handleBlur = useCallback(() => {
    if (!disabled) setFocusedIndex(null);
  }, [disabled]);

  const sliderStyles = useMemo(() => {
    const percentage = 100 / options.length;
    return {
      left: `${selectedIndex * percentage}%`,
      width: `${percentage}%`,
    };
  }, [selectedIndex, options.length]);

  return (
    <div
      className={`relative flex backdrop-blur-sm rounded-lg border transition-all duration-300 ${
        disabled
          ? "bg-zinc-800 border-transparent cursor-not-allowed"
          : `bg-input ${hovered ? "hover:bg-zinc-800" : ""} ${
              focusedIndex === null ? "border-transparent" : "border-primary "
            }`
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ width, height }}
    >
      <div
        className={`absolute h-full rounded-lg transition-all duration-300 ease-out shadow-lg ${
          disabled ? "bg-zinc-700" : "bg-input-active"
        }`}
        style={sliderStyles}
      />

      {options.map((option, index) => {
        const isSelected = option === value;

        return (
          <button
            key={option}
            onClick={() => handleChange(option)}
            onFocus={() => handleFocus(index)}
            onBlur={handleBlur}
            disabled={disabled}
            className={`relative z-10 w-full h-full rounded-lg font-medium transition-all duration-300 ease-out ${
              disabled
                ? "cursor-not-allowed text-tx-secondary"
                : `cursor-pointer hover:text-tx-default hover:bg-zinc-700/40 ${
                    isSelected ? "text-tx-default" : "text-tx-secondary"
                  }`
            }`}
            aria-pressed={isSelected}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
};

export default ToggleButton;
