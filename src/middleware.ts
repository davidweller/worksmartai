import { defineMiddleware } from 'astro:middleware';

import { createAcademyServerClient } from '~/lib/supabase/server';

/** Refresh Supabase auth cookies so API routes and SSR see the same session as the browser client. */
export const onRequest = defineMiddleware(async (context, next) => {
  // During static prerender, Astro's cookie store may not expose `getAll` (build-time).
  if (typeof context.cookies.getAll !== 'function') {
    return next();
  }

  const supabase = createAcademyServerClient(context.cookies);
  await supabase.auth.getUser();
  return next();
});
