// lib/ics.mjs — Génère un fichier .ics (norme calendrier universelle) avec un
// événement quotidien récurrent par habitude, à l'heure choisie.
function pad2(n) {
  return String(n).padStart(2, '0');
}

function icsEscape(text) {
  return String(text || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

export function buildICS(habitsList) {
  const now = new Date();
  const dtstamp = now.getUTCFullYear() + pad2(now.getUTCMonth() + 1) + pad2(now.getUTCDate()) + 'T' + pad2(now.getUTCHours()) + pad2(now.getUTCMinutes()) + pad2(now.getUTCSeconds()) + 'Z';
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//La Flamme//Compagnon 90 jours//FR', 'CALSCALE:GREGORIAN'];
  habitsList.forEach((h) => {
    if (!h.heure) return;
    const parts = h.heure.split(':');
    const hh = pad2(parts[0]);
    const mm = pad2(parts[1] || '0');
    const startDateStr = (h.createdDate || now.toISOString().slice(0, 10)).replace(/-/g, '');
    const count = h.dureeEngagementJours || 90;
    lines.push('BEGIN:VEVENT');
    lines.push('UID:' + h.id + '@laflamme.app');
    lines.push('DTSTAMP:' + dtstamp);
    lines.push('DTSTART:' + startDateStr + 'T' + hh + mm + '00');
    lines.push('DURATION:PT15M');
    lines.push('RRULE:FREQ=DAILY;COUNT=' + count);
    lines.push('SUMMARY:' + icsEscape(h.label));
    lines.push('DESCRIPTION:' + icsEscape('Rappel La Flamme' + (h.dureeSession ? ' \u2014 ' + h.dureeSession : '')));
    lines.push('BEGIN:VALARM');
    lines.push('ACTION:DISPLAY');
    lines.push('DESCRIPTION:' + icsEscape(h.label));
    lines.push('TRIGGER:PT0M');
    lines.push('END:VALARM');
    lines.push('END:VEVENT');
  });
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}
