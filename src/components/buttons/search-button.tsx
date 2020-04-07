import React from "react";
import { FaSearch } from "react-icons/fa";
import Button, {
  ButtonAngles,
  ButtonColor,
  ButtonSize,
} from "../common/button";
import { SearchModalContainer } from "../modals/search-modal/search-modal-container";
import { useModal } from "../../hooks/use-modal";

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
