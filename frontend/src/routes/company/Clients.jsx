import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../../api/client";

export function Clients() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  async function load() {
    const { data } = await api.get("/clients", { params: { search } });
    setClients(data);
  }

  useEffect(() => {
    load().catch(() => {});
  }, []);

  async function create(event) {
    event.preventDefault();
    await api.post("/clients", form);
    setForm({ name: "", email: "", phone: "" });
    await load();
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <form onSubmit={create} className="panel p-4">
        <h2 className="text-xl font-semibold">New Client</h2>
        <div className="mt-4 grid gap-3">
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <button className="primary-btn mt-4">
          <Plus size={18} />
          Add client
        </button>
      </form>
      <div className="panel p-4">
        <div className="flex gap-2">
          <input placeholder="Search name or email" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button title="Search" aria-label="Search" onClick={load} className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line bg-white">
            <Search size={18} />
          </button>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-slate-500"><tr><th className="py-2">Name</th><th>Email</th><th>Phone</th></tr></thead>
            <tbody>{clients.map((client) => <tr key={client.id} className="border-b border-line"><td className="py-3 font-medium">{client.name}</td><td>{client.email}</td><td>{client.phone}</td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

