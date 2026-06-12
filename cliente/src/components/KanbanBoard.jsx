import {
  closestCorners,
  DndContext,
  PointerSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import DraggableKanbanCard from "./DraggableKanbanCard";
import {
  priorityWeight,
  statusAccentColors,
  statusLabels,
  statusOptions,
} from "../utils/taskOptions";
import { useTaskStatusUpdater } from "../hooks/useTaskStatusUpdater";

function KanbanColumn({ status, tasks, onDeleteClick }) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: {
      status,
    },
  });

  return (
    <section
      ref={setNodeRef}
      className={`min-h-[420px] rounded-md border p-3 transition ${
        isOver
          ? "border-purple-400/70 bg-purple-950/20"
          : "border-zinc-700 bg-zinc-900/35"
      }`}
    >
      <header className="mb-4 flex items-center justify-between border-b border-zinc-700 pb-3">
        <div className="flex items-center gap-2">
          <span
            className={`h-3 w-3 rounded-full ${
              statusAccentColors[status] || "bg-zinc-500"
            }`}
          />
          <h2 className="font-semibold">{statusLabels[status]}</h2>
        </div>

        <span className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
          {tasks.length}
        </span>
      </header>

      {tasks.length === 0 ? (
        <div className="rounded-md border border-dashed border-zinc-700 p-5 text-center text-sm text-zinc-500">
          Drop tasks here
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <DraggableKanbanCard
              key={task._id}
              task={task}
              onDeleteClick={onDeleteClick}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function KanbanBoard({ tasks, onDeleteClick }) {
  const updateTaskStatus = useTaskStatusUpdater();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 180,
        tolerance: 8,
      },
    }),
  );

  const getColumnTasks = (status) => {
    return tasks
      .filter((task) => task.status === status)
      .sort((a, b) => {
        const priorityDifference =
          (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);

        if (priorityDifference !== 0) return priorityDifference;

        const aDueDate = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const bDueDate = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;

        return aDueDate - bDueDate;
      });
  };

  const handleDragEnd = async ({ active, over }) => {
    if (!over) return;

    const task = active.data.current?.task;
    const newStatus = over.data.current?.status || over.id;

    if (!task || !statusOptions.includes(newStatus)) return;

    await updateTaskStatus(task, newStatus);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {statusOptions.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={getColumnTasks(status)}
            onDeleteClick={onDeleteClick}
          />
        ))}
      </div>
    </DndContext>
  );
}

export default KanbanBoard;
