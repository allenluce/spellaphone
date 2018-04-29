#!/usr/bin/env node
const spellaPhone = require('.')
const yargs = require('yargs')

const argv = yargs.usage(`Usage: $0 [options] [number [number ...]]\n
If no arguments are given, $0 will read a numbers from standard input,
one per line, and print all the phrases that can be spelled with those
numbers on standard output.`)
  .option('n', {
    alias: 'no-header',
    description: `Do not print headers/indentation for multi-number output.`,
    type: 'boolean',
    default: undefined,
    conflicts: 'H'
  })
  .option('H', {
    alias: 'header',
    description: `Force header/indentation for even single-number output.`,
    type: 'boolean',
    default: undefined,
    conflicts: 'n'
  })
  .option('q', {
    alias: 'quiet',
    description: `Don't show the "no matches" lines when there are no matches.`,
    type: 'boolean'
  })
  .option('t', {
    alias: 'translate',
    description: `Translate the words back into numbers.`,
    type: 'boolean'
  })
  .option('c', {
    alias: 'count',
    description: `Add the count of found spellings to the per-number header.`,
    type: 'boolean'
  }).check((argv, opts) => {
    if (argv.c && argv._.length === 1 && !argv.H) {
      throw new Error('use -H with -c to get headers with counts')
    }
    if (argv.c && argv.n) {
      throw new Error(`-c requires headers, don't use -n with it`)
    }
    return true
  })
  .version()
  .help('h')
  .argv

let nums = []

if (argv._.length > 0) { // Consume from command line
  nums = argv._
  output()
} else { // Consume from standard input
  require('readline').createInterface({ input: process.stdin })
    .on('line', num => nums.push(num))
    .on('close', output)
}

function output () {
  // Phone letter to number translation table
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

  for (const num of nums) {
    if (argv.t) { // Just translate
      console.log(`${num}: ${num.toLowerCase().split('').map(c => tr[c] || c).join('')}`)
      continue
    }
    const phrases = spellaPhone(num.replace(/\D/g, ''))
    if (phrases.length === 0) { // Didn't find any.
      if (!argv.q) {
        process.stdout.write(`No matches found for ${num}.\n`)
      }
      continue
    }
    let indent = ''
    if (!argv.n && (nums.length > 1 || argv.H)) { // Indent and show header?
      let count = ''
      if (argv.c) {
        count = `, ${phrases.length} total`
      }
      process.stdout.write(`${num}${count}:\n`)
      indent = '  '
    }
    process.stdout.write(indent + phrases.join('\n' + indent))
    process.stdout.write('\n')
  }
}
