import { HistoryItem } from "@/types";

export default function Sidebar({ history }: { history: HistoryItem[] }) {
  return (
      <aside className="bg-slate-900 text-slate-100 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-6">App Logo</h2>
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
            {history.length > 0 && (
              <h3 className="text-sm font-semibold mb-2">History</h3>
            )}
            <div className="space-y-1">
              {history.map((item) => (
                <div key={item.id} className="p-2 bg-slate-800 rounded">
                  <p className="text-sm">{item.input}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
        <div className="text-sm text-slate-400">User Profile</div>
      </aside>
  );
}
