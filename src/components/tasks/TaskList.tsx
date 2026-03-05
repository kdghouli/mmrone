import React, { useState, useEffect } from "react";
import { useTaskStore } from "../../stores/useTaskStore";
import type { Task, TaskFormData } from "./task.types";
import { TaskCard } from "./TaskCard";
import { TaskForm } from "./TaskForm";
import { TaskFilters } from "./TaskFilters";
import { Modal } from "./Modal";
import { Button } from "./Button";

export const TaskList: React.FC = () => {
  const {
    filteredTasks,
    loading,
    error,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    setFilters,
    clearFilters,
  } = useTaskStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = () => {
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: TaskFormData) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
    } else {
      await addTask(data);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
      await deleteTask(id);
    }
  };

  if (loading && filteredTasks.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestion des Tâches</h1>
        <Button variant="primary" onClick={handleAddTask}>
          + Nouvelle tâche
        </Button>
      </div>

      <TaskFilters onFilterChange={setFilters} onClearFilters={clearFilters} />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.length === 0 && (
          <div className="text-center text-gray-500">Aucune tâche trouvée.</div>
        )}
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={handleEditTask}
            onDelete={handleDelete}
            onStatusChange={updateTaskStatus}
          />
        ))}
      </div>

      {filteredTasks.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Aucune tâche trouvée</p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTask ? "Modifier la tâche" : "Nouvelle tâche"}
      >
        <TaskForm
          task={editingTask}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
