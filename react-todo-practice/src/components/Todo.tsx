import React, { useEffect, useRef, useState } from 'react';

interface IProps {
  name: string;
  completed: boolean;
  id: string;
  onCheckboxChange: (id: string) => void;
  onDelete: (id: string) => void;
  editTask: (id: string, newName: string) => void;
}

export default function Todo(props: IProps) {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState('');

  const editFieldRef = useRef<HTMLInputElement>(null);
  const editButtonRef = useRef<HTMLButtonElement>(null);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNewName(event.target.value);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    props.editTask(props.id, newName);
    setNewName('');
    setEditing(false);
  }

  const editingTemplate = (
    <form className="stack-small" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="todo-label" htmlFor={props.id}>
          New name for {props.name}
        </label>
        <input
          id={props.id}
          className="todo-text"
          type="text"
          value={newName}
          onChange={handleChange}
          ref={editFieldRef}
        />
      </div>
      <div className="btn-group">
        <button
          type="button"
          className="btn todo-cancel"
          onClick={() => setEditing(false)}
          ref={editButtonRef}
        >
          Cancel
          <span className="visually-hidden">renaming {props.name}</span>
        </button>
        <button type="submit" className="btn btn__primary todo-edit">
          Save
          <span className="visually-hidden">new name for {props.name}</span>
        </button>
      </div>
    </form>
  );
  const viewTemplate = (
    <div className="stack-small">
      <div className="c-cb">
        <input
          id={props.id}
          type="checkbox"
          defaultChecked={props.completed}
          onChange={() => props.onCheckboxChange(props.id)}
        />
        <label className="todo-label" htmlFor={props.id}>
          {props.name}
        </label>
      </div>
      <div className="btn-group">
        <button type="button" className="btn" onClick={() => setEditing(true)}>
          Edit <span className="visually-hidden">{props.name}</span>
        </button>
        <button
          type="button"
          className="btn btn__danger"
          onClick={() => props.onDelete(props.id)}
        >
          Delete <span className="visually-hidden">{props.name}</span>
        </button>
      </div>
    </div>
  );

  useEffect(() => {
    if (editing && editFieldRef.current !== null) {
      editFieldRef.current.focus();
    } else if (!editing && editButtonRef.current !== null) {
      editButtonRef.current.focus();
    }
  }, [editing]);

  return <li className="todo">{editing ? editingTemplate : viewTemplate}</li>;
}
