import React from "react";
import type { Task } from "./task.types";
import { Button } from "./Button";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: Task["status"]) => void;
}

const priorityColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
};

const statusColors = {
  open: "bg-blue-100 text-blue-800",
  in_progress: "bg-purple-100 text-purple-800",
  closed: "bg-gray-100 text-gray-800",
};

const urgenceColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  urgent: "bg-red-100 text-red-800",
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" onClick={() => onEdit(task)}>
            ✏️
          </Button>
          <Button variant="danger" size="sm" onClick={() => onDelete(task.id)}>
            🗑️
          </Button>
        </div>
      </div>

      <p className="text-gray-600 mb-4">{task.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}
        >
          Priority: {task.priority}
        </span>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}
        >
          Status: {task.status.replace("_", " ")}
        </span>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${urgenceColors[task.urgence]}`}
        >
          Urgence: {task.urgence}
        </span>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>Créée: {formatDate(task.created_at)}</span>
        <select
          value={task.status}
          onChange={(e) =>
            onStatusChange(task.id, e.target.value as Task["status"])
          }
          className="border rounded-md px-2 py-1 text-sm"
        >
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
      </div>
    </div>
  );
};
