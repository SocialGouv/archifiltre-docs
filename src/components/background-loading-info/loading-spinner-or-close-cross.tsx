import React, { FC, memo } from "react";
import styled from "styled-components";
import { SUCCESS_GREEN } from "../../util/color-util";
import { empty } from "../../util/function-util";
import CloseCross from "../common/close-cross";
import Spinner from "../common/spinner";

const Loader = memo(styled.div`
  width: 37px;
  height: 37px;
  padding: 10px 10px 10px 10px;
`);

const CloseCrossContainer = styled.button`
  width: 37px;
  height: 37px;
  line-height: 37px;
  font-size: 18px;
  vertical-align: middle;
  text-align: center;
  color: ${SUCCESS_GREEN};
  cursor: pointer;
`;

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
    <CloseCrossContainer onClick={onClose}>
      <CloseCross />
    </CloseCrossContainer>
  );
};

export default LoadingSpinnerOrCloseCross;
