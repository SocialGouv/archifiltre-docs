import React, { FC, memo } from "react";
import styled from "styled-components";
import { SUCCESS_GREEN } from "../../util/color-util";
import { empty } from "../../util/function-util";
import CloseCross from "../common/close-cross";
import Spinner from "../common/spinner";
import SquaredButton from "./squared-button";

const Loader = memo(styled.div`
  width: 37px;
  height: 37px;
  padding: 10px 10px 10px 10px;
  box-sizing: border-box;
`);

interface LoadingSpinnerOrCloseCrossProps {
  isLoading: boolean;
  onClose: () => void;
}

const LoadingSpinnerOrCloseCross: FC<LoadingSpinnerOrCloseCrossProps> = ({
  isLoading,
  onClose = empty,
}) => {
  if (isLoading) {
    return (
      <Loader>
        <Spinner color={SUCCESS_GREEN} />
      </Loader>
    );
  }
  return (
    <SquaredButton onClick={onClose}>
      <CloseCross />
    </SquaredButton>
  );
};

export default LoadingSpinnerOrCloseCross;
