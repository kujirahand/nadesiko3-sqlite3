/**
 * テストの際はリポジトリを次のように配置してください
 * /repos
 *   |- nadesiko3
 *   |- nadesiko3-sqlite3
 */

const assert = require('assert')
const path = require('path')
const nadesiko3 = require('../../nadesiko3')
const NakoCompiler = nadesiko3.compiler
const PluginNode = nadesiko3.PluginNode
const PluginSQLite3 = require('../src/nadesiko3-sqlite3')

describe('sqlite3_test', () => {
  const nako = new NakoCompiler()
  nako.addPluginObject('PluginNode', PluginNode)
  nako.addPluginObject('PluginSQLite3', PluginSQLite3)
  nako.setFunc('テスト', [['と'], ['で']], (a, b) => { assert.strictEqual(a, b) })
  nako.setFunc('ASSERT等', [['と'], ['が']], (a, b) => { assert.strictEqual(a, b) })
  nako.setFunc('DONE', [], () => { global.done() })
  const cmp = (code, res) => {
    if (nako.debug) {
      console.log('code=' + code)
    }
    assert.strictEqual(nako.runReset(code).log, res)
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
    cmd(`「${fname}」をSQLITE3開く。\n「${sqlCreate}」を[]でSQLITE3実行時には;1と1がASSERT等しい;DONE;ここまで;`)
  })
  it('SQLite3 - delete all', (done) => {
    global.done = done
    cmd(`「${fname}」をSQLITE3開く。「DELETE FROM tt」を[]でSQLITE3実行時には;1と1がASSERT等しい;DONE;ここまで;`)
  })
  it('SQLite3 - insert', (done) => {
    global.done = done
    const sqlIns = 'INSERT INTO tt (value) VALUES (?);'
    cmd(`「${fname}」をSQLITE3開く。「${sqlIns}」を[1]でSQLITE3実行時には;1と1がASSERT等しい;DONE;ここまで;`)
  })
  it('SQLite3 - SQLITE3取得後', (done) => {
    global.done = done
    const sqlSelect = 'SELECT * FROM tt;'
    cmd(`「${fname}」をSQLITE3開く。F=関数(D)\nD[0]['value']と1がASSERT等しい。DONE;ここまで;Fに「${sqlSelect}」を[]でSQLITE3取得時`)
  })
  // asyncFn のテスト
  it('SQLite3 - create - SQLITE3実行', (done) => {
    global.done = done
    const sql = 'CREATE TABLE IF NOT EXISTS tt (id INTEGER PRIMARY KEY, value INTEGER);'
    cmd(`「${fname}」をSQLITE3開く。\n「${sql}」を[]でSQLITE3実行;DONE;`)
  })
  it('SQLite3 - delete - SQLITE3実行', (done) => {
    global.done = done
    const sql = 'DELETE from tt;'
    cmd(`「${fname}」をSQLITE3開く。\n「${sql}」を[]でSQLITE3実行;DONE;`)
  })
  it('SQLite3 - insert - SQLITE3実行', (done) => {
    global.done = done
    const sql = 'INSERT INTO tt (id,value)VALUES(?,?);'
    cmd(`「${fname}」をSQLITE3開く。\n5回,「${sql}」を[回数,回数]でSQLITE3実行;DONE;`)
  })
  it('SQLite3 - select - SQLITE3取得', (done) => {
    global.done = done
    const sql = 'SELECT value FROM tt WHERE id=?;'
    cmd(`「${fname}」をSQLITE3開く。\n「${sql}」を[1]でSQLITE3取得;それ['value']と1がASSERT等しい。DONE;`)
  })
  it('SQLite3 - select - SQLITE3全取得', (done) => {
    global.done = done
    const sql = 'SELECT value FROM tt WHERE id=?;'
    cmd(`「${fname}」をSQLITE3開く。\n「${sql}」を[1]でSQLITE3全取得;それ[0]['value']と1がASSERT等しい。DONE;`)
  })
  // --- ここまでSQLite3のテスト
})
