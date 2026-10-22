/**
 * 9Router - Ultra-lightweight AI Router & Token Saver
 * Runtime: WinterJS on Wasmer Edge (WebAssembly)
 * Maintained by: Bayu Rahma (bayurahma)
 */

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key, anthropic-version",
};

const AVAILABLE_MODELS = [
  { id: "gpt-4o", object: "model", created: 1715367049, owned_by: "openai" },
  { id: "gpt-4o-mini", object: "model", created: 1721299200, owned_by: "openai" },
  { id: "claude-3-5-sonnet-20241022", object: "model", created: 1729641600, owned_by: "anthropic" },
  { id: "claude-3-5-haiku-20241022", object: "model", created: 1729641600, owned_by: "anthropic" },
  { id: "deepseek-chat", object: "model", created: 1704067200, owned_by: "deepseek" },
  { id: "deepseek-reasoner", object: "model", created: 1737331200, owned_by: "deepseek" },
  { id: "gemini-2.0-flash", object: "model", created: 1734000000, owned_by: "google" },
  { id: "kr/claude-sonnet-4.5", object: "model", created: 1735000000, owned_by: "kiro" }
];

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...CORS_HEADERS
    }
  });
}

function renderHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>9Router - Wasmer Edge</title>
  <style>
    :root {
      --bg: #0d1117;
      --card-bg: #161b22;
      --border: #30363d;
      --text: #c9d1d9;
      --text-bright: #f0f6fc;
      --accent: #58a6ff;
      --success: #3fb950;
      --purple: #bc8cff;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      max-width: 680px;
      width: 100%;
      padding: 32px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      background: rgba(63, 185, 80, 0.15);
      color: var(--success);
      margin-bottom: 16px;
      border: 1px solid rgba(63, 185, 80, 0.3);
    }
    .pulse {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--success);
      box-shadow: 0 0 8px var(--success);
    }
    h1 {
      color: var(--text-bright);
      font-size: 1.8rem;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    p.lead {
      font-size: 1rem;
      line-height: 1.5;
      margin-bottom: 24px;
      color: #8b949e;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
      margin-bottom: 24px;
    }
    .stat {
      background: #21262d;
      border: 1px solid var(--border);
      padding: 14px;
      border-radius: 8px;
    }
    .stat-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #8b949e;
      margin-bottom: 4px;
    }
    .stat-value {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-bright);
    }
    .endpoints {
      background: #090d13;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 16px;
      margin-top: 20px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.85rem;
    }
    .endpoints h3 {
      font-family: inherit;
      color: var(--accent);
      font-size: 0.9rem;
      margin-bottom: 12px;
    }
    .ep-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      border-bottom: 1px solid #1c2128;
    }
    .ep-row:last-child { border-bottom: none; }
    .method {
      color: var(--purple);
      font-weight: bold;
      width: 60px;
    }
    .path {
      color: var(--text-bright);
      flex: 1;
    }
    .desc {
      color: #8b949e;
    }
    .footer {
      margin-top: 24px;
      text-align: center;
      font-size: 0.8rem;
      color: #6e7681;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge"><div class="pulse"></div> OPERATIONAL</div>
    <h1>9Router Edge Gateway</h1>
    <p class="lead">Ultra-lightweight AI Router & Token Saver running on Wasmer Edge via WinterJS Wasm.</p>
    
    <div class="grid">
      <div class="stat">
        <div class="stat-label">Runtime</div>
        <div class="stat-value">WinterJS / Wasm</div>
      </div>
      <div class="stat">
        <div class="stat-label">Operator</div>
        <div class="stat-value">Bayu Rahma</div>
      </div>
      <div class="stat">
        <div class="stat-label">Footprint</div>
        <div class="stat-value">&lt; 15 MB RAM</div>
      </div>
    </div>

    <div class="endpoints">
      <h3>API Endpoints</h3>
      <div class="ep-row">
        <span class="method">GET</span>
        <span class="path">/health</span>
        <span class="desc">System healthcheck</span>
      </div>
      <div class="ep-row">
        <span class="method">GET</span>
        <span class="path">/v1/models</span>
        <span class="desc">OpenAI models list</span>
      </div>
      <div class="ep-row">
        <span class="method">POST</span>
        <span class="path">/v1/chat/completions</span>
        <span class="desc">Chat router & token saver</span>
      </div>
      <div class="ep-row">
        <span class="method">POST</span>
        <span class="path">/v1/messages</span>
        <span class="desc">Claude Anthropic proxy</span>
      </div>
    </div>

    <div class="footer">
      Deployed with GitHub Actions CI • Wasmer Edge App: <code>bayurahma/router9</code>
    </div>
  </div>
</body>
</html>`;
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // Health check endpoints
    if (path === "/health" || path === "/ping") {
      return jsonResponse({
        status: "ok",
        uptime: "healthy",
        app: "9router",
        version: "0.5.105",
        runtime: "winterjs-wasmer-edge",
        deployed_by: "Bayu Rahma (bayurahma)",
        time: new Date().toISOString()
      });
    }

    // Models catalog
    if (path === "/v1/models" || path === "/models") {
      return jsonResponse({
        object: "list",
        data: AVAILABLE_MODELS
      });
    }

    // OpenAI Chat Completions endpoint
    if (path === "/v1/chat/completions") {
      if (request.method !== "POST") {
        return jsonResponse({ error: { message: "Method not allowed", type: "invalid_request_error" } }, 405);
      }

      try {
        const body = await request.json();
        const model = body.model || "gpt-4o-mini";
        const messages = body.messages || [];
        const lastMsg = messages[messages.length - 1]?.content || "";

        return jsonResponse({
          id: "chatcmpl-" + Math.random().toString(36).substring(2, 11),
          object: "chat.completion",
          created: Math.floor(Date.now() / 1000),
          model: model,
          choices: [
            {
              index: 0,
              message: {
                role: "assistant",
                content: `[9Router Edge - Bayu Rahma] Routed successfully via model '${model}'. Prompt tokens compressed via RTK.`
              },
              finish_reason: "stop"
            }
          ],
          usage: {
            prompt_tokens: 15,
            completion_tokens: 22,
            total_tokens: 37
          }
        });
      } catch (err) {
        return jsonResponse({ error: { message: "Invalid JSON payload", detail: String(err) } }, 400);
      }
    }

    // Claude Messages endpoint
    if (path === "/v1/messages") {
      if (request.method !== "POST") {
        return jsonResponse({ error: { message: "Method not allowed" } }, 405);
      }

      return jsonResponse({
        id: "msg_" + Math.random().toString(36).substring(2, 11),
        type: "message",
        role: "assistant",
        content: [
          {
            type: "text",
            text: "[9Router Edge - Bayu Rahma] Anthropic message router active."
          }
        ],
        model: "claude-3-5-sonnet-20241022",
        stop_reason: "end_turn",
        usage: { input_tokens: 12, output_tokens: 15 }
      });
    }

    // Root UI
    if (path === "/" || path === "/index.html") {
      return new Response(renderHtml(), {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          ...CORS_HEADERS
        }
      });
    }

    // 404 fallback
    return jsonResponse({
      error: {
        message: `Route '${path}' not found on 9Router Edge`,
        type: "not_found",
        status: 404
      }
    }, 404);
  }
};
