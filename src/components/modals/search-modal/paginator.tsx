import React from "react";
import { useTranslation } from "react-i18next";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/all";
import styled from "styled-components";

const PaginatorWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const PageIndicator = styled.span`
  padding-left: 10px;
  padding-right: 10px;
`;

const PageButton = styled.button`
  &:hover {
    background-color: #ededed;
  }
  cursor: pointer;
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 50%;
  width: 25px;
  height: 25px;
`;

const Paginator = ({
  gotoPage,
  canPreviousPage,
  previousPage,
  nextPage,
  canNextPage,
  pageCount,
  pageIndex,
  pageOptions,
}) => {
  const { t } = useTranslation();
  return (
    <PaginatorWrapper>
      <PageButton onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
        <FaAngleDoubleLeft />
      </PageButton>
      <PageButton onClick={() => previousPage()} disabled={!canPreviousPage}>
        <FaAngleLeft />
      </PageButton>
      <PageIndicator>
        {`${t("search.page")} `}
        <strong>
          {pageIndex + 1}/{pageOptions.length}
        </strong>
      </PageIndicator>
      <PageButton onClick={() => nextPage()} disabled={!canNextPage}>
        <FaAngleRight />
      </PageButton>
      <PageButton
        onClick={() => gotoPage(pageCount - 1)}
        disabled={!canNextPage}
      >
        <FaAngleDoubleRight />
      </PageButton>
    </PaginatorWrapper>
  );
};

export default Paginator;
