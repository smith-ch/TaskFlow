import { taskService } from '../TaskFlow0.Data/taskService';
import { Task } from '../TaskFlow0.Data/types';

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('taskService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('addTask should add a new task', () => {
    const newTask: Omit<Task, 'id'> = { title: 'Test Task', description: 'Test Description', status: 'Pendiente', priority: 'Media' };
    taskService.addTask(newTask);
    const tasks = taskService.getTasks();
    expect(tasks.length).toBe(1);
    expect(tasks[0].title).toBe(newTask.title);
  });

  test('updateTask should update an existing task', () => {
    const newTask: Omit<Task, 'id'> = { title: 'Test Task', description: 'Test Description', status: 'Pendiente', priority: 'Media' };
    taskService.addTask(newTask);
    const tasks = taskService.getTasks();
    const updatedTask: Task = { ...tasks[0], title: 'Updated Task' };
    taskService.updateTask(updatedTask);

    const updatedTasks = taskService.getTasks();
    expect(updatedTasks.length).toBe(1);
    expect(updatedTasks[0].title).toBe('Updated Task');
  });

  test('deleteTask should remove a task', () => {
    const newTask: Omit<Task, 'id'> = { title: 'Test Task', description: 'Test Description', status: 'Pendiente', priority: 'Media' };
    taskService.addTask(newTask);
    const tasks = taskService.getTasks();
    taskService.deleteTask(tasks[0].id);
    expect(taskService.getTasks().length).toBe(0);
  });
});