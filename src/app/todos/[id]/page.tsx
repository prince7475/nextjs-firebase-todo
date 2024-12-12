// src/app/todos/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Todo } from '@/types/todo';

export default function TodoPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const fetchTodo = async () => {
      const docRef = doc(db, 'todos', params.id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const todoData = { id: docSnap.id, ...docSnap.data() } as Todo;
        setTodo(todoData);
        setTitle(todoData.title);
      }
    };

    fetchTodo();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await updateDoc(doc(db, 'todos', params.id), {
      title: title
    });
    router.push('/');
  };

  if (!todo) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Todo</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />
        <div className="space-x-2">
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}