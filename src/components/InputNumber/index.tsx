import { useCallback, useEffect, useMemo, useState } from "react";
import Tooltip from "../Tooltip";

export type InputNumberProps = {
  defaultValue?: number;
  disabled?: boolean;
  height?: string;
  max?: number;
  maxContent?: string;
  min?: number;
  minContent?: string;
  minusIcon?: React.ReactNode;
  plusIcon?: React.ReactNode;
  showStepper?: boolean;
  showTooltip?: boolean;
  step?: number;
  value?: number;
  width?: string;
  onChange?: (value: number) => void;
};

const MinusIcon = () => {
  return (
    <svg
      width="1.5em"
      height="1.5em"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 9.75C4 9.33579 4.33579 9 4.75 9L15.25 9C15.6642 9 16 9.33579 16 9.75C16 10.1642 15.6642 10.5 15.25 10.5H4.75C4.33579 10.5 4 10.1642 4 9.75Z"
        fill="currentColor"
      />
    </svg>
  );
};

const PlusIcon = () => {
  return (
    <svg
      width="1.5em"
      height="1.5em"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.75 4.75C10.75 4.33579 10.4142 4 10 4C9.58579 4 9.25 4.33579 9.25 4.75V9.25H4.75C4.33579 9.25 4 9.58579 4 10C4 10.4142 4.33579 10.75 4.75 10.75H9.25L9.25 15.25C9.25 15.6642 9.58579 16 10 16C10.4142 16 10.75 15.6642 10.75 15.25V10.75H15.25C15.6642 10.75 16 10.4142 16 10C16 9.58579 15.6642 9.25 15.25 9.25H10.75V4.75Z"
        fill="currentColor"
      />
    </svg>
  );
};

const InputNumber = (props: InputNumberProps) => {
  const {
    defaultValue = 0,
    disabled = false,
    height = "36px",
    max,
    maxContent,
    min,
    minContent,
    minusIcon = <MinusIcon />,
    plusIcon = <PlusIcon />,
    showStepper = false,
    showTooltip = false,
    step = 1,
    value,
    width = "140px",
    onChange,
  } = props;

  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : defaultValue;

  const [inputValue, setInputValue] = useState(String(currentValue));

  useEffect(() => {
    if (isControlled) {
      setInputValue(String(value));
    }
  }, [value, isControlled]);

  const roundToDecimal = useCallback(
    (num: number, decimals: number = 10): number => {
      return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
    },
    []
  );

  const normalizeValue = useCallback(
    (val: string): number => {
      const normalized = val
        .replace(/[^0-9.-]/g, "") // remove non-numbers (- and .)
        .replace(/(?!^)-/g, "") // leading -
        .replace(/(\..*)\./g, "$1"); // remove multiple .

      const num = parseFloat(normalized || "0");

      if (isNaN(num)) return 0;

      if (min !== undefined && num < min) return min;
      if (max !== undefined && num > max) return max;

      return num;
    },
    [min, max]
  );

  const handleChange = useCallback(
    (val: string) => {
        setInputValue(val.replace(",", "."));
    },
    []
  );

  const finalizeValue = useCallback(() => {
    const result = normalizeValue(inputValue);
    if (isNaN(result)) {
      const fallback = min ?? 0;
      setInputValue(String(fallback));
      onChange?.(fallback);
      return;
    }

    setInputValue(String(result));
    onChange?.(result);
  }, [inputValue, min, onChange, normalizeValue]);

  const adjustValue = useCallback(
    (delta: number) => {
      if (disabled) return;

      const current = parseFloat(inputValue) || 0;
      let newValue = roundToDecimal(current + delta);

      if (min !== undefined) newValue = Math.max(min, newValue);
      if (max !== undefined) newValue = Math.min(max, newValue);

      if (!isControlled) {
        setInputValue(String(newValue));
      }
      onChange?.(newValue);
      setFocused(true);
    },
    [
      disabled,
      inputValue,
      min,
      max,
      isControlled,
      onChange,
      roundToDecimal,
      setFocused,
    ]
  );

  const decrease = useCallback(() => adjustValue(-step), [adjustValue, step]);
  const increase = useCallback(() => adjustValue(step), [adjustValue, step]);

  const isDecreaseDisabled = useMemo(
    () => disabled || (min !== undefined && parseFloat(inputValue) <= min),
    [disabled, min, inputValue]
  );

  const isIncreaseDisabled = useMemo(
    () => disabled || (max !== undefined && parseFloat(inputValue) >= max),
    [disabled, max, inputValue]
  );

  const containerClasses = `relative flex items-center rounded-lg select-none border bg-input backdrop-blur-sm transition-all duration-300 ${
    disabled
      ? "bg-zinc-800 border-transparent cursor-not-allowed"
      : focused
      ? "border-primary"
      : hovered
      ? "bg-input-hover border-transparent"
      : "border-transparent"
  }`;

  const getButtonClasses = (isDisabled: boolean) =>
    `relative aspect-square h-full leading-none transition-all duration-300 text-tx-secondary flex items-center justify-center wrap ${
      isDisabled
        ? "cursor-not-allowed"
        : "hover:text-tx-default hover:bg-input-hover"
    }`;

  return (
    <div className="flex items-center space-x-2">
      <div
        className={containerClasses}
        onMouseEnter={() => !disabled && setHovered(true)}
        onMouseLeave={() => !disabled && setHovered(false)}
        style={{
          width,
          height,
        }}
      >
        {showStepper && (
          <Tooltip
            isShow={Boolean(isDecreaseDisabled && showTooltip)}
            content={minContent || `Value must greater than ${min}`}
          >
            <button
              onClick={decrease}
              onMouseEnter={() => {
                setHovered(false);
              }}
              onBlur={() => {
                setFocused(false);
              }}
              disabled={isDecreaseDisabled}
              className={`${getButtonClasses(isDecreaseDisabled)} rounded-l-lg`}
            >
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                {minusIcon}
              </span>
            </button>
          </Tooltip>
        )}

        <input
          type="text"
          value={inputValue}
          onChange={(e) => handleChange(e.target.value)}
          onMouseEnter={() => setHovered(true)}
          onFocus={() => !disabled && setFocused(true)}
          onBlur={() => {
            setFocused(false);
            finalizeValue();
          }}
          disabled={disabled}
          className={`w-full text-center bg-transparent outline-none transition-all duration-300 ${
            disabled
              ? "text-tx-secondary cursor-not-allowed"
              : "text-tx-default"
          }`}
        />

        {showStepper && (
          <Tooltip
            isShow={Boolean(isIncreaseDisabled && showTooltip)}
            content={maxContent || `Value must smaller than ${max}`}
          >
            <button
              onClick={increase}
              onMouseEnter={() => {
                setHovered(false);
              }}
              onBlur={() => {
                setFocused(false);
              }}
              disabled={isIncreaseDisabled}
              className={`${getButtonClasses(isIncreaseDisabled)} rounded-r-lg`}
            >
              {plusIcon}
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default InputNumber;
