import React from "react";
import { FaCheckCircle, FaCircleNotch } from "react-icons/fa";
import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Rotating = styled.div`
  display: flex;
  animation: 1s ${rotate} linear infinite;
`;

/**
 * Simple component that displays a loader when loading is true and a check when loading is false.
 * @param loading
 */
const Loader = ({ loading }) =>
  loading ? (
    <Rotating>
      <FaCircleNotch />
    </Rotating>
  ) : (
    <FaCheckCircle />
  );

export default Loader;
