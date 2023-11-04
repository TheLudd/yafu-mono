/* eslint-disable max-classes-per-file */
import {
  alt as ALT,
  ap as AP,
  bimap as BIMAP,
  chain as CHAIN,
  map as MAP,
  of as OF,
} from 'fantasy-land'
import { of } from '@yafu/fantasy-functions'

function push (val, array) {
  const len = array.length
  const out = new Array(len + 1)
  out[len] = val
  for (let i = len - 1; i >= 0; i -= 1) {
    out[i] = array[i]
  }
  return out
}

function createSequence (current, nextReject, nextResolve) {
  const steps = current.steps || []
  const original = current.original || current
  const nextTuple = [ nextReject, nextResolve ]
  const newSteps = push(nextTuple, steps)
  // eslint-disable-next-line no-use-before-define
  return new Sequence(original, newSteps)
}

function findNextAction (steps, tupleIndex) {
  let nextAction
  do {
    nextAction = steps.shift()[tupleIndex]
  } while (nextAction == null && steps.length > 0)
  return nextAction
}

function processSteps (originalParallel, steps) {
  return function _drain (reject, resolve) {
    let currentParallel = originalParallel
    let currentParallelIsResolved
    let isSync = true

    function makeStep (tupleIndex) {
      return function step (v) {
        currentParallelIsResolved = true
        const nextAction = findNextAction(steps, tupleIndex)
        if (nextAction != null) {
          currentParallel = nextAction(v)
        } else {
          // eslint-disable-next-line no-use-before-define
          currentParallel = tupleIndex === 0 ? Parallel.reject(v) : parallelOf(v)
        }
        if (!isSync) {
          // eslint-disable-next-line no-use-before-define
          drainUntilEmptyOrAsync()
        }
      }
    }
    const innerResolve = makeStep(1)
    const innerReject = makeStep(0)

    function drainUntilEmptyOrAsync () {
      isSync = true
      while (isSync && steps.length > 0) {
        currentParallelIsResolved = false
        currentParallel.fork(innerReject, innerResolve)
        isSync = currentParallelIsResolved
      }
      if (steps.length === 0) {
        currentParallel.fork(reject, resolve)
      }
    }

    drainUntilEmptyOrAsync()
  }
}

function safeFork (fork) {
  return (reject, resolve) => {
    let isPristine = true
    function callIfPristine (fn) {
      return (v) => {
        if (isPristine) {
          isPristine = false
          fn(v)
        }
      }
    }
    fork(callIfPristine(reject), callIfPristine(resolve))
  }
}

export class Parallel {
  constructor (fork) {
    this.fork = safeFork(fork)
  }

  [MAP] (f) {
    // eslint-disable-next-line no-use-before-define
    return createSequence(this, null, (v) => parallelOf(f(v)))
  }

  [CHAIN] (f) {
    return createSequence(this, null, f)
  }

  [AP] (b) {
    return new Parallel((reject, resolve) => {
      let applyFn
      let val
      let wasRejected = false
      let wasResolved = false
      let fnResolved = false

      function resolveIfDone () {
        if (fnResolved && wasResolved) {
          resolve(applyFn(val))
        }
      }

      function rejectIfFirst (e) {
        if (!wasRejected) {
          wasRejected = true
          reject(e)
        }
      }

      function handleValueResolve (v) {
        wasResolved = true
        val = v
        resolveIfDone()
      }

      function handeFnResolve (fn) {
        fnResolved = true
        applyFn = fn
        resolveIfDone()
      }

      this.fork(rejectIfFirst, handleValueResolve)
      b.fork(rejectIfFirst, handeFnResolve)
    })
  }

  [ALT] (b) {
    // eslint-disable-next-line no-use-before-define
    return createSequence(this, () => b, parallelOf)
  }

  [BIMAP] (f, g) {
    return createSequence(
      this,
      (e) => Parallel.reject(f(e)),
      // eslint-disable-next-line no-use-before-define
      (v) => parallelOf(g(v)),
    )
  }

  bichain (f, g) {
    return createSequence(this, f, g)
  }

  swap (f, g) {
    return createSequence(
      this,
      // eslint-disable-next-line no-use-before-define
      (e) => parallelOf(f(e)),
      (v) => Parallel.reject(g(v)),
    )
  }

  rejectMap (f) {
    return createSequence(this, (e) => Parallel.reject(f(e)), null)
  }

  rejectChain (f) {
    return createSequence(this, f, null)
  }
}

class Sequence extends Parallel {
  constructor (original, steps) {
    super(processSteps(original, steps))
    this.original = original
    this.steps = steps
  }
}

class ResolvedParallel extends Parallel {
  constructor (v) {
    super((_, resolve) => resolve(v))
    this.value = v
  }

  [MAP] (f) {
    return new ResolvedParallel(f(this.value))
  }

  [BIMAP] (_, g) {
    return new ResolvedParallel(g(this.value))
  }

  [ALT] () {
    return this
  }

  bichain (_, g) {
    return g(this.value)
  }

  swap (_, g) {
    // eslint-disable-next-line no-use-before-define
    return new RejectedParallel(g(this.value))
  }

  rejectMap () {
    return this
  }

  rejectChain () {
    return this
  }
}

class RejectedParallel extends Parallel {
  constructor (v) {
    super((reject) => reject(v))
    this.value = v
  }

  [MAP] () {
    return this
  }

  [CHAIN] () {
    return this
  }

  [AP] () {
    return this
  }

  [BIMAP] (f) {
    return new RejectedParallel(f(this.value))
  }

  // eslint-disable-next-line class-methods-use-this
  [ALT] (b) {
    return b
  }

  bichain (f) {
    return f(this.value)
  }

  swap (f) {
    return new ResolvedParallel(f(this.value))
  }

  rejectMap (f) {
    return new RejectedParallel(f(this.value))
  }

  rejectChain (f) {
    return f(this.value)
  }
}

Parallel[OF] = (v) => new ResolvedParallel(v)
Parallel.reject = (v) => new RejectedParallel(v)

export const parallelOf = of(Parallel)
export const reject = (v) => new RejectedParallel(v)

export const bichain = (f, g, p) => p.bichain(f, g)
export const swap = (f, g, p) => p.swap(f, g)

export const promiseToParallel = (promise) => new Parallel((rej, res) => {
  promise.then(res, rej)
})

export const parallelToPromise = (parallel) => new Promise((res, rej) => {
  parallel.fork(rej, res)
})
