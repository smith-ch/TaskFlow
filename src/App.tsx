import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { TaskList } from 'src/TaskFlow0.Web/components/TaskList';
import { TaskForm } from 'src/TaskFlow0.Web/components/TaskForm';
import { taskService } from 'src/TaskFlow0.Data/taskService';
import { Task, statusOrder } from 'src/TaskFlow0.Data/types';
import { DropResult } from 'react-beautiful-dnd';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Partial<Task> | null>(null);

  useEffect(() => {
    setTasks(taskService.getTasks());
  }, []);

  const handleAddOrUpdateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      if (editingTask.id) {
        taskService.updateTask(editingTask as Task);
      } else {
        taskService.addTask(editingTask as Omit<Task, 'id'>);
      }
      setTasks(taskService.getTasks());
      setEditingTask(null);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    taskService.deleteTask(taskId);
    setTasks(taskService.getTasks());
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // Verificar si destination es null o undefined
    if (!destination) return;

    const newTasks = Array.from(tasks);
    const [movedTask] = newTasks.splice(source.index, 1);

    // Actualizar el status basándonos en destination.droppableId
    movedTask.status = statusOrder[parseInt(destination.droppableId)] as 'Pendiente' | 'En Progreso' | 'Completado';
    newTasks.splice(destination.index, 0, movedTask);

    setTasks(newTasks);
    taskService.saveTasks(newTasks);
  };

  return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-full max-w-4xl p-8 bg-white rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center">TaskFlow0</h1>

          <div className="flex justify-center space-x-2 mb-4">
            <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          </div>

          <h2 className="text-2xl font-semibold mb-4 text-center">Lista de Tareas</h2>
          {tasks.length === 0 ? (
              <p className="text-center bg-gray-50 rounded-lg shadow p-4">No hay tareas aún. ¡Haz clic en el botón "+" para agregar una tarea!</p>
          ) : (
              <div className="max-h-[60vh] overflow-y-auto">
                <TaskList
                    tasks={tasks}
                    onDragEnd={onDragEnd}
                    onEditTask={setEditingTask}
                    onDeleteTask={handleDeleteTask}
                />
              </div>
          )}
          <Button
              className="fixed bottom-8 right-8 rounded-full w-14 h-14 shadow-lg"
              onClick={() => setEditingTask({ title: '', description: '', status: 'Pendiente', priority: 'Media' })}
          >
            <PlusIcon className="w-6 h-6" />
          </Button>
          {editingTask && (
              <TaskForm
                  task={editingTask}
                  onSubmit={handleAddOrUpdateTask}
                  onCancel={() => setEditingTask(null)}
                  onChange={(field, value) => setEditingTask(prev => ({ ...prev, [field]: value }))}
              />
          )}
        </div>
      </div>
  );
}
