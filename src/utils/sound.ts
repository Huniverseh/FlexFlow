let audioCtx: AudioContext | null = null

const getContext = () => {
  if (typeof window === 'undefined') return null
  if (audioCtx) return audioCtx
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: AudioContext }).webkitAudioContext
  audioCtx = Ctor ? new Ctor() : null
  return audioCtx
}

export const playBeep = (duration = 0.15, frequency = 880) => {
  const ctx = getContext()
  if (!ctx) return
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillator.type = 'sine'
  oscillator.frequency.value = frequency
  oscillator.connect(gain)
  gain.connect(ctx.destination)
  gain.gain.setValueAtTime(0.2, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
  oscillator.start()
  oscillator.stop(ctx.currentTime + duration)
}
