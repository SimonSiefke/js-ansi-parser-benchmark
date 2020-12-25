const AnsiParser = require('../parsers/node-ansi-parser.js')
const fs = require('fs')
const { performance } = require('perf_hooks')

const lsFixture = fs.readFileSync(__dirname + '/../fixtures/ls.txt').toString()

var test_terminal = {
  calls: [],
  clear: function () {
    this.calls = []
  },
  compare: function (value) {
    // chai.expect(this.calls.slice()).eql(value) // weird bug w'o slicing here
  },
  inst_p: function (s) {
    this.calls.push(['print', s])
  },
  inst_o: function (s) {
    this.calls.push(['osc', s])
  },
  inst_x: function (flag) {
    this.calls.push(['exe', flag])
  },
  inst_c: function (collected, params, flag) {
    this.calls.push(['csi', collected, params, flag])
  },
  inst_e: function (collected, flag) {
    this.calls.push(['esc', collected, flag])
  },
  inst_H: function (collected, params, flag) {
    this.calls.push(['dcs hook', collected, params, flag])
  },
  inst_P: function (dcs) {
    this.calls.push(['dcs put', dcs])
  },
  inst_U: function () {
    this.calls.push(['dcs unhook'])
  },
}

const bytesToSize = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes == 0) return '0 Byte'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
}

const array = new Uint8Array(lsFixture.split('').map((x) => x.charCodeAt()))

let total = 0
for (let i = 0; i < 100; i++) {
  test_terminal.clear()
  const parser = new AnsiParser(test_terminal)
  console.log(bytesToSize(lsFixture.length))
  const start = performance.now()
  parser.parse(lsFixture)
  const end = performance.now()
  console.log(`took ${end - start}ms`)
  total += end - start
}

console.log(`average of 100: ${total / 100}ms`)
