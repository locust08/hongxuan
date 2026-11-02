import { handle } from '@astrojs/cloudflare/handler';
import { drainOutbox } from './server/core/mail';

export default {
  async fetch(request, env, ctx) {
    return handle(request, env, ctx);
  },
  async scheduled(_controller, env, ctx) {
    ctx.waitUntil(drainOutbox(env));
  },
} satisfies ExportedHandler<Env>;
