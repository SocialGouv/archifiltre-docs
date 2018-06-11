import { generateRandomString } from 'random-gen'
import { Map } from 'immutable'


const genId = () => generateRandomString(40)

let queue = Map()

const animationLoop = () => {
  const [ ...keys ] = queue.keys()
  const visible_array = []

  keys.forEach((animation_id,i)=>{
    const animation = queue.get(animation_id)
    const visible = animation.visible
    const measure = animation.measure

    visible_array.push(visible())

    if (visible_array[i]) {
      measure()
    }
  })


  keys.forEach((animation_id,i)=>{
    const animation = queue.get(animation_id)
    const mutate = animation.mutate

    if (visible_array[i]) {
      mutate()
    }
  })

  requestAnimationFrame(animationLoop)

  // for (var i = 0; i < keys.length; i++) {
  //   let animation = AnimationDb.get(queue,keys[i])
  //   let measure = Animation.getMeasure(animation)
  //   let dom_element = Animation.getParentDomElem(animation)

  //   visible.push(isDomElemVisible(dom_element))

  //   if (visible[i]) {
  //     measure(dom_element)
  //   }
  // }

  // for (var i = 0; i < keys.length; i++) {
  //   let animation = AnimationDb.get(queue,keys[i])
  //   let mutate = Animation.getMutate(animation)
  //   let dom_element = Animation.getParentDomElem(animation)

  //   if (visible[i]) {
  //     mutate(dom_element)
  //   }
  // }

}

animationLoop()

export function animate(visible,measure,mutate) {
  const animation_id = genId()
  const animation = {
    visible,
    measure,
    mutate,
  }
  queue = queue.set(animation_id,animation)
  return animation_id
}

export function clear(animation_id) {
  queue = queue.delete(animation_id)
}