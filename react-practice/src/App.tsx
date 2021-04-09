import React from "react";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";

interface Tasks {
  id: string;
  name: string;
  completed: boolean;
}

interface Props {
  tasks: Tasks[];
  HandleSubmit?: React.FormEvent<HTMLFormElement>;
}

function App(props: Props): JSX.Element {
  function addTask(name: string) {
    alert(name);
  }

  const taskList = props.tasks.map((task) => (
    <Todo
      id={task.id}
      name={task.name}
      completed={task.completed}
      key={task.id}
    />
  ));

  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">
        <FilterButton />
        <FilterButton />
        <FilterButton />
      </div>
      <h2 id="list-heading">3 tasks remaining</h2>
      <ul className="todo-list stack-large stack-exception">{taskList}</ul>
    </div>
  );
}

export default App;
