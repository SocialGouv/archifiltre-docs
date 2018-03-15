

export function mkScheduler() {
  let queue = []
  let canBePlanned = true

  const planNextStep = () => {
    if (canBePlanned) {
      requestAnimationFrame(step)
      canBePlanned = false
    }
  }

  const popAtMost = nb => {
    for (let i = Math.min(queue.length,nb) - 1; i >= 0; i--) {
      queue.pop()()
    }
  }

  const step = () => {
    canBePlanned = true
    if (queue.length > 0) {
      popAtMost(50)
      planNextStep()
    }
  }

  return {
    schedule: a => {
      queue=[a].concat(queue)
      planNextStep()
    }
  }
}
