'use strict'

const bounds = require('binary-search-bounds')

module.exports = createStateMachine

function ACState (symbols, children, next, value) {
  this.s = symbols
  this.c = children
  this.next = next
  this.v = value
}

ACState.prototype.push = function (c) {
  let state = this
  while (true) {
    const sym = state.s
    const i = bounds.eq(sym, c)
    if (i < 0) {
      if (state.next === state) {
        break
      }
      state = state.next
    } else {
      state = state.c[i]
      break
    }
  }
  return state
}

function trieToAutomata (trie) {
  const symbols = trie.s.slice()
  const children = new Array(trie.c.length)
  for (let i = 0; i < children.length; ++i) {
    children[i] = trieToAutomata(trie.c[i])
  }
  return new ACState(symbols, children, null, trie.v, null)
}

function createStateMachine (trie) {
  // First pass: translate trie to automata
  const root = trieToAutomata(trie)
  root.next = root

  // Second pass: iterate over trie in bfs order, attach prefixes
  const Q = root.c.slice()
  for (let j = 0; j < Q.length; ++j) {
    Q[j].next = root
  }
  let ptr = 0
  while (ptr < Q.length) {
    const r = Q[ptr++]
    const sym = r.s
    const children = r.c
    const n = sym.length
    for (let i = 0; i < n; ++i) {
      const a = sym[i]
      const u = children[i]
      u.next = root
      Q.push(u)
      let v = r.next
      do {
        const j = bounds.eq(v.s, a)
        if (j >= 0) {
          u.next = v.c[j]
          break
        } else {
          v = v.next
        }
      } while (v !== root)
    }
  }

  // Done: return root
  return root
}

// The above is adapted from https://github.com/mikolalysenko/aho-corasick-automaton
// under the following license.
//
// The MIT License (MIT)
// 
// Copyright (c) 2013 Mikola Lysenko
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
