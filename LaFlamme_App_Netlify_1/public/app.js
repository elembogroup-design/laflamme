(function () {
  'use strict';

  var GOLD = '#D9A441', DARK = '#3F0F1D', CREAM = '#F4E9DC';
  var DUREE_OPTIONS = [7, 21, 30, 60, 90];

  var SCALE = [
    { v: 1, label: 'Jamais' },
    { v: 2, label: 'Parfois' },
    { v: 3, label: 'Souvent' },
    { v: 4, label: 'Toujours' },
  ];

  var CAPACITIES = [
    {
      id: 'vision', label: 'Vision',
      statement: "Je sais clairement ce que Dieu m'appelle à faire actuellement.",
      verseRef: 'Habacuc 2:2', verseText: "Écris la vision, et grave-la sur des tables, afin qu'on la lise couramment.",
      suggestion: 'Prends 15 minutes cette semaine pour écrire ou réécrire ta vision.',
    },
    {
      id: 'mission', label: 'Mission',
      statement: 'Je sers activement les personnes autour de moi avec mes compétences actuelles.',
      verseRef: 'Marc 10:45', verseText: "Le Fils de l'homme est venu, non pour être servi, mais pour servir.",
      suggestion: "Propose une compétence que tu as déjà à quelqu'un cette semaine.",
    },
    {
      id: 'gouvernance', label: 'Gouvernance de soi',
      statement: "Je tiens mes engagements (temps, argent, parole) même quand c'est inconfortable.",
      verseRef: 'Matthieu 5:37', verseText: 'Que votre parole soit oui, oui, non, non.',
      suggestion: 'Choisis un engagement non tenu récemment et répare-le cette semaine.',
    },
    {
      id: 'former', label: 'Servir et former',
      statement: "Je forme ou j'aide quelqu'un d'autre à grandir, pas seulement moi-même.",
      verseRef: '2 Timothée 2:2', verseText: "Confie-le à des hommes fidèles, capables de l'enseigner aussi à d'autres.",
      suggestion: 'Identifie une personne à qui transmettre une compétence ce mois-ci.',
    },
    {
      id: 'discipline', label: 'Discipline / rythme',
      statement: "J'ai un rythme régulier de prière et de parole, même imparfait.",
      verseRef: 'Psaume 1:2-3', verseText: "Il médite jour et nuit... il est comme un arbre planté près d'un courant d'eau.",
      suggestion: 'Fixe un rendez-vous quotidien fixe de 10 minutes, même court.',
    },
    {
      id: 'communaute', label: 'Communauté / redevabilité',
      statement: 'Une personne connaît mes objectifs et me pose des questions honnêtes régulièrement.',
      verseRef: 'Ecclésiaste 4:9-10', verseText: "Deux valent mieux qu'un... car s'ils tombent, l'un relève son compagnon.",
      suggestion: "Choisis ton partenaire de redevabilité aujourd'hui même.",
    },
  ];

  var IKIGAI_QUESTIONS = [
    { id: 'passion', label: "Ce que j'aime faire", verseRef: 'Psaume 37:4', verseText: "Fais de l'Éternel tes délices, et il te donnera ce que ton cœur désire.", placeholder: 'ex. chanter, organiser, enseigner...' },
    { id: 'don', label: 'Ce dans quoi je suis doué', verseRef: 'Romains 12:6', verseText: 'Nous avons des dons différents, selon la grâce qui nous a été accordée.', placeholder: 'ex. parler en public, réparer, écouter...' },
    { id: 'besoin', label: 'Ce dont mon entourage a besoin', verseRef: 'Galates 6:10', verseText: 'Faisons du bien à tous, et surtout à ceux de la famille de la foi.', placeholder: 'ex. accompagnement, formation, écoute...' },
    { id: 'ressource', label: 'Ce pour quoi je peux être payé', verseRef: '1 Timothée 5:18', verseText: "L'ouvrier mérite son salaire.", placeholder: 'ex. un métier, un service rémunéré...' },
  ];

  var IKIGAI_SVG = `<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;">
    <circle cx="250" cy="155" r="150" fill="#D9A441" fill-opacity="0.7" />
    <circle cx="345" cy="250" r="150" fill="#D9536B" fill-opacity="0.7" />
    <circle cx="250" cy="345" r="150" fill="#E08F4A" fill-opacity="0.7" />
    <circle cx="155" cy="250" r="150" fill="#A8496A" fill-opacity="0.7" />
    <text x="250" y="108" text-anchor="middle" fill="#F4E9DC" font-size="15" font-weight="600" letter-spacing="0.5"><tspan x="250" dy="0">CE QUE</tspan><tspan x="250" dy="15">J\u2019AIME</tspan></text>
    <text x="392" y="235" text-anchor="middle" fill="#F4E9DC" font-size="15" font-weight="600" letter-spacing="0.5"><tspan x="392" dy="0">CE DONT LE</tspan><tspan x="392" dy="15">MONDE A</tspan><tspan x="392" dy="15">BESOIN</tspan></text>
    <text x="250" y="392" text-anchor="middle" fill="#F4E9DC" font-size="15" font-weight="600" letter-spacing="0.5"><tspan x="250" dy="0">CE POUR QUOI</tspan><tspan x="250" dy="15">JE PEUX ÊTRE</tspan><tspan x="250" dy="15">PAYÉ</tspan></text>
    <text x="108" y="235" text-anchor="middle" fill="#F4E9DC" font-size="15" font-weight="600" letter-spacing="0.5"><tspan x="108" dy="0">CE DANS QUOI</tspan><tspan x="108" dy="15">JE SUIS</tspan><tspan x="108" dy="15">DOUÉ</tspan></text>
    <text x="202" y="202" text-anchor="middle" fill="#ffffff" font-size="13" font-weight="700" letter-spacing="0.5">PASSION</text>
    <text x="298" y="202" text-anchor="middle" fill="#ffffff" font-size="13" font-weight="700" letter-spacing="0.5">MISSION</text>
    <text x="202" y="298" text-anchor="middle" fill="#ffffff" font-size="13" font-weight="700" letter-spacing="0.5">PROFESSION</text>
    <text x="298" y="298" text-anchor="middle" fill="#ffffff" font-size="13" font-weight="700" letter-spacing="0.5">VOCATION</text>
    <text x="250" y="255" text-anchor="middle" fill="#D9A441" font-size="22" font-weight="800" letter-spacing="1">IKIGAI</text>
  </svg>`;

  function sortedCapacities(scores) {
    scores = scores || {};
    return CAPACITIES.slice().sort(function (a, b) { return (scores[a.id] || 5) - (scores[b.id] || 5); });
  }
  function diagnosticDone(p) {
    var scores = p.scores || {};
    return CAPACITIES.every(function (c) { return !!scores[c.id]; });
  }
  function ikigaiDone(p) {
    return !!(p.passion && p.passion.trim());
  }
  function saveScore(capacityId, value) {
    var scores = Object.assign({}, state.server.profile.scores, {});
    scores[capacityId] = value;
    api('/api/profile', 'POST', { scores: scores }).then(function (data) {
      state.server = data;
      render();
    });
  }

  var state = {
    view: 'loading',
    authMode: 'login',
    authError: '',
    user: null,
    server: null, // {profile, habits, logs, displayName}
    onboardingStep: 0,
    selectedDay: todayKey(),
    habitDraft: null,
    planOpen: false,
    downloadMsg: '',
  };

  // ---------------- Utilitaires ----------------

  function todayKey() {
    return new Date().toISOString().slice(0, 10);
  }
  function fmtDateShort(key) {
    var d = new Date(key + 'T00:00:00');
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  }
  function recentDayKeys(n) {
    var out = [];
    for (var i = 0; i < n; i++) {
      var d = new Date();
      d.setDate(d.getDate() - i);
      out.push(d.toISOString().slice(0, 10));
    }
    return out;
  }
  function el(tag, attrs, children) {
    var e = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'html') e.innerHTML = attrs[k];
      else if (k.indexOf('on') === 0) e.addEventListener(k.slice(2), attrs[k]);
      else e.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) {
      if (c) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return e;
  }
  function verseTag(ref, txt) {
    return el('div', { class: 'verse' }, [
      el('div', { class: 'ref' }, [ref]),
      el('div', { class: 'txt' }, ['\u00AB ' + txt + ' \u00BB']),
    ]);
  }
  function root() { return document.getElementById('app'); }
  function render() {
    var r = root();
    r.innerHTML = '';
    r.appendChild(buildView());
  }

  // ---------------- Appels API ----------------

  function api(path, method, body) {
    var opts = { method: method || 'GET', headers: {}, credentials: 'same-origin' };
    if (body) { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body); }
    return fetch(path, opts).then(function (res) {
      if (res.status === 204) return {};
      return res.json().then(function (data) {
        if (!res.ok) throw new Error(data.error || 'Erreur');
        return data;
      });
    });
  }

  function loadState() {
    return api('/api/state').then(function (data) {
      state.server = data;
      state.view = 'dashboard';
      render();
    });
  }

  function boot() {
    api('/api/me').then(function (data) {
      state.user = data.user;
      return loadState();
    }).catch(function () {
      state.view = 'auth';
      render();
    });
  }

  // ---------------- Vue : authentification ----------------

  function viewAuth() {
    var wrap = el('div', { class: 'content' }, []);
    wrap.style.paddingTop = '60px';
    wrap.appendChild(el('div', { class: 'eyebrow', style: 'text-align:center' }, ['AU C\u0152UR DU FEU DIVIN \u00B7 PROVERBES 4:18']));
    var h1 = el('h1', { style: 'text-align:center;margin-top:12px' }, ['La Flamme']);
    wrap.appendChild(h1);
    wrap.appendChild(el('p', { style: 'text-align:center;color:' + GOLD + ';font-style:italic;margin-top:4px' }, [
      state.authMode === 'login' ? 'Connecte-toi' : 'Cr\u00e9e ton compte',
    ]));

    var uname = el('input', { type: 'text', placeholder: 'Ton nom', id: 'auth-username' });
    var pwd = el('input', { type: 'password', placeholder: 'Mot de passe', id: 'auth-password' });

    var form = el('div', { style: 'margin-top:24px' }, [
      el('label', {}, [el('span', { class: 'field-label' }, ['Nom']), uname]),
      el('label', {}, [el('span', { class: 'field-label' }, ['Mot de passe']), pwd]),
    ]);
    wrap.appendChild(form);

    if (state.authError) wrap.appendChild(el('div', { class: 'error-msg' }, [state.authError]));

    var submitBtn = el('button', {
      class: 'btn-primary', style: 'margin-top:8px',
      onclick: function () {
        var u = uname.value.trim(), p = pwd.value;
        if (!u || !p) { state.authError = 'Remplis les deux champs.'; render(); return; }
        var path = state.authMode === 'login' ? '/api/login' : '/api/register';
        api(path, 'POST', { username: u, password: p }).then(function (data) {
          state.user = data.user;
          state.authError = '';
          return loadState();
        }).catch(function (e) {
          state.authError = e.message;
          render();
        });
      },
    }, [state.authMode === 'login' ? 'Se connecter' : "Cr\u00e9er mon compte"]);
    wrap.appendChild(submitBtn);

    wrap.appendChild(el('button', {
      class: 'btn-text', style: 'display:block;margin:16px auto;',
      onclick: function () { state.authMode = state.authMode === 'login' ? 'register' : 'login'; state.authError = ''; render(); },
    }, [state.authMode === 'login' ? "Pas de compte ? Cr\u00e9es-en un" : 'D\u00e9j\u00e0 un compte ? Connecte-toi']));

    wrap.appendChild(el('p', { class: 'footer-note', style: 'margin-top:40px' }, ['Outil cr\u00e9\u00e9 par Franck Katshunga']));
    wrap.appendChild(el('p', { class: 'footer-note' }, ['Tous droits r\u00e9serv\u00e9s 2026 \u00B7 Contact\u00a0: +243 82 18 33 700']));
    return wrap;
  }

  // ---------------- Vue : onboarding (vision / mission / plan) ----------------

  function fieldValue(id) {
    var e = document.getElementById(id);
    return e ? e.value : '';
  }

  function viewOnboarding() {
    var p = state.server.profile;
    var step = state.onboardingStep;
    var wrap = el('div', {}, []);
    var top = el('div', { class: 'top-bar' }, [
      el('span', { class: 'eyebrow' }, [['VISION', 'MISSION', "PLAN D'ACTION"][step]]),
    ]);
    wrap.appendChild(top);
    var content = el('div', { class: 'content', style: 'padding-top:20px' }, []);

    if (step === 0) {
      content.appendChild(el('h2', {}, ['Ta vision']));
      content.appendChild(verseTag('Habacuc 2:2', "\u00c9cris la vision, et grave-la sur des tables, afin qu'on la lise couramment."));
      content.appendChild(el('label', {}, [
        el('span', { class: 'field-label' }, ['Ce que tu vois Dieu faire \u00e0 travers toi']),
        el('textarea', { id: 'f-vision', rows: 4, placeholder: "ex. Je crois que Dieu m'appelle \u00e0 former des jeunes leaders..." }, [p.vision || '']),
      ]));
      var ul = document.createElement('ul');
      ul.style.cssText = 'font-size:12px;color:' + CREAM + ';padding-left:18px;';
      ['\u00c9criture \u2014 compatible avec le caract\u00e8re de J\u00e9sus\u00a0?', 'Service \u2014 qui sera r\u00e9ellement servi\u00a0?', 'Confirmation \u2014 des personnes m\u00fbres la confirment-elles\u00a0?', 'Fruit \u2014 produit-elle la paix et le courage\u00a0?'].forEach(function (t) {
        ul.appendChild(el('li', { style: 'margin-bottom:4px' }, [t]));
      });
      content.appendChild(ul);
      content.appendChild(el('button', {
        class: 'btn-primary', style: 'margin-top:20px',
        onclick: function () {
          var v = fieldValue('f-vision').trim();
          if (!v) return;
          state.server.profile.vision = v;
          state.onboardingStep = 1;
          render();
        },
      }, ['Continuer']));
    } else if (step === 1) {
      content.appendChild(el('h2', {}, ['Ta mission actuelle']));
      content.appendChild(verseTag('Marc 10:45 \u00B7 Jean 20:21', "Le Fils de l'homme est venu, non pour \u00eatre servi, mais pour servir."));
      ['verbe', 'personnes', 'contribution', 'transformation'].forEach(function (key, i) {
        var labels = ["Verbe d'action", 'Les personnes concern\u00e9es', 'Ta contribution', 'La transformation recherch\u00e9e'];
        var placeholders = ['ex. encourager', 'ex. les \u00e9tudiants de ma promotion', 'ex. du tutorat gratuit', "ex. qu'ils traversent leurs examens avec esp\u00e9rance"];
        content.appendChild(el('label', {}, [
          el('span', { class: 'field-label' }, [labels[i]]),
          el('input', { type: 'text', id: 'f-' + key, placeholder: placeholders[i], value: p[key] || '' }),
        ]));
      });
      content.appendChild(el('button', {
        class: 'btn-primary', style: 'margin-top:8px',
        onclick: function () {
          var verbe = fieldValue('f-verbe').trim(), personnes = fieldValue('f-personnes').trim();
          if (!verbe || !personnes) return;
          p.verbe = verbe; p.personnes = personnes;
          p.contribution = fieldValue('f-contribution').trim();
          p.transformation = fieldValue('f-transformation').trim();
          state.onboardingStep = 2;
          render();
        },
      }, ['Continuer']));
      content.appendChild(el('button', { class: 'btn-text', onclick: function () { state.onboardingStep = 0; render(); } }, ['\u2190 Retour']));
    } else if (step === 2) {
      content.appendChild(el('h2', {}, ["Ton plan d'action"]));
      content.appendChild(verseTag('Proverbes 16:3', "Recommande \u00e0 l'\u00c9ternel tes \u0153uvres, et tes projets r\u00e9ussiront."));
      [['cible', 'Cible (un seul comportement)', 'ex. lire ma Bible 10 min chaque matin'],
       ['action', 'Action rythm\u00e9e (quand, o\u00f9)', 'ex. chaque jour \u00e0 6h'],
       ['partenaire', 'Partenaire', 'ex. mon voisin de banc au culte']].forEach(function (f) {
        content.appendChild(el('label', {}, [
          el('span', { class: 'field-label' }, [f[1]]),
          el('input', { type: 'text', id: 'f-' + f[0], placeholder: f[2], value: p[f[0]] || '' }),
        ]));
      });
      content.appendChild(verseTag('Jacques 1:22', 'Mettez en pratique la parole, et ne vous bornez pas \u00e0 l\u2019\u00e9couter.'));
      content.appendChild(el('label', {}, [
        el('span', { class: 'field-label' }, ['Dans les 72 heures, je vais...']),
        el('input', { type: 'text', id: 'f-engagement72', placeholder: 'ex. envoyer un message \u00e0 mon partenaire', value: p.engagement72 || '' }),
      ]));
      content.appendChild(el('button', {
        class: 'btn-primary', style: 'margin-top:8px',
        onclick: function () {
          var cible = fieldValue('f-cible').trim(), partenaire = fieldValue('f-partenaire').trim(), eng = fieldValue('f-engagement72').trim();
          if (!cible || !partenaire || !eng) return;
          p.cible = cible; p.action = fieldValue('f-action').trim(); p.partenaire = partenaire; p.engagement72 = eng;
          api('/api/profile', 'POST', p).then(function (data) {
            state.server = data;
            state.view = 'dashboard';
            render();
          });
        },
      }, ['Valider mon engagement']));
      content.appendChild(el('button', { class: 'btn-text', onclick: function () { state.onboardingStep = 1; render(); } }, ['\u2190 Retour']));
    }
    wrap.appendChild(content);
    return wrap;
  }

  // ---------------- Calculs : streaks et tendance ----------------

  function dayHasCheck(logs, key) {
    var day = logs[key];
    if (!day || !day.checks) return false;
    return Object.keys(day.checks).some(function (id) { return day.checks[id]; });
  }

  function computeStreaks(logs) {
    var cursor = new Date();
    var tKey = todayKey();
    var current = 0;
    if (!dayHasCheck(logs, tKey)) cursor.setDate(cursor.getDate() - 1);
    while (true) {
      var key = cursor.toISOString().slice(0, 10);
      if (dayHasCheck(logs, key)) { current++; cursor.setDate(cursor.getDate() - 1); } else break;
    }
    var dates = Object.keys(logs).filter(function (k) { return dayHasCheck(logs, k); }).sort();
    var best = 0, run = 0, prev = null;
    dates.forEach(function (d) {
      if (prev) {
        var diff = Math.round((new Date(d) - new Date(prev)) / 86400000);
        run = diff === 1 ? run + 1 : 1;
      } else run = 1;
      best = Math.max(best, run);
      prev = d;
    });
    best = Math.max(best, current);
    return { current: current, best: best };
  }

  // ---------------- Vue : tableau de bord ----------------

  function missionSentence(p) {
    if (!p.verbe && !p.personnes) return '';
    return 'Ma mission actuelle est de ' + (p.verbe || '\u2026') + ' ' + (p.personnes || '\u2026') + ', par ' + (p.contribution || '\u2026') + ', afin de ' + (p.transformation || '\u2026') + ', pour la gloire de Dieu.';
  }

  function activeHabits() { return state.server.habits.filter(function (h) { return h.status !== 'cloturee'; }); }
  function closedHabits() { return state.server.habits.filter(function (h) { return h.status === 'cloturee'; }); }

  function toggleHabit(day, habitId) {
    api('/api/logs/' + day, 'POST', { toggleHabitId: habitId }).then(function (data) {
      state.server = data;
      render();
    });
  }

  function saveComment(day, val) {
    api('/api/logs/' + day, 'POST', { comment: val });
  }

  function viewDashboard() {
    var s = state.server, p = s.profile;
    var streaks = computeStreaks(s.logs);
    var wrap = el('div', {}, []);

    var top = el('div', { class: 'top-bar' }, [
      el('div', {}, [
        el('h2', {}, ['Salut, ' + s.displayName]),
        el('div', { style: 'font-size:12px;color:' + GOLD }, ['Jour ' + dayNumber(p.startDate) + ' sur 90']),
      ]),
      el('button', { class: 'btn-icon', onclick: logout }, ['D\u00e9connexion']),
    ]);
    wrap.appendChild(top);

    var content = el('div', { class: 'content', style: 'padding-top:16px' }, []);

    content.appendChild(el('div', { class: 'streak-flex' }, [
      el('div', { class: 'streak-box' }, [el('div', { class: 'num' }, [String(streaks.current)]), el('div', { class: 'lbl' }, ['jours de suite'])]),
      el('div', { class: 'streak-box' }, [el('div', { class: 'num' }, [String(streaks.best)]), el('div', { class: 'lbl' }, ['meilleure s\u00e9rie'])]),
    ]));

    content.appendChild(buildTrendGrid(s.logs));

    content.appendChild(verseTag('Philippiens 1:6', 'Celui qui a commenc\u00e9 en vous cette bonne \u0153uvre la rendra parfaite jusqu\u2019au jour de J\u00e9sus-Christ.'));

    content.appendChild(el('div', { class: 'card' }, [
      el('div', { class: 'card-label' }, ['MA VISION']),
      el('div', { style: 'font-style:italic;font-size:14px' }, [p.vision]),
    ]));
    content.appendChild(el('div', { class: 'card' }, [
      el('div', { class: 'card-label' }, ['MA MISSION']),
      el('div', { style: 'font-style:italic;font-size:14px' }, [missionSentence(p)]),
    ]));
    content.appendChild(el('div', { class: 'card' }, [
      el('div', { class: 'card-label' }, ["PLAN D'ACTION"]),
      el('div', { style: 'font-size:14px' }, [
        el('div', {}, [el('span', { style: 'color:' + GOLD }, ['Cible \u2014 ']), p.cible]),
        el('div', {}, [el('span', { style: 'color:' + GOLD }, ['Rythme \u2014 ']), p.action]),
        el('div', {}, [el('span', { style: 'color:' + GOLD }, ['Partenaire \u2014 ']), p.partenaire]),
      ]),
    ]));

    content.appendChild(el('div', { class: 'section-title' }, ['ALLER PLUS LOIN']));

    if (diagnosticDone(p)) {
      var wc = sortedCapacities(p.scores)[0];
      content.appendChild(el('button', {
        class: 'card', style: 'width:100%;text-align:left;cursor:pointer',
        onclick: function () { state.view = 'diagnostic'; render(); },
      }, [
        el('div', { class: 'card-label' }, ['CAPACITÉ PRIORITAIRE']),
        el('div', { style: 'font-weight:700;color:#fff;margin-bottom:2px' }, [wc.label]),
        el('div', { style: 'font-size:12px;font-style:italic;color:' + CREAM }, [wc.suggestion]),
      ]));
    } else {
      content.appendChild(el('button', {
        class: 'card', style: 'width:100%;text-align:left;cursor:pointer;border-style:dashed',
        onclick: function () { state.view = 'diagnostic'; render(); },
      }, [
        el('div', { style: 'font-weight:700;color:' + GOLD + ';margin-bottom:4px;font-size:14px' }, ['Diagnostic de croissance']),
        el('div', { style: 'font-size:12px;color:' + CREAM }, ['Découvre, selon ton profil, les capacités à renforcer en priorité \u2014 environ 5 min.']),
      ]));
    }

    if (ikigaiDone(p)) {
      content.appendChild(el('button', {
        class: 'card', style: 'width:100%;text-align:left;cursor:pointer',
        onclick: function () { state.view = 'ikigai'; render(); },
      }, [
        el('div', { class: 'card-label' }, ['MON IKIGAI']),
        el('div', { style: 'font-size:12px;color:' + CREAM }, [
          el('div', { style: 'margin-bottom:2px' }, [el('span', { style: 'color:' + GOLD }, ["J'aime \u2014 "]), p.passion]),
          el('div', { style: 'margin-bottom:2px' }, [el('span', { style: 'color:' + GOLD }, ['Doué pour \u2014 ']), p.don]),
          el('div', { style: 'margin-bottom:2px' }, [el('span', { style: 'color:' + GOLD }, ['Le monde a besoin de \u2014 ']), p.besoin]),
          el('div', {}, [el('span', { style: 'color:' + GOLD }, ['Payé pour \u2014 ']), p.ressource]),
        ]),
      ]));
    } else {
      content.appendChild(el('button', {
        class: 'card', style: 'width:100%;text-align:left;cursor:pointer;border-style:dashed',
        onclick: function () { state.view = 'ikigai'; render(); },
      }, [
        el('div', { style: 'font-weight:700;color:' + GOLD + ';margin-bottom:4px;font-size:14px' }, ['Ton ikigai']),
        el('div', { style: 'font-size:12px;color:' + CREAM }, ['Un détour optionnel pour croiser tes passions, tes dons et les besoins autour de toi \u2014 environ 3 min.']),
      ]));
    }

    // Aujourd'hui
    var todayCard = el('div', { class: 'card' }, []);
    var todayHeader = el('div', { style: 'display:flex;justify-content:space-between;align-items:center;margin-bottom:12px' }, [
      el('span', { class: 'card-label', style: 'margin:0' }, [state.selectedDay === todayKey() ? "AUJOURD'HUI" : fmtDateShort(state.selectedDay).toUpperCase()]),
      el('button', { class: 'btn-icon', onclick: function () { state.view = 'plan'; render(); } }, ['\u270e Mon plan']),
    ]);
    todayCard.appendChild(todayHeader);

    var actives = activeHabits();
    if (actives.length === 0) {
      todayCard.appendChild(el('p', { style: 'font-size:12px;font-style:italic' }, ['Ton plan se remplira avec ta Cible une fois valid\u00e9e.']));
    } else {
      actives.forEach(function (h) {
        var checked = !!((s.logs[state.selectedDay] || {}).checks || {})[h.id];
        var row = el('div', {
          class: 'habit-row' + (checked ? ' checked' : ''),
          onclick: function () { toggleHabit(state.selectedDay, h.id); },
        }, [
          el('div', { class: 'habit-checkbox' }, [checked ? '\u2713' : '']),
          el('div', { class: 'habit-label' }, [h.label]),
          h.heure ? el('div', { class: 'habit-time' }, ['\u23f0 ' + h.heure]) : null,
        ]);
        todayCard.appendChild(row);
      });
    }

    var commentBox = el('textarea', {
      id: 'day-comment', rows: 2, placeholder: 'ex. Lecture de Psaume 23, moment de pri\u00e8re...',
      onblur: function (e) { saveComment(state.selectedDay, e.target.value); },
    }, [(s.logs[state.selectedDay] || {}).comment || '']);
    todayCard.appendChild(el('label', { style: 'margin-top:10px' }, [el('span', { class: 'field-label' }, ['Note du jour']), commentBox]));

    if (state.selectedDay !== todayKey()) {
      todayCard.appendChild(el('button', { class: 'btn-text', onclick: function () { state.selectedDay = todayKey(); render(); } }, ["\u2190 Revenir \u00e0 aujourd'hui"]));
    }
    content.appendChild(todayCard);

    // Historique
    if (p.startDate) {
      var histCard = el('div', { class: 'card' }, [el('div', { class: 'card-label' }, ['DERNIERS JOURS'])]);
      recentDayKeys(7).filter(function (k) { return k >= p.startDate; }).forEach(function (k) {
        var log = s.logs[k];
        var checks = (log && log.checks) || {};
        var doneN = actives.filter(function (h) { return checks[h.id]; }).length;
        histCard.appendChild(el('button', {
          class: 'history-row',
          onclick: function () { state.selectedDay = k; render(); },
        }, [
          el('span', { style: 'color:' + (k === state.selectedDay ? GOLD : CREAM) + ';font-weight:' + (k === state.selectedDay ? '700' : '400') }, [k === todayKey() ? "Aujourd'hui" : fmtDateShort(k)]),
          el('span', { style: 'color:#8A7F78;font-size:12px' }, [(actives.length ? doneN + '/' + actives.length : '\u2014') + (log && log.comment ? ' \u00B7 \uD83D\uDCDD' : '')]),
        ]));
      });
      content.appendChild(histCard);
    }

    // Export
    var exportRow = el('div', { class: 'two-col', style: 'margin-top:8px' }, [
      el('button', { class: 'btn-outline', onclick: downloadImage }, ['\u2B07 Image']),
      el('button', { class: 'btn-outline', onclick: downloadPdf }, ['\u2B07 PDF']),
    ]);
    content.appendChild(exportRow);
    if (state.downloadMsg) content.appendChild(el('p', { class: 'error-msg', style: 'text-align:center' }, [state.downloadMsg]));

    content.appendChild(el('p', { class: 'footer-note', style: 'margin-top:20px' }, ['Un outil de Franck Katshunga']));

    wrap.appendChild(content);
    return wrap;
  }

  function dayNumber(startDate) {
    if (!startDate) return 1;
    var days = Math.max(0, Math.floor((Date.now() - new Date(startDate).getTime()) / 86400000));
    return Math.min(90, days + 1);
  }

  function buildTrendGrid(logs) {
    var wrap = el('div', { class: 'card' }, [el('div', { class: 'card-label' }, ['30 DERNIERS JOURS'])]);
    var grid = el('div', { class: 'trend-grid' }, []);
    var days = recentDayKeys(30).reverse();
    days.forEach(function (k) {
      var done = dayHasCheck(logs, k);
      grid.appendChild(el('div', { class: 'trend-cell', title: k, style: 'background:' + (done ? GOLD : 'rgba(255,255,255,0.08)') }));
    });
    wrap.appendChild(grid);
    return wrap;
  }

  function logout() {
    api('/api/logout', 'POST').then(function () {
      state.user = null; state.server = null; state.view = 'auth'; state.authMode = 'login'; state.authError = '';
      render();
    });
  }

  // ---------------- Vue : Mon plan (gestion des habitudes) ----------------

  function saveHabitDraft() {
    var d = state.habitDraft;
    var label = fieldValue('h-label').trim();
    var heure = fieldValue('h-heure');
    var duree = fieldValue('h-duree');
    if (!label || !heure) return;
    var payload = { label: label, heure: heure, dureeSession: duree, dureeEngagementJours: d.dureeEngagementJours };
    var req = d.id ? api('/api/habits/' + d.id, 'PATCH', payload) : api('/api/habits', 'POST', payload);
    req.then(function (data) {
      state.server = data;
      state.habitDraft = null;
      render();
    });
  }

  function viewDiagnostic() {
    var p = state.server.profile;
    var scores = p.scores || {};
    var allAnswered = diagnosticDone(p);
    var wrap = el('div', {}, []);
    wrap.appendChild(el('div', { class: 'top-bar' }, [
      el('button', { class: 'btn-icon', onclick: function () { state.view = 'dashboard'; render(); } }, ['\u2190']),
      el('span', { class: 'eyebrow' }, ['DIAGNOSTIC']),
      el('span', {}, ['']),
    ]));
    var content = el('div', { class: 'content', style: 'padding-top:16px' }, []);
    content.appendChild(el('h2', {}, ['Ton profil de croissance']));
    content.appendChild(verseTag('2 Pierre 1:5-7', 'Ajoutez à votre foi... afin de croître, pas à pas, à la ressemblance du Christ.'));
    content.appendChild(el('p', { style: 'font-size:13px;margin-bottom:16px' }, ["Réponds honnêtement — il n'y a pas de bonne réponse, juste ton point de départ."]));

    CAPACITIES.forEach(function (c) {
      var block = el('div', { style: 'margin-bottom:22px' }, []);
      block.appendChild(el('div', { style: 'font-size:14px;font-weight:600;color:#fff;margin-bottom:8px' }, [c.statement]));
      var scaleRow = el('div', { style: 'display:grid;grid-template-columns:repeat(4,1fr);gap:8px' }, []);
      SCALE.forEach(function (opt) {
        var selected = scores[c.id] === opt.v;
        scaleRow.appendChild(el('button', {
          style: 'padding:9px 4px;border-radius:10px;font-size:11px;font-weight:600;background:' + (selected ? GOLD : 'rgba(255,255,255,0.06)') + ';color:' + (selected ? DARK : CREAM) + ';border:1px solid ' + (selected ? GOLD : 'rgba(217,164,65,0.3)'),
          onclick: function () { saveScore(c.id, opt.v); },
        }, [opt.label]));
      });
      block.appendChild(scaleRow);
      content.appendChild(block);
    });

    if (allAnswered) {
      var weakest = sortedCapacities(scores)[0];
      content.appendChild(el('div', { class: 'card' }, [
        el('div', { class: 'card-label' }, ['TA CAPACITÉ PRIORITAIRE']),
        el('div', { style: 'font-weight:700;color:#fff;margin-bottom:4px' }, [weakest.label]),
        el('div', { style: 'font-size:12px;font-style:italic;margin-bottom:6px;color:' + CREAM }, ['\u00AB ' + weakest.verseText + ' \u00BB \u2014 ' + weakest.verseRef]),
        el('div', { style: 'font-size:12px;color:' + CREAM }, [weakest.suggestion]),
      ]));
      content.appendChild(el('button', { class: 'btn-primary', style: 'margin-top:8px', onclick: function () { state.view = 'dashboard'; render(); } }, ['Terminé']));
    } else {
      content.appendChild(el('p', { style: 'font-size:12px;font-style:italic;color:#8A7F78;text-align:center' }, ['Réponds aux 6 questions pour voir ton résultat.']));
    }

    wrap.appendChild(content);
    return wrap;
  }

  function viewIkigai() {
    var p = state.server.profile;
    var wrap = el('div', {}, []);
    wrap.appendChild(el('div', { class: 'top-bar' }, [
      el('button', { class: 'btn-icon', onclick: function () { state.view = 'dashboard'; render(); } }, ['\u2190']),
      el('span', { class: 'eyebrow' }, ['IKIGAI']),
      el('span', {}, ['']),
    ]));
    var content = el('div', { class: 'content', style: 'padding-top:16px' }, []);
    content.appendChild(el('h2', {}, ['Ton ikigai, à la lumière de Dieu']));
    content.appendChild(verseTag('Jérémie 29:11', "Je connais les projets que j'ai formés sur vous... projets de paix, afin de vous donner un avenir et de l'espérance."));
    content.appendChild(el('div', { style: 'margin-bottom:16px', html: IKIGAI_SVG }));
    content.appendChild(el('p', { style: 'font-size:12px;font-style:italic;text-align:center;margin-bottom:20px;color:' + CREAM }, ["Dieu a façonné ces quatre dimensions en toi. Ton ikigai devient une vocation quand il est offert pour sa gloire, pas seulement pour ton accomplissement."]));

    IKIGAI_QUESTIONS.forEach(function (q) {
      content.appendChild(verseTag(q.verseRef, q.verseText));
      content.appendChild(el('label', {}, [
        el('span', { class: 'field-label' }, [q.label]),
        el('input', { type: 'text', id: 'ik-' + q.id, placeholder: q.placeholder, value: p[q.id] || '' }),
      ]));
    });

    content.appendChild(el('button', {
      class: 'btn-primary',
      onclick: function () {
        var updates = {};
        IKIGAI_QUESTIONS.forEach(function (q) { updates[q.id] = fieldValue('ik-' + q.id).trim(); });
        api('/api/profile', 'POST', updates).then(function (data) {
          state.server = data;
          state.view = 'dashboard';
          render();
        });
      },
    }, ['Enregistrer mon ikigai']));

    wrap.appendChild(content);
    return wrap;
  }

  function viewPlan() {
    if (state.habitDraft) return viewHabitDraft();
    var s = state.server;
    var wrap = el('div', {}, []);
    wrap.appendChild(el('div', { class: 'top-bar' }, [
      el('button', { class: 'btn-icon', onclick: function () { state.view = 'dashboard'; render(); } }, ['\u2190']),
      el('span', { class: 'eyebrow' }, ['MON PLAN']),
      el('span', {}, ['']),
    ]));
    var content = el('div', { class: 'content', style: 'padding-top:16px' }, []);
    content.appendChild(el('h2', {}, ['Ton plan de d\u00e9veloppement']));
    content.appendChild(verseTag('2 Pierre 1:5-7', 'Ajoutez \u00e0 votre foi... afin de cro\u00eetre, pas \u00e0 pas, \u00e0 la ressemblance du Christ.'));

    activeHabits().forEach(function (h) {
      var joursEcoules = h.createdDate ? Math.min(h.dureeEngagementJours || 90, Math.floor((Date.now() - new Date(h.createdDate).getTime()) / 86400000) + 1) : 1;
      var atteint = h.dureeEngagementJours && joursEcoules >= h.dureeEngagementJours;
      content.appendChild(el('div', { class: 'plan-item' }, [
        el('div', { class: 'row1' }, [
          el('span', { style: 'font-weight:700;font-size:14px' }, [h.label]),
          el('button', { class: 'btn-icon', onclick: function () { removeHabit(h.id); } }, ['\u2715']),
        ]),
        el('div', { class: 'meta' }, [(h.heure || 'Heure non d\u00e9finie') + (h.dureeSession ? ' \u00B7 ' + h.dureeSession : '') + (h.dureeEngagementJours ? ' \u00B7 Jour ' + joursEcoules + '/' + h.dureeEngagementJours : '') + (atteint ? ' \u00B7 objectif atteint \uD83C\uDF89' : '')]),
        el('div', { class: 'actions' }, [
          el('button', { onclick: function () { openEditHabit(h); } }, ['\u270e Modifier']),
          el('button', { onclick: function () { closeHabit(h.id); } }, ['\u2713 Cl\u00f4turer']),
        ]),
      ]));
    });
    if (activeHabits().length === 0) content.appendChild(el('p', { style: 'font-size:12px;font-style:italic;color:#8A7F78' }, ['Aucune habitude active.']));

    var suggestions = ['Lecture', 'Pri\u00e8re', 'Cr\u00e9ation de contenu', 'Sport', "Apprentissage d'une comp\u00e9tence", '\u00c9pargne'];
    var chipRow = el('div', { class: 'chip-row' }, []);
    suggestions.filter(function (sugg) { return !s.habits.some(function (h) { return h.label.toLowerCase() === sugg.toLowerCase(); }); }).forEach(function (sugg) {
      chipRow.appendChild(el('button', { class: 'chip', onclick: function () { openAddHabit(sugg); } }, ['+ ' + sugg]));
    });
    content.appendChild(chipRow);
    content.appendChild(el('button', { class: 'btn-outline', onclick: function () { openAddHabit(''); } }, ['+ Ajouter une habitude personnalis\u00e9e']));

    var closed = closedHabits();
    if (closed.length > 0) {
      content.appendChild(el('div', { class: 'section-title' }, ['HABITUDES CL\u00d4TUR\u00c9ES']));
      closed.forEach(function (h) {
        content.appendChild(el('div', { class: 'plan-item', style: 'opacity:0.6' }, [
          el('div', { class: 'row1' }, [el('span', {}, ['\u2713 ' + h.label]), el('button', { class: 'btn-icon', onclick: function () { removeHabit(h.id); } }, ['\u2715'])]),
        ]));
      });
    }

    var remindCard = el('div', { class: 'card', style: 'margin-top:20px' }, [
      el('div', { class: 'card-label' }, ['RAPPELS SUR TON T\u00c9L\u00c9PHONE']),
      el('p', { style: 'font-size:12px' }, ["T\u00e9l\u00e9charge un fichier calendrier avec tes habitudes programm\u00e9es \u00e0 l'heure choisie. Importe-le dans Calendrier (Google Calendar, Apple Calendrier...)."]),
      el('button', { class: 'btn-primary', onclick: downloadIcs }, ['\u2B07 T\u00e9l\u00e9charger mes rappels (.ics)']),
    ]);
    content.appendChild(remindCard);
    if (state.downloadMsg) content.appendChild(el('p', { class: 'error-msg' }, [state.downloadMsg]));

    wrap.appendChild(content);
    return wrap;
  }

  function openAddHabit(prefill) { state.habitDraft = { id: null, label: prefill || '', heure: '', dureeSession: '', dureeEngagementJours: 30 }; render(); }
  function openEditHabit(h) { state.habitDraft = { id: h.id, label: h.label, heure: h.heure || '', dureeSession: h.dureeSession || '', dureeEngagementJours: h.dureeEngagementJours || 30 }; render(); }
  function closeHabit(id) { api('/api/habits/' + id, 'PATCH', { status: 'cloturee' }).then(function (data) { state.server = data; render(); }); }
  function removeHabit(id) { api('/api/habits/' + id, 'DELETE').then(function (data) { state.server = data; render(); }); }

  function viewHabitDraft() {
    var d = state.habitDraft;
    var wrap = el('div', {}, []);
    wrap.appendChild(el('div', { class: 'top-bar' }, [
      el('button', { class: 'btn-icon', onclick: function () { state.habitDraft = null; render(); } }, ['\u2190']),
      el('span', { class: 'eyebrow' }, ['MON PLAN']),
      el('span', {}, ['']),
    ]));
    var content = el('div', { class: 'content', style: 'padding-top:16px' }, []);
    content.appendChild(el('h2', {}, [d.id ? "Modifier l'habitude" : 'Nouvelle habitude']));
    content.appendChild(verseTag('Eccl\u00e9siaste 3:1', 'Il y a un temps pour toute chose sous les cieux.'));
    content.appendChild(el('label', {}, [el('span', { class: 'field-label' }, ["Nom de l'habitude"]), el('input', { type: 'text', id: 'h-label', value: d.label, placeholder: 'ex. Lecture, Pri\u00e8re...' })]));
    content.appendChild(el('label', {}, [el('span', { class: 'field-label' }, ['\u00c0 quelle heure\u00a0?']), el('input', { type: 'time', id: 'h-heure', value: d.heure })]));
    content.appendChild(el('label', {}, [el('span', { class: 'field-label' }, ['Combien de temps par jour (optionnel)']), el('input', { type: 'text', id: 'h-duree', value: d.dureeSession, placeholder: 'ex. 10 minutes' })]));
    content.appendChild(el('span', { class: 'field-label' }, ['Sur combien de temps\u00a0?']));
    var chipRow = el('div', { class: 'chip-row' }, []);
    DUREE_OPTIONS.forEach(function (n) {
      chipRow.appendChild(el('button', {
        class: 'chip' + (d.dureeEngagementJours === n ? ' selected' : ''),
        onclick: function () {
          // Capture les valeurs déjà saisies avant le re-rendu, pour ne pas les perdre
          d.label = fieldValue('h-label');
          d.heure = fieldValue('h-heure');
          d.dureeSession = fieldValue('h-duree');
          d.dureeEngagementJours = n;
          render();
        },
      }, [n + ' jours']));
    });
    content.appendChild(chipRow);
    content.appendChild(el('div', { class: 'two-col', style: 'margin-top:20px' }, [
      el('button', { class: 'btn-outline', onclick: function () { state.habitDraft = null; render(); } }, ['Annuler']),
      el('button', { class: 'btn-primary', onclick: saveHabitDraft }, ['Enregistrer']),
    ]));
    wrap.appendChild(content);
    return wrap;
  }

  function downloadIcs() {
    fetch('/api/ics', { credentials: 'same-origin' }).then(function (res) {
      if (!res.ok) return res.json().then(function (d) { throw new Error(d.error); });
      return res.blob();
    }).then(function (blob) {
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = 'rappels.ics';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    }).catch(function (e) {
      state.downloadMsg = e.message;
      render();
    });
  }

  // ---------------- Export carte (canvas -> PNG / PDF) ----------------

  function wrapText(ctx, text, maxWidth) {
    if (!text) return [''];
    var words = String(text).split(/\s+/);
    var lines = [], current = '';
    words.forEach(function (w) {
      var test = current ? current + ' ' + w : w;
      if (ctx.measureText(test).width > maxWidth && current) { lines.push(current); current = w; } else current = test;
    });
    if (current) lines.push(current);
    return lines;
  }

  function buildCardCanvas() {
    var s = state.server, p = s.profile;
    var W = 1080, MARGIN = 80, CW = W - MARGIN * 2;
    var mCanvas = document.createElement('canvas');
    var mctx = mCanvas.getContext('2d');
    var blocks = []; var y = 60;
    function label(t) { blocks.push({ t: 'label', text: t, y: y }); y += 44; }
    function body(t, opts) {
      opts = opts || {};
      mctx.font = (opts.italic ? 'italic ' : '') + (opts.bold ? 'bold ' : '') + '30px Arial';
      wrapText(mctx, t || '', CW).forEach(function (line) { blocks.push({ t: 'body', text: line, y: y, italic: !!opts.italic, bold: !!opts.bold, color: opts.color || CREAM }); y += 40; });
    }
    function divider() { blocks.push({ t: 'div', y: y }); y += 50; }

    blocks.push({ t: 'credit', text: 'OUTIL CR\u00c9\u00c9 PAR FRANCK KATSHUNGA \u2014 TOUS DROITS R\u00c9SERV\u00c9S 2026', y: y }); y += 50;
    blocks.push({ t: 'title', text: 'LA FLAMME', y: y }); y += 58;
    blocks.push({ t: 'sub', text: s.displayName + ' \u00B7 Jour ' + dayNumber(p.startDate) + ' sur 90', y: y }); y += 50;
    divider();
    label('MA VISION'); body(p.vision, { italic: true }); y += 20;
    label('MA MISSION'); body(missionSentence(p), { italic: true }); y += 20;
    label("PLAN D'ACTION");
    body('Cible \u2014 ' + p.cible); body('Rythme \u2014 ' + p.action); body('Partenaire \u2014 ' + p.partenaire);
    y += 20;
    if (diagnosticDone(p)) {
      var wCap = sortedCapacities(p.scores)[0];
      label('CAPACITÉ PRIORITAIRE');
      body(wCap.label, { bold: true, color: '#ffffff' });
      body(wCap.suggestion, { italic: true, color: GOLD });
      y += 20;
    }
    if (ikigaiDone(p)) {
      label('MON IKIGAI');
      body("J'aime \u2014 " + p.passion); body('Doué pour \u2014 ' + p.don);
      body('Le monde a besoin de \u2014 ' + p.besoin); body('Payé pour \u2014 ' + p.ressource);
      y += 20;
    }
    var streaks = computeStreaks(s.logs);
    label('CONSTANCE');
    body(streaks.current + ' jours de suite \u00B7 meilleure s\u00e9rie\u00a0: ' + streaks.best + ' jours', { bold: true, color: '#ffffff' });
    y += 20;
    divider();
    blocks.push({ t: 'footer', text: 'Franck Katshunga', y: y }); y += 34;
    blocks.push({ t: 'footer', text: 'Contact : +243 82 18 33 700', y: y }); y += 60;

    var canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = y;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = DARK; ctx.fillRect(0, 0, W, canvas.height);
    blocks.forEach(function (b) {
      if (b.t === 'div') { ctx.strokeStyle = 'rgba(217,164,65,0.4)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(MARGIN, b.y); ctx.lineTo(W - MARGIN, b.y); ctx.stroke(); return; }
      if (b.t === 'credit') { ctx.font = 'bold 18px Arial'; ctx.fillStyle = GOLD; ctx.textAlign = 'center'; ctx.fillText(b.text, W / 2, b.y); ctx.textAlign = 'left'; return; }
      if (b.t === 'title') { ctx.font = 'bold 50px Georgia'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText(b.text, W / 2, b.y); ctx.textAlign = 'left'; return; }
      if (b.t === 'sub') { ctx.font = 'italic 28px Georgia'; ctx.fillStyle = GOLD; ctx.textAlign = 'center'; ctx.fillText(b.text, W / 2, b.y); ctx.textAlign = 'left'; return; }
      if (b.t === 'label') { ctx.font = 'bold 24px Arial'; ctx.fillStyle = GOLD; ctx.fillText(b.text, MARGIN, b.y); return; }
      if (b.t === 'body') { ctx.font = (b.italic ? 'italic ' : '') + (b.bold ? 'bold ' : '') + '30px Arial'; ctx.fillStyle = b.color; ctx.fillText(b.text, MARGIN, b.y); return; }
      if (b.t === 'footer') { ctx.font = '22px Arial'; ctx.fillStyle = 'rgba(244,233,220,0.7)'; ctx.textAlign = 'center'; ctx.fillText(b.text, W / 2, b.y); ctx.textAlign = 'left'; return; }
    });
    return canvas;
  }

  function safeName(s) { return (s || 'profil').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase() || 'profil'; }

  function downloadImage() {
    var canvas = buildCardCanvas();
    var a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'LaFlamme-' + safeName(state.server.displayName) + '.png';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  }

  function downloadPdf() {
    var canvas = buildCardCanvas();
    var jpegUrl = canvas.toDataURL('image/jpeg', 0.92);
    var bytes = dataUrlToBytes(jpegUrl);
    var blob = buildPdfFromJpeg(bytes, canvas.width, canvas.height);
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = 'LaFlamme-' + safeName(state.server.displayName) + '.pdf';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }

  function dataUrlToBytes(dataUrl) {
    var base64 = dataUrl.split(',')[1];
    var binary = atob(base64);
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  function buildPdfFromJpeg(jpegBytes, w, h) {
    var enc = new TextEncoder();
    var parts = []; var offset = 0; var offsets = {};
    function push(data) { var b = typeof data === 'string' ? enc.encode(data) : data; parts.push(b); offset += b.length; }
    push('%PDF-1.4\n');
    offsets[1] = offset; push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
    offsets[2] = offset; push('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');
    offsets[3] = offset; push('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + w + ' ' + h + '] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n');
    offsets[4] = offset; push('4 0 obj\n<< /Type /XObject /Subtype /Image /Width ' + w + ' /Height ' + h + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + jpegBytes.length + ' >>\nstream\n');
    push(jpegBytes); push('\nendstream\nendobj\n');
    var contentStream = 'q\n' + w + ' 0 0 ' + h + ' 0 0 cm\n/Im0 Do\nQ';
    offsets[5] = offset; push('5 0 obj\n<< /Length ' + contentStream.length + ' >>\nstream\n' + contentStream + '\nendstream\nendobj\n');
    var xrefOffset = offset;
    var xref = 'xref\n0 6\n0000000000 65535 f \n';
    for (var i = 1; i <= 5; i++) xref += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
    push(xref);
    push('trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n' + xrefOffset + '\n%%EOF');
    return new Blob(parts, { type: 'application/pdf' });
  }

  // ---------------- Dispatcher ----------------

  function buildView() {
    if (state.view === 'loading') return el('div', { class: 'loader' }, ['Chargement\u2026']);
    if (state.view === 'auth') return viewAuth();
    if (state.view === 'onboarding') return viewOnboarding();
    if (state.view === 'plan') return viewPlan();
    if (state.view === 'diagnostic') return viewDiagnostic();
    if (state.view === 'ikigai') return viewIkigai();
    if (state.view === 'dashboard') {
      if (!state.server.profile.cible) { state.view = 'onboarding'; return viewOnboarding(); }
      return viewDashboard();
    }
    return el('div', {}, ['?']);
  }

  // Redirige vers l'onboarding si le profil n'est pas encore rempli
  var _origLoadState = loadState;
  loadState = function () {
    return api('/api/state').then(function (data) {
      state.server = data;
      state.view = data.profile && data.profile.cible ? 'dashboard' : 'onboarding';
      render();
    });
  };

  boot();
})();
