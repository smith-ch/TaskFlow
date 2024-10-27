import { Task } from 'src/TaskFlow0.Data/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface TaskFormProps {
    task: Partial<Task>;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    onChange: (field: keyof Task, value: string) => void;
}


export function TaskForm({ task, onSubmit, onCancel, onChange }: TaskFormProps) {
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
                    onValueChange={(value) => onChange('status', value)}
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
                    onValueChange={(value) => onChange('priority', value)}
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
    );
}