import React, { FC } from "react";
import styled from "styled-components";
import { FaTimes } from "react-icons/all";

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
`;

const CloseButton = styled.button`
  cursor: pointer;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  &:hover {
    background-color: #ededed;
  }
`;

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

const ModalHeader: FC<ModalHeaderProps> = ({ title, onClose }) => (
  <HeaderWrapper>
    <h4>{title}</h4>
    <CloseButton onClick={onClose}>
      <FaTimes />
    </CloseButton>
  </HeaderWrapper>
);

export default ModalHeader;
