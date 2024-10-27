// src/TaskFlow0.Data/taskService.ts
import { Task } from './types';
import { saveTasksToLocalStorage, loadTasksFromLocalStorage } from '@/utils/localStorage';

let tasks: Task[] = loadTasksFromLocalStorage();


export const taskService = {
  getTasks: () => tasks,
  addTask: (task: Omit<Task, 'id'>) => {
    const newTask = { ...task, id: Date.now().toString() };
    tasks.push(newTask);
    saveTasksToLocalStorage(tasks);
  },

  updateTask: (updatedTask: Task) => {
    tasks = tasks.map(task => task.id === updatedTask.id ? updatedTask : task);
    saveTasksToLocalStorage(tasks);
  },

  deleteTask: (taskId: string) => {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasksToLocalStorage(tasks);
  },

  saveTasks: (newTasks: Task[]) => {
    tasks = newTasks;
    saveTasksToLocalStorage(tasks);
    
  }
};
