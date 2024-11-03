'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "e8d33f8fe375604d2c07e44fb4971276",
"assets/AssetManifest.bin.json": "499358479ad1a280d6ec28136d3db843",
"assets/AssetManifest.json": "ec6850cab99c74f1503d4176af81679b",
"assets/assets/images/circle_employee.png": "a2bc56f41bb220595048476b3b41e6ea",
"assets/assets/images/logo.png": "0c49e1300d3a8c6446d5d7d9ce3ecad1",
"assets/assets/svg/admin.svg": "ec0e84207dcafa430f6bd8c83fb24e3a",
"assets/assets/svg/back.svg": "2b6826cdaf5a9b6f45f1a0c6d260d205",
"assets/assets/svg/close.svg": "dc55986f5fca129ab23745f723a301a4",
"assets/assets/svg/currency.svg": "f24785f75e7915becd59d6969a5fef27",
"assets/assets/svg/edit.svg": "dc687481ffd583f9f530e2388728a44a",
"assets/assets/svg/employee.svg": "a65aaf31694f57e85e8f541a0e6e63e9",
"assets/assets/svg/logout.svg": "357c87aa7ac173c14fd35b608204bce8",
"assets/assets/svg/menu.svg": "d6378cc53c7621aa2088a75e2ab1fedd",
"assets/assets/svg/partners.svg": "e8b391d0b0c220e5ee7525780d1ca6a7",
"assets/assets/svg/projects.svg": "c7e50579c8a0ddeeee8cab2edbcae9f7",
"assets/assets/svg/remove.svg": "a529470a0f0fefd3cf151ada0b35f370",
"assets/FontManifest.json": "7b2a36307916a9721811788013e65289",
"assets/fonts/MaterialIcons-Regular.otf": "67e949dc19e5731726a3bbd467696ca2",
"assets/NOTICES": "44419d4dba6bfb8990984e8aad11bc70",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "66177750aff65a66cb07bb44b8c6422b",
"canvaskit/canvaskit.js.symbols": "48c83a2ce573d9692e8d970e288d75f7",
"canvaskit/canvaskit.wasm": "1f237a213d7370cf95f443d896176460",
"canvaskit/chromium/canvaskit.js": "671c6b4f8fcc199dcc551c7bb125f239",
"canvaskit/chromium/canvaskit.js.symbols": "a012ed99ccba193cf96bb2643003f6fc",
"canvaskit/chromium/canvaskit.wasm": "b1ac05b29c127d86df4bcfbf50dd902a",
"canvaskit/skwasm.js": "694fda5704053957c2594de355805228",
"canvaskit/skwasm.js.symbols": "262f4827a1317abb59d71d6c587a93e2",
"canvaskit/skwasm.wasm": "9f0c0c02b82a910d12ce0543ec130e60",
"canvaskit/skwasm.worker.js": "89990e8c92bcb123999aa81f7e203b1c",
"favicon.png": "fbcb85334e97c02fc76ed9799a0c9521",
"flutter.js": "f393d3c16b631f36852323de8e583132",
"flutter_bootstrap.js": "c787a9ce7adfdc9369baf6b691e54927",
"icons/Icon-192.png": "b2b002a94ce0b153edebe6039f64e30a",
"icons/Icon-512.png": "e6799697db7be14c1c12da108fef5386",
"icons/Icon-maskable-192.png": "b2b002a94ce0b153edebe6039f64e30a",
"icons/Icon-maskable-512.png": "e6799697db7be14c1c12da108fef5386",
"index.html": "bdfc7343cccb3a9eda94f688689a3d0f",
"/": "bdfc7343cccb3a9eda94f688689a3d0f",
"main.dart.js": "b5e6a3095e45e4103934f45fe2ddaded",
"main.dart.mjs": "47c48f49ef48b2abf72af153de02728f",
"main.dart.wasm": "055d8bcfa2d2dfa1006cc71900c0105e",
"manifest.json": "928aa7eb2dc6a1761f2f98603ca4ce56",
"splash/img/light-1x.png": "024c7cd48d91256ed97cc25b73facad4",
"splash/img/light-2x.png": "1fe9c25817fff957892bb95f20ecc903",
"splash/img/light-3x.png": "387f3d360ab9784e1268c3b386537777",
"splash/img/light-4x.png": "7ae51fe6e861f42f4a803bddc922ade9",
"version.json": "9c63e449f171f9b55cd45098f627bb4c"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"main.dart.wasm",
"main.dart.mjs",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
