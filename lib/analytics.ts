const COUNTER_ID = 108746641

export function ymGoal(goal: string) {
  if (typeof window !== 'undefined' && typeof (window as any).ym === 'function') {
    ;(window as any).ym(COUNTER_ID, 'reachGoal', goal)
  }
}
