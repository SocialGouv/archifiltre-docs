import React from "react";
import { useTranslation } from "react-i18next";
import { FaSearch } from "react-icons/fa";
import Button, { ButtonWidth } from "../common/button";
import { SearchModalContainer } from "../modals/search-modal/search-modal-container";
import { useModal } from "../../hooks/use-modal";

export const SearchButton = () => {
  const { isModalOpen, openModal, closeModal } = useModal();
  const { t } = useTranslation();

  return (
    <>
      <Button
        id="search-button"
        width={ButtonWidth.WITH_SPACES}
        onClick={openModal}
        tooltipText={t("search.title")}
      >
        <FaSearch />
      </Button>
      <SearchModalContainer isModalOpen={isModalOpen} closeModal={closeModal} />
    </>
  );
};
