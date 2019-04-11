const assert = require('assert')
const path = require('path')
const nadesiko3 = require('nadesiko3')
const NakoCompiler = nadesiko3.compiler
const PluginNode = nadesiko3.PluginNode
const PluginSQLite3 = require('../index')

const assert_func = (a, b) => { assert.equal(a, b) }

describe('sqlite3async-test(同期的実行)', () => {
  const nako = new NakoCompiler()
  nako.addPluginObject('PluginNode', PluginNode)
  nako.addPluginObject('PluginSQLite3', PluginSQLite3)
  nako.setFunc('テスト', [['と'], ['で']], assert_func)
  nako.setFunc('表示', [['と', 'を']], (s) => { console.log('@', s) })
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
  nako.slient = false
  it('表示', () => {
    cmd('3と3でテスト')
  })
  // SQLite3のテスト ---
  const fname = path.join(__dirname, 'test_node_func.sqlite3')
  it('簡単な生成と抽出', (done) => {
    global.done = done
    cmd(
      `『${fname}』をSQLITE3開く。\n` +
      '逐次実行\n' +
      '　先に、「CREATE TABLE IF NOT EXISTS ta(id INTEGER PRIMARY KEY, value INTEGER);」を[]でSQLITE3逐次実行\n' +
      '　次に、「DELETE FROM ta」を[]でSQLITE3逐次実行\n' +
      '　次に、「INSERT INTO ta (value) VALUES(10)」を[]でSQLITE3逐次実行\n' +
      '　次に、「INSERT INTO ta (value) VALUES(20)」を[]でSQLITE3逐次実行\n' +
      '　次に、「SELECT sum(value) FROM ta」を[]でSQLITE3逐次全取得\n' +
      '　次に、対象[0]["sum(value)"]と30でテスト。\n' +
      '　次に、JS{{{ global.done() }}}\n' +
      'ここまで\n'
    )
  })
  it('SQLITE3取得', (done) => {
    global.done = done
    cmd(
      `『${fname}』をSQLITE3開く。\n` +
      '逐次実行\n' +
      '　先に、「CREATE TABLE IF NOT EXISTS ta(id INTEGER PRIMARY KEY, value INTEGER);」を[]でSQLITE3逐次実行\n' +
      '　次に、「DELETE FROM ta」を[]でSQLITE3逐次実行\n' +
      '　次に、「INSERT INTO ta (value) VALUES(10)」を[]でSQLITE3逐次実行\n' +
      '　次に、「INSERT INTO ta (value) VALUES(20)」を[]でSQLITE3逐次実行\n' +
      '　次に、「SELECT sum(value) FROM ta」を[]でSQLITE3逐次取得\n' +
      '　次に、対象["sum(value)"]と30でテスト。\n' +
      '　次に、JS{{{ global.done() }}}\n' +
      'ここまで\n'
    )
  })
  it('プレースフォルダ', (done) => {
    global.done = done
    cmd(
      `『${fname}』をSQLITE3開く。\n` +
      '逐次実行\n' +
      '　先に、「CREATE TABLE IF NOT EXISTS ta(id INTEGER PRIMARY KEY, value INTEGER);」を[]でSQLITE3逐次実行\n' +
      '　次に、「DELETE FROM ta」を[]でSQLITE3逐次実行\n' +
      '　次に、「INSERT INTO ta (value) VALUES(?)」を[100]でSQLITE3逐次実行\n' +
      '　次に、「INSERT INTO ta (value) VALUES(?)」を[200]でSQLITE3逐次実行\n' +
      '　次に、「SELECT max(value) FROM ta」を[]でSQLITE3逐次取得\n' +
      '　次に、対象["max(value)"]と200でテスト。\n' +
      '　次に、JS{{{ global.done() }}}\n' +
      'ここまで\n'
    )
  })
})
