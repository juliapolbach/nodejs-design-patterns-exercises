// Modify the asynchronous FindRegex class so that it emits
// an event when the find process starts, passing the input
// files list as an argument. Hint: beware of Zalgo!

import { EventEmitter } from 'events'
import { readFile } from 'fs'

class FindRegex extends EventEmitter {
  constructor (regex) {
    super()
    this.regex = regex
    this.files = []
  }

  addFile (file) {
    this.files.push(file)
    return this
  }

  find () {
    // +++ 3.1 added line
    // Need to use process.nextTick() to emit 'started' event asynchronously.
    // The other events are asynchronous because are called
    // inside the readFile async function.

    process.nextTick(() => this.emit('started', this.files))
    for (const file of this.files) {
      readFile(file, 'utf8', (err, content) => {
        if (err) {
          return this.emit('error', err)
        }
        this.emit('fileread', file)
        const match = content.match(this.regex)
        if (match) {
          match.forEach(elem => this.emit('found', file, elem))
        }
      })
    }
    return this
  }
}

const findRegexInstance = new FindRegex(/hello \w+/)
findRegexInstance
  .addFile('fileA.txt')
  .addFile('fileB.json')
  .find()
  .on('started', (files) => console.log(`Started process for this files: ${files}`))
  .on('found', (file, match) => console.log(`Matched "${match}" in file ${file}`))
  .on('error', err => console.error(`Error emitted ${err.message}`))
