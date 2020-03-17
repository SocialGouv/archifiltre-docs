import React from "react";
import { FaSearch } from "react-icons/all";
import Button, {
  ButtonAngles,
  ButtonColor,
  ButtonSize
} from "../common/button";
import { SearchModalContainer } from "../search-modal/search-modal-container";
import { useModal } from "../../hooks/useModal";

export const SearchButton = () => {
  const { isModalOpen, openModal, closeModal } = useModal();

  return (
    <>
      <Button
        id="search-button"
        color={ButtonColor.DISABLED}
        size={ButtonSize.SMALL}
        angles={ButtonAngles.CIRCLE}
        onClick={openModal}
      >
        <FaSearch />
      </Button>
      <SearchModalContainer isModalOpen={isModalOpen} closeModal={closeModal} />
    </>
  );
};
