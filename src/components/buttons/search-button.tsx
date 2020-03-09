import React, { useCallback, useState } from "react";
import { FaSearch } from "react-icons/all";
import Button, {
  ButtonAngles,
  ButtonColor,
  ButtonSize
} from "../common/button";
import { SearchModal } from "../search-modal/search-modal";

export const SearchButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = useCallback(() => setIsModalOpen(true), [setIsModalOpen]);
  const closeModal = useCallback(() => setIsModalOpen(false), [setIsModalOpen]);

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
      <SearchModal isModalOpen={isModalOpen} closeModal={closeModal} />
    </>
  );
};
