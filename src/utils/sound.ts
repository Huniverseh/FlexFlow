let audioCtx: AudioContext | null = null

const getContext = () => {
  if (typeof window === 'undefined') return null
  if (audioCtx) return audioCtx
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: AudioContext }).webkitAudioContext
  audioCtx = Ctor ? new Ctor() : null
  return audioCtx
}

const startTone = (ctx: AudioContext, duration: number, frequency: number) => {
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

const playFallback = () => {
  if (typeof Audio === 'undefined') return
  const audio = new Audio(
    // 0.12s 880Hz beep
    'data:audio/wav;base64,UklGRlQAAABXQVZFZm10IBAAAAABAAEARKwAABCxAgAEABAAZGF0YVQAAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA='
  )
  audio.play().catch(() => {})
}

export const playBeep = (duration = 0.15, frequency = 880) => {
  const ctx = getContext()
  if (!ctx) {
    playFallback()
    return
  }

  const trigger = () => startTone(ctx, duration, frequency)

  if (ctx.state === 'suspended' || ctx.state === 'interrupted') {
    ctx.resume().then(trigger).catch(() => {
      playFallback()
    })
  } else {
    trigger()
  }
}

// try to keep context active when返回前台
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      const ctx = getContext()
      if (ctx?.state === 'suspended') {
        ctx.resume().catch(() => {})
      }
    }
  })
}
