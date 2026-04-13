import { env } from 'cloudflare:workers';

import { createMcpAgent } from '@cloudflare/playwright-mcp';

export const PlaywrightMCP = createMcpAgent(env.BROWSER, {imageResponses: "allow"} as any);

const sseHandler = PlaywrightMCP.serveSSE('/sse');
const mcpHandler = PlaywrightMCP.serve('/mcp');

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const { pathname } = new URL(request.url);

    if (pathname === '/sse' || pathname.startsWith('/sse/')) {
      return sseHandler.fetch(request, env, ctx);
    }

    if (pathname === '/mcp') {
      return mcpHandler.fetch(request, env, ctx);
    }

    return new Response('Not Found', { status: 404 });
  },
};