import { Send, Wand2 } from "lucide-react";
import { useState } from "react";
import { api } from "../../api/client";

export function Proposals() {
  const [brief, setBrief] = useState("");
  const [draft, setDraft] = useState("");

  async function generate() {
    const { data } = await api.post("/ai/generate-proposal", { brief });
    setDraft(typeof data.result === "string" ? data.result : JSON.stringify(data.result, null, 2));
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <div className="panel p-4">
        <h2 className="text-xl font-semibold">Proposal Assistant</h2>
        <textarea className="mt-4 min-h-44" placeholder="Project brief" value={brief} onChange={(e) => setBrief(e.target.value)} />
        <button onClick={generate} className="primary-btn mt-4">
          <Wand2 size={18} />
          Draft
        </button>
      </div>
      <div className="panel p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">Draft</h3>
          <button className="rounded-md border border-line bg-white px-3 py-2" title="Send proposal">
            <Send size={18} />
          </button>
        </div>
        <pre className="mt-4 min-h-80 whitespace-pre-wrap rounded-md bg-paper p-4 text-sm">{draft}</pre>
      </div>
    </section>
  );
}

