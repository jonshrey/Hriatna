import type { ChatMessage } from "@/types";

export default function Sidebar({ messages }: { messages: ChatMessage[] }) {
  const hasMessages = messages.length > 0;

  return (
    <aside className="bg-slate-900 text-slate-100 p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-6">Hriatna</h2>

        <nav className="space-y-2">
          <a href="#" className="block p-2 rounded hover:bg-slate-800">
            Dashboard
          </a>
          <a href="#" className="block p-2 rounded hover:bg-slate-800">
            Analytics
          </a>
          <a href="#" className="block p-2 rounded hover:bg-slate-800">
            Settings
          </a>
        </nav>

        <section className="mt-6">
          <h3 className="text-sm font-semibold mb-2">Chats</h3>

          <div className="p-3 bg-slate-800 rounded">
            <p className="text-sm text-slate-100">Current chat</p>
            <p className="text-xs text-slate-400">
              {hasMessages
                ? `${messages.length} messages`
                : "No messages yet"}
            </p>
          </div>
        </section>
      </div>

      <div className="text-sm text-slate-400">User Profile</div>
    </aside>
  );
}