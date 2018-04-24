

export function mkScheduler() {
  let queue = []
  let canBePlanned = true

  let size = 1
  let start_ms = 0
  let end_ms = 0

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

  const startRecordMs = () => start_ms = new Date().getTime()
  const endRecordMs = () => end_ms = new Date().getTime() - start_ms
  const updateSize = () => {
    const target = 30
    if (end_ms > target && size > 0) {
      size--
    } else {
      size++
    }
  }

  const step = () => {
    endRecordMs()
    updateSize()

    canBePlanned = true
    if (queue.length > 0) {
      popAtMost(size)
      planNextStep()
    }

    startRecordMs()
  }

  return {
    schedule: a => {
      queue=[a].concat(queue)
      planNextStep()
    }
  }
}
