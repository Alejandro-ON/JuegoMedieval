/* Trabajador de servicio: guarda el juego entero en caché la primera vez, así
   que después arranca sin conexión. Solo hace falta para la instalación como
   aplicación web; dentro de la APK todo es local de todas formas.        */
/* IMPORTANTE: sube este número cada vez que publiques una versión nueva.
   Si no lo cambias, los móviles que ya instalaron el juego seguirán usando
   la copia vieja de la caché y no verán tus cambios.                     */
const CACHE = 'filo-de-hierro-v6';
const ARCHIVOS = [
  'index.html',
  'manifest.webmanifest',
  'vendor/three.module.js',
  'vendor/jsm/loaders/GLTFLoader.js',
  'vendor/jsm/utils/BufferGeometryUtils.js',
  'iconos/icono-192.png',
  'iconos/icono-512.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks =>
    Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
      const copia = resp.clone();
      caches.open(CACHE).then(c => c.put(e.request, copia)).catch(()=>{});
      return resp;
    }).catch(() => caches.match('index.html')))
  );
});
