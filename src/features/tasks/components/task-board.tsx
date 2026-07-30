'use client';

import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Task, TaskStatus } from '../types/task.types';
import { TaskColumn } from './task-column';
import { TaskCard } from './task-card';
import { useUpdateTaskStatus } from '../hooks/use-task-mutations';
import { useProjectMembers } from '@/src/features/projects/hooks/use-project-members';
import { useTranslations } from 'next-intl';

interface TaskBoardProps {
  projectId: string;
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

const COLUMNS: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];

export function TaskBoard({ projectId, tasks, onTaskClick }: TaskBoardProps) {
  const tStatus = useTranslations('status');
  const updateStatusMutation = useUpdateTaskStatus(projectId);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { data: members = [] } = useProjectMembers(projectId);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeTaskId = String(active.id);
    const overId = String(over.id);

    // Find target column status
    let targetStatus: TaskStatus | null = null;
    if (COLUMNS.includes(overId as TaskStatus)) {
      targetStatus = overId as TaskStatus;
    } else {
      // Over another task card
      const targetTask = tasks.find((t) => t.id === overId);
      if (targetTask) {
        targetStatus = targetTask.status as TaskStatus;
      }
    }

    const currentTask = tasks.find((t) => t.id === activeTaskId);
    if (currentTask && targetStatus && currentTask.status !== targetStatus) {
      updateStatusMutation.mutate({ taskId: activeTaskId, newStatus: targetStatus });
    }
  };

  const tasksByStatus = (status: TaskStatus) =>
    tasks.filter((t) => (t.status || 'TODO').toUpperCase() === status);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveTask(null)}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            title={
              status === 'TODO'
                ? tStatus('todo')
                : status === 'IN_PROGRESS'
                ? tStatus('in_progress')
                : status === 'IN_REVIEW'
                ? tStatus('in_review')
                : tStatus('completed')
            }
            tasks={tasksByStatus(status)}
            onTaskClick={onTaskClick}
            members={members}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} isOverlay members={members} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
