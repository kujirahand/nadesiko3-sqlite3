const assert = require('assert')
const path = require('path')
const NakoCompiler = require('nadesiko3')
const PluginSQLite3 = require('../src/plugin_sqlite3.js')

describe('sqlite3_test', () => {
  const nako = new NakoCompiler()
  nako.addPluginFile('PluginSQLite3', 'plugin_sqlite3.js', PluginSQLite3)
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
    cmp('1+2*3を表示', '7')
    cmp('A=30;「--{A}--」を表示', '--30--')
  })
  // SQLite3のテスト ---
  const fname = path.join(__dirname, 'test_node_func.sqlite3')
  it('SQLite3 - create', (done) => {
    global.done = done
    const sqlCreate = 'CREATE TABLE IF NOT EXISTS tt (id INTEGER PRIMARY KEY, value INTEGER);'
    cmd(`「${fname}」をSQLITE3開く。「${sqlCreate}」を[]でSQLITE3実行後には;1と1がASSERT等しい;JS{{{global.done();}}};---;`)
  })
  it('SQLite3 - delete all', (done) => {
    global.done = done
    cmd(`「${fname}」をSQLITE3開く。「DELETE FROM tt」を[]でSQLITE3実行後には;1と1がASSERT等しい;JS{{{global.done();}}};---;`)
  })
  it('SQLite3 - insert', (done) => {
    global.done = done
    const sqlIns = 'INSERT INTO tt (value) VALUES (?);'
    cmd(`「${fname}」をSQLITE3開く。「${sqlIns}」を[1]でSQLITE3実行後には;1と1がASSERT等しい;JS{{{global.done();}}};---;`)
  })
  it('SQLite3 - SQLITE3取得後', (done) => {
    global.done = done
    const sqlSelect = 'SELECT * FROM tt;'
    cmd(`「${fname}」をSQLITE3開く。F=関数(D)→D[0]['value']と1がASSERT等しい。JS{{{global.done()}}}←;Fに「${sqlSelect}」を[]でSQLITE3取得後`)
  })
  // --- ここまでSQLite3のテスト
})
