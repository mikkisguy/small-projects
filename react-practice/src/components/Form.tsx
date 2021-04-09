import React from "react";

interface Props {
  addTask: any
}

export default function Form(props: Props) {
  function HandleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    props.addTask("jee");
  }

  return (
    <form onSubmit={HandleSubmit}>
      <h2 className="label-wrapper">
        <label htmlFor="new-todo-input" className="label__lg">
          What needs to be done?
        </label>
      </h2>
      <input
        type="text"
        id="new-todo-input"
        className="input input__lg"
        name="text"
        autoComplete="off"
      />
      <button type="submit" className="btn btn__primary btn__lg">
        Add
      </button>
    </form>
  );
}
