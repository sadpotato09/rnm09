export function sseStream<T>(opts: {
  subscribe: (push: (data: T) => void) => Promise<() => void> | (() => void);
  heartbeatMs?: number;
}) {
  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      let closed = false;
      const push = (event: T) => {
        if (closed) return;
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(event)}\n\n`),
        );
      };
      // Pad to ~2KB so Vercel/nginx proxy flushes immediately instead of buffering
      controller.enqueue(encoder.encode(`: connected ${" ".repeat(2048)}\n\n`));
      const unsubscribe = await opts.subscribe(push);
      const hb = setInterval(() => {
        if (!closed) controller.enqueue(encoder.encode(`: hb\n\n`));
      }, opts.heartbeatMs ?? 15_000);

      const cleanup = () => {
        if (closed) return;
        closed = true;
        clearInterval(hb);
        try {
          unsubscribe();
        } catch {}
        try {
          controller.close();
        } catch {}
      };

      (controller as unknown as { signal?: AbortSignal }).signal?.addEventListener(
        "abort",
        cleanup,
      );

      return cleanup;
    },
  });
}

export const sseHeaders: HeadersInit = {
  "Content-Type": "text/event-stream; charset=utf-8",
  "Cache-Control": "no-cache, no-store, no-transform",
  Connection: "keep-alive",
  "X-Accel-Buffering": "no",
  "X-Content-Type-Options": "nosniff",
  "Transfer-Encoding": "chunked",
};
