export const saveTasksToLocalStorage = (tasks: any[]) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

export const loadTasksFromLocalStorage = (): any[] => {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
};