import React from "react";

import Tag from "components/tags/tag";

import pick from "languages";

const clickHereToAddText = pick({
  en: "Click here to add some tags!",
  fr: "Cliquez ici pour ajouter des tags !"
});

const newTagText = pick({
  en: "New tag",
  fr: "Nouveau tag"
});

const inputStyle = {
  width: "7em",
  border: "none",
  background: "none",
  outline: "none",
  borderBottom: "3px solid rgb(10, 50, 100)"
};

const cellShrinkStyle = {
  padding: "0.3em"
};

export default class TagsEditable extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = null;
  }

  componentDidUpdate() {
    if (this.textInput) {
      this.textInput.focus();
    }
  }

  render() {
    const {
      tagsForCurrentFile,
      editing,
      candidate_tag,
      onChange,
      onKeyUp,
      removeHandlerFactory
    } = this.props;

    const tagsToElements = () =>
      tagsForCurrentFile
        .map(tag => (
          <div className="cell shrink" key={tag.id} style={cellShrinkStyle}>
            <Tag
              text={tag.name}
              editing={editing}
              removeHandler={removeHandlerFactory(tag.id)}
            />
          </div>
        ))
        .reduce((accumulator, value) => [...accumulator, value], []);

    let answer;

    if (editing) {
      const elements = tagsToElements();
      const inputBox = (
        <div className="cell shrink" key="__input__" style={cellShrinkStyle}>
          <input
            style={inputStyle}
            onMouseUp={event => {
              event.stopPropagation();
            }}
            onKeyUp={onKeyUp}
            placeholder={newTagText}
            ref={component => {
              this.textInput = component;
            }}
            value={candidate_tag}
            onChange={onChange}
          />
        </div>
      );

      answer = [...elements, inputBox];
    } else if (tagsForCurrentFile.length > 0) {
      answer = tagsToElements();
    } else {
      answer = (
        <div className="cell shrink" key="__closing__" style={cellShrinkStyle}>
          <span>{clickHereToAddText}</span>
        </div>
      );
    }

    return <div className="grid-x">{answer}</div>;
  }
}
