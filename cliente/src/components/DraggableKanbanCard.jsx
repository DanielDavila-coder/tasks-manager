import { useDraggable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";

function DraggableKanbanCard({ task, onDeleteClick }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task._id,
      data: {
        task,
      },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={isDragging ? "relative z-50 opacity-70" : ""}
    >
      <TaskCard task={task} onDeleteClick={onDeleteClick} variant="kanban" />
    </div>
  );
}

export default DraggableKanbanCard;
