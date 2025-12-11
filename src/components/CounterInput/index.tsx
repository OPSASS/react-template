import { useCallback, useEffect, useState } from "react";
import InputNumber, { InputNumberProps } from "../InputNumber";
import ToggleButton, { ToggleButtonProps } from "../ToggleButton";

type Props = {
  value?: string;
  defaultValue?: string;
  showUnit?: boolean;
  unitOptions?: string[];
  unitConfig?: Omit<
    ToggleButtonProps<string[]>,
    "options" | "value" | "onChange"
  >;
  unitLabel?: string;
  inputConfig?: Omit<InputNumberProps, "value" | "onChange">;
  valueLabel?: string;
  step?: number;
  disabled?: boolean;
  onChange?: (value: string) => void;
};

const CounterInput = (props: Props) => {
  const {
    value,
    defaultValue = "0%",
    showUnit = false,
    unitOptions = ["%", "px"],
    unitConfig,
    inputConfig,
    step = 1,
    disabled = false,
    unitLabel = "Unit",
    valueLabel = "Value",
    onChange,
  } = props;

  // separate value and unit
  const parseValue = useCallback(
    (input: string): { value: number; unit: string } => {
      const trimmed = input.trim();
      const match = trimmed.match(/^(-?\d+(?:\.\d+)?)([a-z%]*)$/i);

      if (!match) {
        return { value: 0, unit: unitOptions[0] };
      }

      return {
        value: parseFloat(match[1]),
        unit: match[2] || unitOptions[0],
      };
    },
    [unitOptions]
  );

  const isControlled = value !== undefined;
  const intParsed = parseValue(defaultValue);

  const [unit, setUnit] = useState<string>(intParsed.unit);
  const [inputValue, setInputValue] = useState<number>(intParsed.value);

  const currentInputValue = isControlled
    ? parseValue(value!).value
    : inputValue;

  const currentUnitValue = isControlled ? parseValue(value!).unit : unit;

  useEffect(() => {
    if (isControlled && value) {
      const parsed = parseValue(value);
      if (!isControlled) {
        setUnit(parsed.unit);
        setInputValue(parsed.value);
      }
    }
  }, [value, isControlled, parseValue]);

  const handleChangeUnit = useCallback(
    (v: string) => {
      let adjustedValue = currentInputValue;

      if (v === "%") {
        adjustedValue = Math.min(100, Math.max(0, currentInputValue));
      }

      setUnit(v);
      setInputValue(adjustedValue);

      onChange?.(`${adjustedValue}${v}`);
    },
    [currentInputValue, onChange]
  );

  const handleChangeValue = useCallback(
    (newValue: number) => {
      if (!isControlled) {
        setInputValue(newValue);
      }

      onChange?.(`${newValue}${unit}`);
    },
    [unit, isControlled, onChange]
  );

  return (
    <div className="space-y-3 text-tx-default">
      {/* Unit Toggle */}
      {showUnit && (
        <div className="flex items-center gap-2 justify-between">
          <p>{unitLabel}</p>
          <ToggleButton
            value={currentUnitValue}
            options={unitOptions}
            disabled={disabled}
            onChange={handleChangeUnit}
            {...unitConfig}
          />
        </div>
      )}

      {/* Value Stepper */}
      <div className="flex items-center gap-2 justify-between">
        <p className="mb-1">{valueLabel}</p>
        <InputNumber
          value={currentInputValue}
          onChange={handleChangeValue}
          step={step}
          showStepper
          disabled={disabled}
          min={0}
          max={unit === "%" ? 100 : undefined}
          showTooltip
          {...inputConfig}
        />
      </div>
    </div>
  );
};

export default CounterInput;
