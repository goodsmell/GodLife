import { type FormEvent, useState } from "react";
import { useTodayGoalLog } from "../../../../hooks/useTodayGoalLog";
import { useDayLog } from "../../../../hooks/useDayLog";
import type { TodoItem } from "../../../../types/setting";

type TodoSectionProps = {
  dateKey?: string;
  readOnly?: boolean;
};

export default function TodoSection({
  dateKey,
  readOnly = false,
}: TodoSectionProps) {
  const store = dateKey ? useDayLog(dateKey, { readOnly }) : useTodayGoalLog();

  const { loading, todos, setTodos } = store;
  const [input, setInput] = useState("");

  if (loading) return null;

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (readOnly) return;

    const text = input.trim();
    if (!text) return;

    const newTodo: TodoItem = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      text,
      done: false,
    };

    setTodos([...todos, newTodo]);
    setInput("");
  };

  const toggleTodo = (id: string) => {
    if (readOnly) return;
    const next = todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    setTodos(next);
  };

  const deleteTodo = (id: string) => {
    if (readOnly) return;
    const next = todos.filter((t) => t.id !== id);
    setTodos(next);
  };

  return (
    <section className="w-full rounded-xl bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-base font-semibold text-gray-800">TODO LIST</h3>

      {!readOnly && (
        <form onSubmit={handleAdd} className="mb-3 flex gap-2">
          <input
            type="text"
            placeholder="할 일을 입력하세요"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
          />
          <button
            type="submit"
            className="rounded-lg bg-indigo-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-600"
          >
            추가
          </button>
        </form>
      )}

      {todos.length === 0 ? (
        <p className="text-xs text-gray-400">등록된 투두가 없어요.</p>
      ) : (
        <ul className="space-y-1">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between rounded-lg bg-slate-50 px-2 py-1.5"
            >
              <label className="flex flex-1 items-center gap-2">
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => toggleTodo(todo.id)}
                  disabled={readOnly}
                  className="h-4 w-4 accent-indigo-500"
                />
                <span
                  className={`text-sm ${
                    todo.done ? "text-gray-400 line-through" : "text-gray-800"
                  }`}
                >
                  {todo.text}
                </span>
              </label>

              {!readOnly && (
                <button
                  type="button"
                  onClick={() => deleteTodo(todo.id)}
                  className="ml-2 text-xs text-gray-400 hover:text-red-500"
                >
                  삭제
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
