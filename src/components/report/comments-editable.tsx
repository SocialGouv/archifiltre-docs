import React, { FC, useCallback, useEffect, useRef } from "react";

import styled from "styled-components";
import { useTranslation } from "react-i18next";

const StyledTextArea = styled.textarea`
  border: none;
  background: none;
  outline: none;
  resize: none;
  border-bottom: 3px solid rgb(5, 120, 200);
`;

const Comments = styled.div`
  word-wrap: break-word;
  white-space: pre-wrap;
`;

type CommentsEditableProps = {
  onKeyUp: (event: any) => void;
  onBlur: (event: any) => void;
  editing: boolean;
  comments: string;
};

const CommentsEditable: FC<CommentsEditableProps> = ({
  onKeyUp,
  onBlur,
  editing,
  comments,
}) => {
  const { t } = useTranslation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => textareaRef.current?.focus(), [textareaRef]);

  const onMouseUp = useCallback((event) => event.stopPropagation(), []);

  if (editing) {
    return (
      <StyledTextArea
        className="comments"
        onMouseUp={onMouseUp}
        onKeyUp={onKeyUp}
        onBlur={onBlur}
        defaultValue={comments}
        placeholder={t("report.yourCommentsHere")}
        ref={textareaRef}
      />
    );
  } else if (comments.length > 0) {
    return <Comments>{comments}</Comments>;
  } else {
    return <span>{t("report.clickHereToAddComments")}</span>;
  }
};

export default CommentsEditable;
