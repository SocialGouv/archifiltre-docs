


export const make = (f) => {
  let last_args = [Symbol()]
  let last_ans
  return (...args) => {
    const same_args = args.reduce((acc,val,ind) => acc && val === last_args[ind],true)
    if (same_args === false) {
      last_args = args
      last_ans = f(...args)
    }
    return last_ans
  }
}