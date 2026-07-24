/* =====================================================================
   sw.js — service worker do RUJUMENTO
   ---------------------------------------------------------------------
   Guarda todos os arquivos do app no cache do navegador. Depois de aberto
   uma vez com internet, o app funciona 100% offline (modo avião).

   >>> IMPORTANTE: ao publicar uma versão nova dos arquivos, aumente o
       número do CACHE abaixo (v1 -> v2 -> ...). Isso faz o celular baixar
       tudo de novo; sem isso ele continua servindo a versão antiga. <<<
   ===================================================================== */

const CACHE = 'rujumento-v4';

/* Caminhos RELATIVOS (funciona em qualquer subpasta do GitHub Pages). */
const ARQUIVOS = [
  '.',
  'index.html',
  'estilo.css',
  'zurro-audio.js',
  'motor.js',
  'dados.js',
  'ritmos.js',
  'partitura.js',
  'partitura-ritmo.js',
  'frases.js',
  'mestres.js',
  'recompensas.js',
  'trilha.js',
  'progresso.js',
  'avaliacao.js',
  'app.js',
  'manifest.json',
  'icone.svg',
  'icone-maskable.svg',
  'icone-192.png',
  'icone-512.png',
  'icone-180.png',
  'apple-touch-icon.png',
  'icone-maskable-512.png'
];

/* Instala: baixa e guarda tudo. */
self.addEventListener('install', function (ev) {
  ev.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(ARQUIVOS);
    }).then(function () { return self.skipWaiting(); })
  );
});

/* Ativa: apaga caches de versões antigas. */
self.addEventListener('activate', function (ev) {
  ev.waitUntil(
    caches.keys().then(function (chaves) {
      return Promise.all(chaves.map(function (k) {
        if (k !== CACHE) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

/* Busca: serve do cache primeiro (rápido e offline); se não tiver, rede. */
self.addEventListener('fetch', function (ev) {
  if (ev.request.method !== 'GET') return;
  ev.respondWith(
    caches.match(ev.request).then(function (resp) {
      if (resp) return resp;
      return fetch(ev.request).then(function (rede) {
        // guarda no cache o que baixar (mesma origem)
        if (rede && rede.status === 200 && ev.request.url.indexOf(self.location.origin) === 0) {
          const copia = rede.clone();
          caches.open(CACHE).then(function (cache) { cache.put(ev.request, copia); });
        }
        return rede;
      }).catch(function () {
        // offline e sem cache: para navegação, cai no index
        if (ev.request.mode === 'navigate') return caches.match('index.html');
      });
    })
  );
});
