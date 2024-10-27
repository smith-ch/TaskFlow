import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { PlusIcon, Pencil, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Task {
    id: string
    title: string
    description: string
    status: 'Pendiente' | 'En Progreso' | 'Completado'
    priority: 'Baja' | 'Media' | 'Alta'
}

const statusOrder = ['Pendiente', 'En Progreso', 'Completado']

const taskColors: { [key: string]: string } = {
    Pendiente: 'border-gray-500',
    'En Progreso': 'border-blue-500',
    Completado: 'border-green-500',
}

const taskService = {
    getTasks: (): Task[] => JSON.parse(localStorage.getItem('tasks') || '[]'),
    saveTasks: (tasks: Task[]) => localStorage.setItem('tasks', JSON.stringify(tasks)),
}

function TaskForm({ task, onSubmit, onCancel, onChange }: {
    task: Partial<Task>
    onSubmit: (e: React.FormEvent) => void
    onCancel: () => void
    onChange: (field: keyof Task, value: string) => void
}) {
    return (
        <form onSubmit={onSubmit} className="space-y-4 mt-4">
            <div>
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    value={task.title || ''}
                    onChange={(e) => onChange('title', e.target.value)}
                    required
                />
            </div>
            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={task.description || ''}
                    onChange={(e) => onChange('description', e.target.value)}
                    required
                />
            </div>
            <div>
                <Label htmlFor="status">Status</Label>
                <Select
                    value={task.status || 'Pendiente'}
                    onValueChange={(value) => onChange('status', value as Task['status'])}
                >
                    <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                        <SelectItem value="En Progreso">En Progreso</SelectItem>
                        <SelectItem value="Completado">Completado</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                    value={task.priority || 'Media'}
                    onValueChange={(value) => onChange('priority', value as Task['priority'])}
                >
                    <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Baja">Baja</SelectItem>
                        <SelectItem value="Media">Media</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit">
                    Save
                </Button>
            </div>
        </form>
    )
}

export function TaskList({ tasks, onDragEnd, onEditTask, onDeleteTask }: {
    tasks: Task[]
    onDragEnd: (result: DropResult) => void
    onEditTask: (task: Task) => void
    onDeleteTask: (taskId: string) => void
}) {
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {statusOrder.map((status, statusIndex) => (
                    <Droppable key={status} droppableId={statusIndex.toString()}>
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="bg-gray-100 p-4 rounded-lg"
                            >
                                <h3 className="font-semibold mb-2">{status}</h3>
                                {tasks
                                    .filter((task) => task.status === status)
                                    .map((task, index) => (
                                        <Draggable key={task.id} draggableId={task.id} index={index}>
                                            {(provided) => (
                                                <Card
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`mb-2 ${taskColors[task.status]}`}
                                                >
                                                    <CardHeader>
                                                        <CardTitle>{task.title}</CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <p>{task.description}</p>
                                                        <p>Priority: {task.priority}</p>
                                                    </CardContent>
                                                    <CardFooter className="flex justify-end space-x-2">
                                                        <Button size="sm" variant="outline" onClick={() => onEditTask(task)}>
                                                            <Pencil className="w-4 h-4" />
                                                        </Button>
                                                        <Button size="sm" variant="outline" onClick={() => onDeleteTask(task.id)}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </CardFooter>
                                                </Card>
                                            )}
                                        </Draggable>
                                    ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext>
    )
}

export default function App() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [editingTask, setEditingTask] = useState<Partial<Task> | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    useEffect(() => {
        setTasks(taskService.getTasks())
    }, [])

    const handleAddOrUpdateTask = (e: React.FormEvent) => {
        e.preventDefault()
        if (editingTask) {
            if (editingTask.id) {
                const updatedTasks = tasks.map((task) =>
                    task.id === editingTask.id ? { ...editingTask as Task } : task
                )
                setTasks(updatedTasks)
                taskService.saveTasks(updatedTasks)
            } else {
                const newTask = { ...editingTask, id: Date.now().toString() } as Task
                const updatedTasks = [...tasks, newTask]
                setTasks(updatedTasks)
                taskService.saveTasks(updatedTasks)
            }
            setEditingTask(null)
            setIsDialogOpen(false)
        }
    }

    const handleDeleteTask = (taskId: string) => {
        const updatedTasks = tasks.filter((task) => task.id !== taskId)
        setTasks(updatedTasks)
        taskService.saveTasks(updatedTasks)
    }

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result
        if (!destination) return

        const newTasks = Array.from(tasks)
        const [movedTask] = newTasks.splice(source.index, 1)
        movedTask.status = statusOrder[parseInt(destination.droppableId)] as Task['status']
        newTasks.splice(destination.index, 0, movedTask)

        setTasks(newTasks)
        taskService.saveTasks(newTasks)
    }

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
                    <p className="text-center bg-gray-50 rounded-lg shadow p-4">
                        No hay tareas aún. ¡Haz clic en el botón "+" para agregar una tarea!
                    </p>
                ) : (
                    <div className="max-h-[60vh] overflow-y-auto">
                        <TaskList
                            tasks={tasks}
                            onDragEnd={onDragEnd}
                            onEditTask={(task) => {
                                setEditingTask(task)
                                setIsDialogOpen(true)
                            }}
                            onDeleteTask={handleDeleteTask}
                        />
                    </div>
                )}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="fixed bottom-8 right-8 rounded-full w-14 h-14 shadow-lg"
                            onClick={() => setEditingTask({ title: '', description: '', status: 'Pendiente', priority: 'Media' })}
                        >
                            <PlusIcon className="w-6 h-6" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingTask?.id ? 'Edit Task' : 'Add New Task'}</DialogTitle>
                        </DialogHeader>
                        <TaskForm
                            task={editingTask || {}}
                            onSubmit={handleAddOrUpdateTask}
                            onCancel={() => {
                                setEditingTask(null)
                                setIsDialogOpen(false)
                            }}
                            onChange={(field, value) => setEditingTask((prev) => ({ ...prev, [field]: value }))}
                        />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}