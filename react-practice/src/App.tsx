import React, { useState } from 'react';
import { nanoid } from 'nanoid';
import Form from './components/Form';
import FilterButton from './components/FilterButton';
import Todo from './components/Todo';

interface ITasks {
  id: string;
  name: string;
  completed: boolean;
}

interface IProps {
  tasks: ITasks[];
  HandleSubmit?: React.FormEvent<HTMLFormElement>;
}

export default function App(props: IProps): JSX.Element {
  const [tasks, setTasks] = useState(props.tasks);

  function addTask(name: string) {
    const newTask = { id: nanoid(), name: name, completed: false };

    setTasks([...tasks, newTask]);
  }

  function toggleTaskCompleted(id: string) {
    const updatedTasks = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, completed: !task.completed };
      }

      return task;
    });
    setTasks(updatedTasks);
  }

  function deleteTask(id: string) {
    const remainingTasks = tasks.filter((task) => id !== task.id);

    setTasks(remainingTasks);
  }

  const taskList = tasks.map((tasks) => (
    <Todo
      id={tasks.id}
      name={tasks.name}
      completed={tasks.completed}
      key={tasks.id}
      onCheckboxChange={toggleTaskCompleted}
      onDelete={deleteTask}
    />
  ));

  const tasksNoun = taskList.length !== 1 ? 'tasks' : 'task';
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form onTaskSubmit={addTask} />
      <div className="filters btn-group stack-exception">
        <FilterButton />
        <FilterButton />
        <FilterButton />
      </div>
      <h2 id="list-heading">{headingText}</h2>
      <ul className="todo-list stack-large stack-exception">{taskList}</ul>
    </div>
  );
}
