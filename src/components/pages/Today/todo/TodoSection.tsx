import { type FormEvent, useState } from "react";
import { useTodayGoalLog } from "../../../../hooks/useTodayGoalLog";
import type { TodoItem } from "../../../../types/setting";

export default function TodoSection() {
  const { loading, todos, setTodos } = useTodayGoalLog();
  const [input, setInput] = useState("");

  if (loading) return null;

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
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
    const next = todos.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t,
    );
    setTodos(next);
  };

  const deleteTodo = (id: string) => {
    const next = todos.filter((t) => t.id !== id);
    setTodos(next);
  };

  return (
    <section className="w-full rounded-xl bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-base font-semibold text-gray-800">투두 리스트</h3>

      {/* 입력 폼 */}
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

      {/* 투두 목록 */}
      {todos.length === 0 ? (
        <p className="text-sm text-gray-400">아직 등록된 투두가 없어요.</p>
      ) : (
        <ul className="space-y-1">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between rounded-lg bg-slate-50 px-2 py-1.5"
            >
              <label className="flex flex-1 cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => toggleTodo(todo.id)}
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

              <button
                type="button"
                onClick={() => deleteTodo(todo.id)}
                className="ml-2 text-xs text-gray-400 hover:text-red-500"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
