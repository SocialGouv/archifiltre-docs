import React from "react";

import Tag from "components/tag";

import pick from "languages";

const click_here_to_add = pick({
  en: "Click here to add some tags!",
  fr: "Cliquez ici pour ajouter des tags !"
});

const new_tag = pick({
  en: "New tag",
  fr: "Nouveau tag"
});

const input_style = {
  width: "7em",
  border: "none",
  background: "none",
  outline: "none",
  borderBottom: "3px solid rgb(10, 50, 100)"
};

const cell_shrink_style = {
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
    const props = this.props;

    const tagsForCurrentFile = props.tagsForCurrentFile;
    const editing = props.editing;
    const candidate_tag = props.candidate_tag;
    const onChange = props.onChange;
    const onKeyUp = props.onKeyUp;
    const removeHandlerFactory = props.removeHandlerFactory;

    const tagsToElements = () =>
      tagsForCurrentFile
        .map(tag => (
          <div className="cell shrink" key={tag.id} style={cell_shrink_style}>
            <Tag
              text={tag.name}
              editing={editing}
              removeHandler={removeHandlerFactory(tag.id)}
            />
          </div>
        ))
        .reduce((acc, val) => [...acc, val], []);

    let ans;

    if (editing) {
      const elements = tagsToElements();
      const input_box = (
        <div className="cell shrink" key="__input__" style={cell_shrink_style}>
          <input
            style={input_style}
            onMouseUp={e => {
              e.stopPropagation();
            }}
            onKeyUp={onKeyUp}
            placeholder={new_tag}
            ref={component => {
              this.textInput = component;
            }}
            value={candidate_tag}
            onChange={onChange}
          />
        </div>
      );

      ans = [...elements, input_box];
    } else if (tagsForCurrentFile.length > 0) {
      ans = tagsToElements();
    } else {
      ans = (
        <div
          className="cell shrink"
          key="__closing__"
          style={cell_shrink_style}
        >
          <span>{click_here_to_add}</span>
        </div>
      );
    }

    return <div className="grid-x">{ans}</div>;
  }
}
