<p align="center">
  <img src="https://github.com/allenluce/spellaphone/raw/master/docs/spellaphone.png?raw=true" alt="SpellaPhone" width="985" height="319" />
</p>

<!-- BADGES/ -->

<span class="badge-travisci"><a href="http://travis-ci.org/allenluce/spellaphone" title="Check this project's build status on TravisCI"><img src="https://img.shields.io/travis/allenluce/spellaphone/master.svg" alt="Travis CI Build Status" /></a></span>
<span class="badge-npmversion"><a href="https://npmjs.org/package/spellaphone" title="View this project on NPM"><img src="https://img.shields.io/npm/v/spellaphone.svg" alt="NPM version" /></a></span>

<!-- /BADGES -->

## Find out what your number spells!
<div id="demo"></div>

### Use in the browser!

<a href="https://jsfiddle.net/allenluce/c49r5b4b/" target="blank">
  <img align="center" src="https://github.com/allenluce/spellaphone/raw/master/docs/web.gif?raw=true" alt="A web page goes here" width="333" height="289" />
</a>

    <script src="https://cdn.jsdelivr.net/gh/allenluce/spellaphone/spellaphone.js"></script>
    <script>
      const spellaPhone = require('spellaphone')
      const words = spellaPhone('7976638377')
      console.log(words)
    </script>

### Use on the command line!

<img src="https://github.com/allenluce/spellaphone/raw/master/docs/flat.gif?raw=true" alt="npm install -g spellaphone" width="815" height="226" />

### Spell a bunch 'o numbers:

<img src="https://github.com/allenluce/spellaphone/raw/master/docs/bulk.gif?raw=true" alt="npm install -g spellaphone" width="888" height="824" />

#### Use with Node.js!  Install:

    npm install --save spellaphone

And code:

    const spellaPhone = require('spellaphone')
    const words = spellaPhone('8004654329')
    console.log(words)

## What are the words?

The [words](words.txt) come from the
[SCOWL](http://wordlist.aspell.net) corpus of English and American
words. The actual files used are the SCOWL final ones of SCOWL
size 70. Single letter "words" (except for "a") have been removed as
has any word containing a q or a z, as those aren't on my phone's
dial.

## Technical details

The 1970's [Aho-Corasick algorithm](https://cr.yp.to/bib/1975/aho.pdf)
is used to perform a simultaneous search of over 100,000 dictionary
words and find matches for your phone number. Alfred Aho and Margaret
Corasick's groundbreaking work resulted in a speedup of four or five
times over the algorithms of the day and hundreds of times over a
simple dictionary search. The Spellaphone algorithm is an adaptation
of the Aho-Corsick algorithm that finds words by searching with
numbers.
