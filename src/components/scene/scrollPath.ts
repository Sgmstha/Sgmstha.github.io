/** Find the measured section segment; safely handles anchors, overscroll and collapsed sections. */
export function getScrollSegment(offsets: readonly number[], scrollY: number) {
  if (offsets.length < 2) return { index: 0, progress: 0 };
  let index = 0;
  while (index < offsets.length - 2 && scrollY >= offsets[index + 1]) index++;
  const span = Math.max(1, offsets[index + 1] - offsets[index]);
  return { index, progress: Math.max(0, Math.min(1, (scrollY - offsets[index]) / span)) };
}

export function shouldRenderScene({ mobile, reducedMotion, saveData }: { mobile: boolean; reducedMotion: boolean; saveData: boolean }) {
  return !mobile && !reducedMotion && !saveData;
}
