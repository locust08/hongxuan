export function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]!);
}
export const attr = escapeHtml;
export function redirect(path: string, status = 303): Response {
  if (!path.startsWith('/') || path.startsWith('//') || /[\r\n]/.test(path)) {
    throw new Error('Invalid local redirect');
  }
  return new Response(null, { status, headers: { Location: path } });
}
