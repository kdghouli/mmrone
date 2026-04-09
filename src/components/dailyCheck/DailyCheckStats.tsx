// components/DailyCheckStats.tsx
import React from "react";
import { useDailyCheckStore } from "./dailyCheckStore";
import { MdForklift } from "react-icons/md";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export const DailyCheckStats: React.FC = () => {
  const { chariots, getTodayChecks } = useDailyCheckStore();

  const todayChecks = getTodayChecks();
  const completedChecksToday = todayChecks.length;
  const totalChariots = chariots.length;

  const todayIssues = todayChecks.filter(
    (check) =>
      !check.frein ||
      !check.pneus ||
      !check.eclairage ||
      !check.extincteur ||
      !check.batterie ||
      check.fuite ||
      !check.avertisseur ||
      !check.ceinture ||
      !check.retroviseur,
  ).length;

  const averageKilometrage =
    todayChecks.length > 0
      ? Math.round(
          todayChecks.reduce((sum, check) => sum + check.kilometrage, 0) /
            todayChecks.length,
        )
      : 0;

  const stats = [
    {
      title: "Contrôles aujourd'hui",
      value: `${completedChecksToday}/${totalChariots}`,
      icon: MdForklift,
      color: "blue",
    },
    {
      title: "Problèmes détectés",
      value: todayIssues,
      icon: ExclamationTriangleIcon,
      color: "yellow",
    },
    {
      title: "Conformité",
      value: `${completedChecksToday - todayIssues}/${completedChecksToday}`,
      icon: CheckCircleIcon,
      color: "green",
    },
    {
      title: "Km moyen",
      value: `${averageKilometrage} km`,
      icon: ClockIcon,
      color: "purple",
    },
  ];

  const getColorClasses = (color: string) => {
    const classes = {
      blue: "bg-blue-50 text-blue-700",
      yellow: "bg-yellow-50 text-yellow-700",
      green: "bg-green-50 text-green-700",
      purple: "bg-purple-50 text-purple-700",
    };
    return classes[color as keyof typeof classes] || classes.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className={`rounded-lg p-3 ${getColorClasses(stat.color)}`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
