import { useCallback, useState } from "react";

interface UseModalResponse {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

/**
 * Gives basic controls for modals. Returns the modal state and controls to open/close the modal
 * @returns [isModalOpen, openModal, closeModal]
 */
export const useModal = (): UseModalResponse => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = useCallback(() => setIsModalOpen(true), [setIsModalOpen]);
  const closeModal = useCallback(() => setIsModalOpen(false), [setIsModalOpen]);

  return { isModalOpen, openModal, closeModal };
};
