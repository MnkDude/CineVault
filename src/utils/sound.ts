// src/utils/sound.ts
export function playSound(url: string, volume = 0.2) {
  const audio = new Audio(url);
  audio.volume = volume;
  audio.play();
}

