import Paper from "@material-ui/core/Paper";
import styled from "styled-components";

export const Layout = styled(Paper)`
  display: flex;
  height: 97.5%;
  justify-content: space-between;
  padding: 5px;
`;

export const LargeBlock = styled.div`
  height: 100%;
  width: 74%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

export const ColumnBlock = styled.div`
  height: 100%;
  width: 24%;
`;

export const VerticalContainer = styled.div`
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;
