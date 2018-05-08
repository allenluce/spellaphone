'use strict'
/* global describe it */
const expect = require('chai').expect
const childProcess = require('child_process')
const spellaPhone = require('..')

describe('SpellaPhone module', function () {
  it('finds a "normal" number', function () {
    expect(spellaPhone('23673')).to.have.same.members(expectations['23673'])
  })
  it('deals with embedded numbers', function () {
    expect(spellaPhone('6060842')).to.have.same.members(expectations['6060842'])
  })
  it('finds words around non-matching numbers', function () {
    expect(spellaPhone('8004654329')).to.include('800 holiday')
  })
  it('returns empty array for nothing', function () {
    expect(spellaPhone('')).to.eql([])
  })
})

function testArgsInput (args, input, done) {
  let expects = args.map(a => expectations[a])
  if (expects.length > 0) {
    expects = expects.reduce(function (a, c) {
      return a.concat(c)
    })
  }
  args.unshift('-n')
  const child = childProcess.execFile('./cli.js', args, (error, stdout) => {
    expect(error).to.not.exist
    const output = stdout.trim().split('\n')
    expect(output).to.have.same.members(expects)
    done()
  })
  input.forEach(input => {
    child.stdin.write(input + '\n')
    expects = expects.concat(expectations[input])
  })
  child.stdin.end()
}

function testArgsExpects (args, expects, done) {
  childProcess.execFile('./cli.js', args, (error, stdout) => {
    expect(error).to.not.exist
    const output = stdout.trim().split('\n')
    expect(output).to.eql(expects)
    done()
  })
}

describe('SpellaPhone CLI', function () {
  it('will take a number on the command line', function (done) {
    testArgsInput(['6060842'], [], done)
  })
  it('will take multiple numbers on the command line', function (done) {
    testArgsInput(['6060842', '8002738255'], [], done)
  })
  it('will take a number via stdin', function (done) {
    testArgsInput([], ['8002738255'], done)
  })
  it('will take multiple numbers via stdin', function (done) {
    testArgsInput([], ['8002738255', '6345789', '6060842', '23673'], done)
  })
  it('will clean out non-numbers from a number on the command line', function (done) {
    testArgsExpects(['num is 606-084-2 ayup'], expectations['6060842'], done)
  })
  it('prints headers/indents for multi-number requests', function (done) {
    const expects = [
      '8002738255:',
      ...expectations['8002738255'].map(e => `  ${e}`),
      '3135158772:',
      ...expectations['3135158772'].map(e => `  ${e}`)
    ]
    testArgsExpects(['8002738255', '3135158772'], expects, done)
  })
  it('adds headers/indents when requested', function (done) {
    const expects = [
      '3135158772:',
      ...expectations['3135158772'].map(e => `  ${e}`)
    ]
    testArgsExpects(['-H', '3135158772'], expects, done)
  })
  it('will report no matches', function (done) {
    testArgsExpects(['867-5309'], ['No matches found for 867-5309.'], done)
  })
  it('will suppress no match messages on request.', function (done) {
    testArgsExpects(['-q', '777-9311'], [''], done)
  })
  it('will translate from spelling to number.', function (done) {
    testArgsExpects(['-t', '1-900-Mix-A-Lot'], ['1-900-Mix-A-Lot: 1-900-649-2-568'], done)
  })
  it('will output counts when requested.', function (done) {
    this.timeout(10000)
    testArgsExpects(
      ['-H', '-c', '853-3937'],
      ['853-3937, 38 total:', ...expectations['8533937'].map(e => `  ${e}`)], done)
  })
})

const expectations = {
  '3135158772': [
    '31351 lur pa', '31351 lur 7 a', '313515 ts pa', '313515 ts 7 a',
    '313515 up pa', '313515 up 7 a', '313515 us pa', '313515 us 7 a'
  ],
  '6060842': [
    '6060 ti a', '6060 uh a', '6060 tic', '6060 via', '60608 ha'
  ],
  '8002738255': [
    '800 a pe talk', '800 a pe tall', '800 a pe 8 all', '800 a re talk',
    '800 a re tall', '800 a re 8 all', '800 a pet all', '800 a rev all',
    '800 a set all', '800 a 7 et all', '800 as et all', '800 cs et all',
    '800 ape talk', '800 ape tall', '800 ape 8 all', '800 are talk',
    '800 are tall', '800 are 8 all', '8002 pe talk', '8002 pe tall',
    '8002 pe 8 all', '8002 re talk', '8002 re tall', '8002 re 8 all'
  ],
  '6345789': [
    'me 45 sty', 'mf 45 sty', 'ne 45 sty', 'od 45 sty', 'of 45 sty',
    'meg 5 sty', 'meh 5 sty', '6 eh 5 sty', '6345 sty'
  ],
  '23673': [
    'a do pe', 'a do re', 'a em pe', 'a em re', 'a en pe', 'a en re',
    'a dope', 'a dose', 'a ford', 'a fore', 'a 3 ope', 'a 3 ore',
    'a 36 pe', 'a 36 re', 'ad ope', 'ad ore', 'ad 6 pe', 'ad 6 re',
    'be ope', 'be ore', 'be 6 pe', 'be 6 re', 'ado pe', 'ado re',
    'ben pe', 'ben re', '2 do pe', '2 do re', '2 em pe', '2 em re',
    '2 en pe', '2 en re', 'adore', 'afore', 'cense', '2 dope', '2 dose',
    '2 ford', '2 fore', '23 ope', '23 ore', '236 pe', '236 re'
  ],
  '8533937': [
    '8 ked yep', '8 ked yer', '8 ked yes', '8 ked 9 er', '8 ked 9 es',
    '8 kef yep', '8 kef yer', '8 kef yes', '8 kef 9 er', '8 kef 9 es',
    '8 led yep', '8 led yer', '8 led yes', '8 led 9 er', '8 led 9 es',
    '8 lee yep', '8 lee yer', '8 lee yes', '8 lee 9 er', '8 lee 9 es',
    '85 de yep', '85 de yer', '85 de yes', '85 de 9 er', '85 de 9 es',
    '85 fewer', '853 dyer', '853 dyes', '853 ewer', '853 ewes',
    '853 exes', '853 eyer', '853 eyes', '8533 yep', '8533 yer',
    '8533 yes', '85339 er', '85339 es'
  ]
}
