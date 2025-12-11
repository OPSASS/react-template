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

  const valueParsed = parseValue(value || "");

  const currentInputValue = isControlled ? valueParsed.value : inputValue;

  const currentUnitValue = isControlled ? valueParsed.unit : unit;

  useEffect(() => {
    onChange?.(`${currentInputValue}${currentUnitValue}`);
  }, []);

  useEffect(() => {
    if (isControlled) {
      setUnit(valueParsed.unit);
      setInputValue(valueParsed.value);
    }
  }, [isControlled]);

  const handleChangeUnit = useCallback(
    (v: string) => {
      let adjustedValue = currentInputValue;

      if (v === "%") {
        adjustedValue = Math.min(100, Math.max(0, currentInputValue));
      }

      onChange?.(`${adjustedValue}${v}`);
      setUnit(v);
      setInputValue(adjustedValue);
    },
    [currentInputValue, onChange]
  );

  const handleChangeValue = useCallback(
    (newValue: number) => {
      setInputValue(newValue);

      onChange?.(`${newValue}${unit}`);
    },
    [unit, onChange]
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
