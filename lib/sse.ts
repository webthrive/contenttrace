// Read a server-sent event stream ("data: {json}" blocks) and pass each event to onEvent.
// Returns when the stream closes. Throws if onEvent throws.
export async function readEvents(res: Response, onEvent: (e: Record<string, unknown>) => void): Promise<void> {
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const blocks = buffer.split("\n\n");
    buffer = blocks.pop() ?? "";
    for (const block of blocks) {
      if (!block.startsWith("data: ")) continue;
      let event: Record<string, unknown>;
      try { event = JSON.parse(block.slice(6)); } catch { continue; }
      onEvent(event);
    }
  }
}

// Error text from a failed (non-stream) response. The server can return an HTML error page, so do not assume JSON.
export async function errorOf(res: Response, fallback: string): Promise<{ message: string; code?: string }> {
  try {
    const j = await res.json();
    return { message: typeof j?.error === "string" ? j.error : fallback, code: typeof j?.code === "string" ? j.code : undefined };
  } catch {
    return { message: fallback };
  }
}
