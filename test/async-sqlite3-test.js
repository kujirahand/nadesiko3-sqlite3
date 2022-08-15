/**
 * テストの際はリポジトリを次のように配置してください
 * /repos
 *   |- nadesiko3
 *   |- nadesiko3-sqlite3
 */

import assert from 'assert'
import path from 'path'
import { NakoCompiler } from '../../nadesiko3/core/src/nako3.mjs'
import PluginNode from '../../nadesiko3/src/plugin_node.mjs'
import PluginSQLite3 from '../nadesiko3-sqlite3.js'
// __dirname のために
import url from 'url'
const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

describe('sqlite3async-test(同期的実行)', () => {
  const nako = new NakoCompiler()
  nako.addPluginObject('PluginNode', PluginNode)
  nako.addPluginObject('PluginSQLite3', PluginSQLite3)
  nako.setFunc('テスト', [['と'], ['で']], (a, b) => { assert.strictEqual(a, b) })
  nako.setFunc('表示', [['と', 'を']], (s) => { console.log('@', s) })
  const cmd = async (code) => {
    if (nako.debug) console.log('code=' + code)
    await nako.runReset(code)
  }
  // --- test ---
  nako.slient = false
  it('表示',async () => {
    await cmd('3と3でテスト')
  })
  // SQLite3のテスト ---
  const fname = path.join(__dirname, 'test_node_func.sqlite3')
  it('簡単な生成と抽出', async () => {
    await cmd(
      `『${fname}』をSQLITE3開く。\n` +
      '逐次実行\n' +
      '　先に、「CREATE TABLE IF NOT EXISTS ta(id INTEGER PRIMARY KEY, value INTEGER);」を[]でSQLITE3逐次実行\n' +
      '　次に、「DELETE FROM ta」を[]でSQLITE3逐次実行\n' +
      '　次に、「INSERT INTO ta (value) VALUES(10)」を[]でSQLITE3逐次実行\n' +
      '　次に、「INSERT INTO ta (value) VALUES(20)」を[]でSQLITE3逐次実行\n' +
      '　次に、「SELECT sum(value) FROM ta」を[]でSQLITE3逐次全取得\n' +
      '　次に、対象[0]["sum(value)"]と30でテスト。\n' +
      'ここまで\n'
    )
  })
  it('SQLITE3取得', async () => {
    await cmd(
      `『${fname}』をSQLITE3開く。\n` +
      '逐次実行\n' +
      '　先に、「CREATE TABLE IF NOT EXISTS ta(id INTEGER PRIMARY KEY, value INTEGER);」を[]でSQLITE3逐次実行\n' +
      '　次に、「DELETE FROM ta」を[]でSQLITE3逐次実行\n' +
      '　次に、「INSERT INTO ta (value) VALUES(10)」を[]でSQLITE3逐次実行\n' +
      '　次に、「INSERT INTO ta (value) VALUES(20)」を[]でSQLITE3逐次実行\n' +
      '　次に、「SELECT sum(value) FROM ta」を[]でSQLITE3逐次取得\n' +
      '　次に、対象["sum(value)"]と30でテスト。\n' +
      'ここまで\n'
    )
  })
  it('プレースフォルダ', async () => {
    await cmd(
      `『${fname}』をSQLITE3開く。\n` +
      '逐次実行\n' +
      '　先に、「CREATE TABLE IF NOT EXISTS ta(id INTEGER PRIMARY KEY, value INTEGER);」を[]でSQLITE3逐次実行\n' +
      '　次に、「DELETE FROM ta」を[]でSQLITE3逐次実行\n' +
      '　次に、「INSERT INTO ta (value) VALUES(?)」を[100]でSQLITE3逐次実行\n' +
      '　次に、「INSERT INTO ta (value) VALUES(?)」を[200]でSQLITE3逐次実行\n' +
      '　次に、「SELECT max(value) FROM ta」を[]でSQLITE3逐次取得\n' +
      '　次に、対象["max(value)"]と200でテスト。\n' +
      'ここまで\n'
    )
  })
  it('ID取得', async () => {
    await cmd(
      `『${fname}』をSQLITE3開く。\n` +
      '逐次実行\n' +
      '　先に、「CREATE TABLE IF NOT EXISTS ta(id INTEGER PRIMARY KEY, value INTEGER);」を[]でSQLITE3逐次実行\n' +
      '　次に、「DELETE FROM ta」を[]でSQLITE3逐次実行\n' +
      '　次に、「INSERT INTO ta (value) VALUES(?)」を[100]でSQLITE3逐次実行\n' +
      '　次に、SQLITE3今挿入IDと1でテスト。\n' +
      'ここまで\n'
    )
  })
})
