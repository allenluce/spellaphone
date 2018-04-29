const zlib = require('zlib')
const fs = require('fs')
const stringifyObject = require('stringify-object')
const Trie = require('./trie.js')

const tr = {
  a: 2, b: 2, c: 2,
  d: 3, e: 3, f: 3,
  g: 4, h: 4, i: 4,
  j: 5, k: 5, l: 5,
  m: 6, n: 6, o: 6,
  p: 7, r: 7, s: 7,
  t: 8, u: 8, v: 8,
  w: 9, x: 9, y: 9
}

const trie = new Trie([], [])
const words = {}

const lineReader = require('readline').createInterface({
  input: process.stdin
})

lineReader.on('line', w => {
  if (w.indexOf('q') !== -1 || w.indexOf('z') !== -1) {
    return
  }
  const key = [...w].map(c => tr[c]).join('')
  if (!words[key]) {
    words[key] = []
  }
  words[key].push(w)
})

lineReader.on('close', outputTrie)

function outputTrie () {
  // Convert the list of words into a trie
  Object.keys(words).forEach(key => trie.set(key.split('').map(n => +n), words[key]))

  // Create minimal, zippable version for browsers
  const code = 'module.exports = '
  const minimal = code + stringifyObject(trie, {
    singleQuotes: true
  }).replace(/([\t\n ])/gm, '')

  fs.writeFileSync('min-data.js', minimal)

  // And a less-minimal version for fast JSON parsing in Node.
  const f = fs.openSync('data.js', 'w')
  fs.writeSync(f, `const zlib = require('zlib')
const encodedtrie = \`
`)

  const raw = zlib.gzipSync(JSON.stringify(trie)).toString('base64')
  for (let i = 0; i < raw.length; i++) {
    if (i && i % 73 === 0) {
      fs.writeSync(f, '\n')
    }
    fs.writeSync(f, raw[i])
  }
  fs.writeSync(f, `\`
module.exports = JSON.parse(zlib.gunzipSync(Buffer.from(encodedtrie, 'base64')).toString('ascii'))
`)
  fs.closeSync(f)
}
