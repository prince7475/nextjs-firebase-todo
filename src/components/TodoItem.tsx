import { useState } from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Todo } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
}

export default function TodoItem({ todo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const toggleComplete = async () => {
    await updateDoc(doc(db, 'todos', todo.id), {
      completed: !todo.completed
    });
  };

  const deleteTodo = async () => {
    await deleteDoc(doc(db, 'todos', todo.id));
  };

  const updateTitle = async () => {
    if (!editedTitle.trim()) return;
    await updateDoc(doc(db, 'todos', todo.id), {
      title: editedTitle
    });
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-2 p-2 border rounded">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={toggleComplete}
      />
      {isEditing ? (
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          onBlur={updateTitle}
          className="flex-1 px-2 py-1 border rounded"
          autoFocus
        />
      ) : (
        <span
          className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.title}
        </span>
      )}
      <button
        onClick={deleteTodo}
        className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
      >
        Delete
      </button>
    </div>
  );
}