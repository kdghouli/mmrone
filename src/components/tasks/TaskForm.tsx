import React, { useState, useEffect, useRef } from "react";
import type { Task, TaskFormData } from "./task.types";
import { Button } from "./Button";

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
}

const initialFormData: TaskFormData = {
  title: "",
  description: "",
  priority: "medium",
  status: "open",
  urgence: "medium",
};

export const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<TaskFormData>(() => {
    // Initialize with task data if provided, otherwise use initial data
    if (task) {
      return {
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "medium",
        status: task.status || "open",
        urgence: task.urgence || "medium",
      };
    }
    return initialFormData;
  });
  const prevTaskId = useRef(task?.id);

  useEffect(() => {
    // Only update if task exists and its id has changed
    if (task && task.id !== prevTaskId.current) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "medium",
        status: task.status || "open",
        urgence: task.urgence || "medium",
      });
      prevTaskId.current = task.id; // Update the ref after setting state
    }
  }, [task]);

   const handleChange = (
     e: React.ChangeEvent<
       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
     >,
   ) => {
     const { name, value } = e.target;
     setFormData((prev) => ({ ...prev, [name]: value }));
   };

   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     onSubmit(formData);
   };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Titre
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priorité
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Statut
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Urgence
          </label>
          <select
            name="urgence"
            value={formData.urgence}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" variant="primary">
          {task ? "Mettre à jour" : "Créer"}
        </Button>
      </div>
    </form>
  );
};
