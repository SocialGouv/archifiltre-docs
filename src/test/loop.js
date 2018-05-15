import chai from 'chai'
import chaiExclude from 'chai-exclude'
chai.use(chaiExclude)

const expect = chai.expect

import { is } from 'immutable'

import colors from 'colors/safe'

let loop_log_array = []

export const log = (...args) => {
  const stack = new Error().stack
  const line = stack.split('\n')[2]
  let match = line.match(/at ([^ ]+) \(([^:]+):([^:]+):([^:]+)\)/)

  if (match === null) {
    match = line.match(/at ([^:]+):([^:]+):([^:]+)/)
    match = match.slice()
    match = [match[0]].concat(['anonymous']).concat(match.slice(1))
  }

  const func_name = colors.red(match[1])
  const file_name = colors.blue(match[2])
  const line_num = colors.green(match[3])
  const col_num = colors.yellow(match[4])

  loop_log_array.push([`\n${func_name}:${file_name}:${line_num}:${col_num}\n`, ...args, '\n'])
}

export const simpleLog = (...args) => {
  loop_log_array.push([...args])
}

export const iter = (f, nb=100) => {
  try {
    for (let i = nb - 1; i >= 0; i--) {
      loop_log_array = []
      f()
    }
  } catch(e) {
    loop_log_array.forEach(a => console.log(...a))
    throw e
  }
}

export const equal = (str, f) => {
  it(str, function() {
    iter(() => {
      const [a,b] = f()
      expect(a).to.deep.equal(b)
    })
  }).timeout(10000)
}

export const immuEqual = (str, f) => {
  it(str, function() {
    iter(() => {
      const [a,b] = f()
      // expect(a).excludingEvery('ownerID').to.deep.equal(b)
      expect(a.toJS()).to.deep.equal(b.toJS())
      expect(is(a,b)).to.equal(true)
    })
  }).timeout(10000)
}