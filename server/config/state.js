let tables = {
  1: 'cates',
  2: 'notecates',
  3: 'notes',
  4: 'posts'
}
let tableids = {}

for (let key in tables) {
  tableids[tables[key]] = parseInt(key)
}
let usnstates = {
  'create': 1,
  'update': 2,
  'delete': 0
}
module.exports = {
  tables,
  tableids,
  usnstates
}
