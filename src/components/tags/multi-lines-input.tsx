import React, { FC, useCallback, useState } from "react";
import styled from "styled-components";

const TextArea = styled.textarea`
  resize: none;
  padding: 0;
  margin: 0;
  border: 0;
  height: 5em;
`;

interface MultiLinesInputProps {
  onFinish: (value: string) => void;
  value: string;
  autofocus: boolean;
}

const MultiLinesInput: FC<MultiLinesInputProps> = ({
  onFinish,
  value,
  autofocus,
}) => {
  const [inputValue, setInputValue] = useState(value);

  const onBlur = useCallback(() => onFinish(inputValue), [
    onFinish,
    inputValue,
  ]);

  const onKeyUp = useCallback(
    (event) => {
      if (event.key === "Enter") {
        onFinish(inputValue);
      }
    },
    [onFinish, inputValue]
  );

  const onChange = useCallback((event) => {
    const eventValue = event.target.value.replace("\n", "");
    setInputValue(eventValue);
  }, []);

  const ref = useCallback(
    (domElement) => {
      if (domElement && autofocus) {
        domElement.focus();
      }
    },
    [autofocus]
  );

  return (
    <TextArea
      onBlur={onBlur}
      onKeyUp={onKeyUp}
      onChange={onChange}
      value={inputValue}
      ref={ref}
    />
  );
};

export default MultiLinesInput;
