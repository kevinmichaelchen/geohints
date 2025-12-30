/*
 * Qwik 1.14+ uses modulepreload for prefetching. This SW auto-unregisters.
 * Remove this file after users have visited once post-upgrade.
 * See: https://qwik.dev/blog/qwik-1-14-preloader
 */
import { setupServiceWorker } from "@builder.io/qwik-city/service-worker";

setupServiceWorker();

addEventListener("install", () => self.skipWaiting());
addEventListener("activate", () => self.clients.claim());

declare const self: ServiceWorkerGlobalScope;
