import type { AstroCookies } from 'astro';

export type Value = string | number | null;
export type Row = Record<string, Value>;
export interface Session {
  id: string;
  csrf: string;
  userId: number | null;
  groupId: number | null;
  username: string;
  cartId: string;
}
export interface RequestContext {
  request: Request;
  url: URL;
  path: string;
  form: FormData;
  params: URLSearchParams;
  db: D1Database;
  bucket: R2Bucket;
  env: Env;
  cookies: AstroCookies;
  session: Session;
}
export interface PageResult {
  html: string;
  title: string;
  description?: string;
  keywords?: string;
  kind: 'public' | 'admin' | 'standalone';
  status?: number;
}
