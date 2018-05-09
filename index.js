'use strict'
const createAC = require('./ac')
const trie = require('./data')
const automata = createAC(trie)

module.exports = function (number) {
  const numbers = search(number.split('').map(function (n) { return +n }), automata, [])
  // Filter a few out
  return numbers.filter(function (num) {
    // Nothing but numbers?
    if (/^\d+$/.test(num)) return false
    // Only 1-letter words + numbers?
    if (/\d/.test(num) && !(/[a-z]{2}/.test(num))) return false
    return true
  })
}

function coalesceNumbers (soFar, nums) {
  const lastSoFar = soFar[soFar.length - 1]
  if (lastSoFar && lastSoFar.length > 0 && '0123456789'.indexOf(lastSoFar[lastSoFar.length - 1]) !== -1) {
    return soFar.slice(0, soFar.length - 1).concat(nums)
  } else {
    return soFar.concat(nums)
  }
}

function search (data, initState, soFar) {
  if (data.length === 0) {
    if (soFar.length === 0) return []
    return [soFar.join(' ')]
  }
  let leads = ''
  while (data.length > 0 && data[0] < 2) {
    leads += data[0]
    data = data.slice(1)
  }
  if (leads !== '') {
    soFar = coalesceNumbers(soFar, leads)
  }
  let wordlist = []
  let state = initState
  for (let i = 0; i < data.length;) {
    state = state.push(data[i++])
    for (let cur = state; cur.v !== undefined; cur = cur.next) {
      // Nothing here, add as number and try again.
      if (cur.v.length === 0) {
        wordlist = wordlist.concat(search(data.slice(i), initState, coalesceNumbers(soFar, data.slice(0, i).join(''))))
      }
      cur.v.forEach(function (word) {
        if (word.length === i) {
          wordlist = wordlist.concat(search(data.slice(i), initState, soFar.concat(word)))
          return
        }
        const sf = coalesceNumbers(soFar, data.slice(0, i - word.length).join(''))
        wordlist = wordlist.concat(search(data.slice(i), initState, sf.concat(word)))
      })
    }
  }
  return wordlist
}

// Current as of __GITHASH__
