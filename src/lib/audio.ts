export const AUDIO_VOLUME_KEY = "sefirah-volume";

export function getMasterVolume(): number {
  if (typeof window === "undefined") {
    return 0.35;
  }

  const saved = localStorage.getItem(AUDIO_VOLUME_KEY);

  if (saved === null) {
    return 0.35;
  }

  const value = Number(saved);

  if (!Number.isFinite(value)) {
    return 0.35;
  }

  return Math.max(0, Math.min(1, value));
}

export function setMasterVolume(volume: number) {
  if (typeof window === "undefined") {
    return;
  }

  const clamped = Math.max(0, Math.min(1, volume));

  localStorage.setItem(
    AUDIO_VOLUME_KEY,
    String(clamped)
  );

  /*
   * Update every HTMLAudioElement currently
   * playing on the website.
   */
  document
    .querySelectorAll("audio")
    .forEach((audio) => {
      audio.volume = clamped;
    });

  /*
   * Also update Audio objects created with
   * new Audio(...), even though they aren't
   * necessarily mounted in the DOM.
   *
   * This event lets those audio instances
   * receive the new volume when needed.
   */
  window.dispatchEvent(
    new CustomEvent("sefirah-volume-change", {
      detail: clamped,
    })
  );
}

