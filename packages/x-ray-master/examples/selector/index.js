var path = require('path')
var read = require('fs').readFileSync
var html = read(path.resovlve(__dirname, 'index.html'))
var Xray = require('..')
var x = Xray()

x(html, 'h2')(console.log)
