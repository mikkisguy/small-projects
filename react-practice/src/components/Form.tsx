import React, { useState } from 'react';

interface IProps {
  onTaskSubmit: (name: string) => void;
}

export default function Form(props: IProps) {
  const [name, setName] = useState<string>('');

  function HandleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    props.onTaskSubmit(name);
    setName('');
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setName(event.target.value);
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
        value={name}
        onChange={handleChange}
      />
      <button type="submit" className="btn btn__primary btn__lg">
        Add
      </button>
    </form>
  );
}
