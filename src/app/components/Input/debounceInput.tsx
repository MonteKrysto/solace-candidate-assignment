import { useEffect, useState } from "react";

/**
 * A custom input component that allows users to clear the input value.
 * @param value The input value.
 * @param onChange The input change handler.
 * @param className The input class name.
 * @param placeholder The input placeholder.
 * @param debounceDelay Optional prop to specify debounce delay.
 */
interface DebounceInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  debounceDelay?: number;
}

const DebounceInput: React.FC<DebounceInputProps> = ({
  value,
  onChange,
  className,
  placeholder,
  debounceDelay = 300,
}) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(inputValue);
    }, debounceDelay);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, debounceDelay, onChange]);

  const handleClear = () => {
    setInputValue("");
    onChange("");
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className={className}
        placeholder={placeholder}
      />
      {inputValue && (
        <button
          onClick={handleClear}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export { DebounceInput };
