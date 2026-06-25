import { trackEvent } from './events';

export function initTrackClicks() {
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const tracked = target.closest<HTMLElement>('[data-track]');
    if (!tracked) return;

    const name = tracked.dataset.track;
    if (!name) return;

    const params: Record<string, string> = {};
    if (tracked.dataset.trackSector) {
      params.sector = tracked.dataset.trackSector;
    }

    trackEvent(name, params);
  });
}
