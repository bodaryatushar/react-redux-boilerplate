import {CREATE_TODO,UPDATE_TODO,SELECT_TODO,DELETE_TODO,SAVING,SAVING_DONE,FETCHING,FETCHING_DONE} from '../actions'
import produce from 'immer';

  const initialState = {
    loading: false,
    saving: false,
    todo: {
      title: '',
      done: false,
    },
    todos: [],
  };
  
  export const todoApp = (state = initialState, action) => {
    switch (action.type) {
      case SAVING:
        return produce(state, draft => {
          draft.saving = true;
        });
      case SAVING_DONE:
        return produce(state, draft => {
          draft.saving = false;
        });
      case FETCHING:
        return produce(state, draft => {
          draft.loading = true;
        });
      case FETCHING_DONE:
        return produce(state, draft => {
          draft.todos = action.todos;
          draft.loading = false;
        });
      case CREATE_TODO:
        return produce(state, draft => {
          const todo = draft.todo;
          if (!todo.id) {
            todo.id = Math.random();
            draft.todos.push(todo);
          } else {
            draft.todos = draft.todos.map(item => (item.id === todo.id ? todo : item));
          }
          draft.todo = { title: '', done: false };
        });
      case UPDATE_TODO:
        return produce(state, draft => {
          const { todo } = action;
          const current = (draft.todo = { ...draft.todo, ...todo });
          if (current.id) {
            draft.todos = state.todos.map(
              item => (item.id === current.id ? { ...item, ...current } : item),
            );
          }
        });
      case DELETE_TODO:
        return produce(state, draft => {
          const { todo } = action;
          draft.todo = { title: '', done: false };
          draft.todos = draft.todos.filter(item => item.id !== todo.id);
        });
      case SELECT_TODO:
        return produce(state, draft => {
          const { todo } = action;
          draft.todo = todo;
        });
      default:
        return state;
    }
  };