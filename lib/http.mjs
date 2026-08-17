// lib/http.mjs — petit utilitaire pour renvoyer du JSON de façon cohérente.
export function json(data, init) {
  const headers = Object.assign({ 'Content-Type': 'application/json; charset=utf-8' }, (init && init.headers) || {});
  return new Response(JSON.stringify(data), Object.assign({}, init, { headers }));
}
