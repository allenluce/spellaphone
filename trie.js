'use strict'

const bounds = require('binary-search-bounds')

module.exports = class Trie {
  constructor (symbols, children, value) {
    this.s = symbols
    this.c = children
    if (typeof value !== 'undefined') {
      this.v = value
    }
  }

  set (s, value) {
    if (s.shape) {
      let v = this
      const n = s.shape[0]
      for (let i = 0; i < n; ++i) {
        const c = s.get(i)
        const j = bounds.ge(v.s, c)
        if (j < v.s.length && v.s[j] === c) {
          v = v.c[j]
        } else {
          let l = new Trie([], [], value)
          for (let k = n - 1; k > i; --k) {
            l = new Trie([s.get(k)], [l])
          }
          v.s.splice(j, 0, c)
          v.c.splice(j, 0, l)
          return value
        }
      }
      if (typeof value !== 'undefined') {
        v.v = value
      }
    } else {
      let v = this
      const n = s.length
      for (let i = 0; i < n; ++i) {
        const c = s[i]
        const j = bounds.ge(v.s, c)
        if (j < v.s.length && v.s[j] === c) {
          v = v.c[j]
        } else {
          let l = new Trie([], [], value)
          for (let k = n - 1; k > i; --k) {
            l = new Trie([s[k]], [l])
          }
          v.s.splice(j, 0, c)
          v.c.splice(j, 0, l)
          return value
        }
      }
      if (typeof value !== 'undefined') {
        v.v = value
      }
    }
  }
}

// The above is adapted from https://github.com/mikolalysenko/array-trie
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
