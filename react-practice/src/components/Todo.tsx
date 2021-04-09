import React from 'react';

interface IProps {
  name: string;
  completed: boolean;
  id: string;
  onCheckboxChange: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function Todo(props: IProps) {
  return (
    <li className="todo stack-small">
      <div className="c-cb">
        <input
          id="todo-0"
          type="checkbox"
          defaultChecked={props.completed}
          onChange={() => props.onCheckboxChange(props.id)}
        />
        <label className="todo-label" htmlFor="todo-0">
          {props.name}
        </label>
      </div>
      <div className="btn-group">
        <button type="button" className="btn">
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
    </li>
  );
}
