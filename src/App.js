import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import {CREATE_TODO,UPDATE_TODO,SELECT_TODO,DELETE_TODO,SAVING,SAVING_DONE,FETCHING,FETCHING_DONE} from './actions'
import store  from "./store";

const fetchTodos = () => dispach => {
  return new Promise(resolve => {
    dispach({
      type: FETCHING,
    });
    setTimeout(() => {
      dispach({
        type: FETCHING_DONE,
        todos: [
          {
            id: Math.random(),
            title: 'Hello...',
            done: false,
          },
          {
            id: Math.random(),
            title: 'World...',
            done: false,
          },
          {
            id: Math.random(),
            title: 'Hello World...',
            done: true,
          },
        ],
      });
    }, 1000);
  });
};

const createTodo = () => dispach => {
  return new Promise(resolve => {
    dispach({
      type: SAVING,
    });
    setTimeout(() => {
      dispach({
        type: CREATE_TODO,
      });
      dispach({
        type: SAVING_DONE,
      });
      resolve();
    }, 1000);
  });
};

const updateTodo = todo => {
  return {
    type: UPDATE_TODO,
    todo,
  };
};

const selectTodo = todo => {
  return {
    type: SELECT_TODO,
    todo,
  };
};

const deleteTodo = todo => {
  return {
    type: DELETE_TODO,
    todo,
  };
};

const TodoItem = ({ todo, select, toggle }) => (
  <li onClick={e => select(todo)}>
    <input type="checkbox" checked={todo.done} onChange={e => toggle(todo)} />
    {todo.title}
  </li>
);

const TodoListComponent = ({ loading, todos, completed, select, toggle }) => {
  if (loading) return <div>Loading...</div>;
  return (
    <React.Fragment>
      <ul>
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} select={select} toggle={toggle} />
        ))}
      </ul>
      <div>Completed: {completed}</div>
    </React.Fragment>
  );
};

class TodoEditorComponent extends Component {
  input = React.createRef();

  onSubmit = e => {
    const { create } = this.props;
    e.preventDefault();
    create(this.input.current.value);
    this.input.current.value = '';
    this.input.current.focus();
  };

  render() {
    const { todo, saving, update, remove } = this.props;
    return (
      <form onSubmit={this.onSubmit}>
        <input
          type="text"
          ref={this.input}
          disabled={saving}
          value={todo.title}
          onChange={e => update(e.target.value)}
        />
        <button disabled={saving}>Add</button>
        {todo.id && (
          <button type="button" disabled={saving} onClick={e => remove(todo)}>
            Delete
          </button>
        )}
      </form>
    );
  }
}

const TodoEditor = connect(
  state => ({
    todo: state.todo,
    saving: state.saving,
  }),
  dispach => ({
    create: () => dispach(createTodo()),
    update: title => dispach(updateTodo({ title })),
    remove: todo => dispach(deleteTodo(todo)),
  }),
)(TodoEditorComponent);

const TodoList = connect(
  state => ({
    todos: state.todos,
    loading: state.loading,
    completed: state.todos.filter(item => item.done).length,
  }),
  dispatch => ({
    select: todo => dispatch(selectTodo(todo)),
    toggle: todo => dispatch(updateTodo({ ...todo, done: !todo.done })),
  }),
)(TodoListComponent);

class Todos extends Component {
  componentDidMount() {
    store.dispatch(fetchTodos());
  }

  render() {
    return (
      <Provider store={store}>
        <div>
          <TodoEditor todo={{ title: '' }} />
          <TodoList />
        </div>
      </Provider>
    );
  }
}

export default Todos;