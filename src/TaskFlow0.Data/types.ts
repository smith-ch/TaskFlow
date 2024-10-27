export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Pendiente' | 'En Progreso' | 'Completado';
  priority: 'Baja' | 'Media' | 'Alta';
}

export const statusOrder = ['Pendiente', 'En Progreso', 'Completado'];