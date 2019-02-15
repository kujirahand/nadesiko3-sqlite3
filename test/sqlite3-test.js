const assert = require('assert')
const path = require('path')
const nadesiko3 = require('nadesiko3')
const NakoCompiler = nadesiko3.compiler
const PluginNode = nadesiko3.PluginNode
const PluginSQLite3 = require('../index')

describe('sqlite3_test', () => {
  const nako = new NakoCompiler()
  nako.addPluginObject('PluginNode', PluginNode)
  nako.addPluginObject('PluginSQLite3', PluginSQLite3)
  // console.log(nako.gen.plugins)
  // nako.debug = true
  const cmp = (code, res) => {
    if (nako.debug) {
      console.log('code=' + code)
    }
    assert.equal(nako.runReset(code).log, res)
  }
  const cmd = (code) => {
    if (nako.debug) console.log('code=' + code)
    nako.runReset(code)
  }
  // --- test ---
  it('表示', () => {
    cmp('3を表示', '3')
  })
  // SQLite3のテスト ---
  const fname = path.join(__dirname, 'test_node_func.sqlite3')
  it('SQLite3 - create', (done) => {
    global.done = done
    const sqlCreate = 'CREATE TABLE IF NOT EXISTS tt (id INTEGER PRIMARY KEY, value INTEGER);'
    cmd(`「${fname}」をSQLITE3開く。\n「${sqlCreate}」を[]でSQLITE3実行後には;1と1がASSERT等しい;JS{{{global.done();}}};ここまで;`)
  })
  it('SQLite3 - delete all', (done) => {
    global.done = done
    cmd(`「${fname}」をSQLITE3開く。「DELETE FROM tt」を[]でSQLITE3実行後には;1と1がASSERT等しい;JS{{{global.done();}}};ここまで;`)
  })
  it('SQLite3 - insert', (done) => {
    global.done = done
    const sqlIns = 'INSERT INTO tt (value) VALUES (?);'
    cmd(`「${fname}」をSQLITE3開く。「${sqlIns}」を[1]でSQLITE3実行後には;1と1がASSERT等しい;JS{{{global.done();}}};ここまで;`)
  })
  it('SQLite3 - SQLITE3取得後', (done) => {
    global.done = done
    const sqlSelect = 'SELECT * FROM tt;'
    cmd(`「${fname}」をSQLITE3開く。F=関数(D)\nD[0]['value']と1がASSERT等しい。JS{{{global.done()}}}ここまで;Fに「${sqlSelect}」を[]でSQLITE3取得後`)
  })
  it('SQLite3 - 同期実行', (done) => {
    const sql = 'SELECT * FROM tt;'
    cmp(
      `「${fname}」をSQLITE3開く。` +
      `「${sql}」をSQLITE3実行。` +
      `「1」と表示`, '1')
  })
  // --- ここまでSQLite3のテスト
})
