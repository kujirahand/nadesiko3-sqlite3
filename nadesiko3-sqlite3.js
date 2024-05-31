// plugin_sqlite3.js
import sqlite3 from 'sqlite3'
const ERR_OPEN_DB = 'SQLITE3の命令を使う前に『SQLITE3開く』でデータベースを開いてください。';
const PluginSQLite3 = {
  'meta': {
    type: 'const',
    value: {
      pluginName: 'nadesiko3-sqlite3', // プラグインの名前
      description: 'Node.js向けSQLiteプラグイン', // プラグインの説明
      pluginVersion: '3.6.6', // プラグインのバージョン
      nakoRuntime: ['cnako'], // 対象ランタイム
      nakoVersion: '3.6.0' // 要求なでしこバージョン
    }
  },
  '初期化': {
    type: 'func',
    josi: [],
    fn: function (sys) {
      sys.__sqlite3db = null
    }
  },
  // @SQLite3
  'SQLITE3今挿入ID': {type: 'const', value: '?'}, // @SQLITE3いまそうにゅうID
  'SQLITE3開': { // @SQlite3のデータベースを開いて、データベースオブジェクトを返す // @SQLITE3ひらく
    type: 'func',
    josi: [['を', 'の']],
    fn: function (s, sys) {
      const db = new sqlite3.Database(s)
      sys.__sqlite3db = db
      return db
    }
  },
  'SQLITE3閉': { // @アクティブなSQlite3のデータベースを閉じる // @SQLITE3とじる
    type: 'func',
    josi: [],
    fn: function (sys) {
      sys.__sqlite3db.close()
    },
    return_none: true
  },
  'SQLITE3切替': { // @アクティブなSQlite3のデータベースをDB(SQLITE3開くで開いたもの)に切り替える // @SQLITE3きりかえる
    type: 'func',
    josi: [['に', 'へ']],
    fn: function (db, sys) {
      sys.__sqlite3db = db
    },
    return_none: true
  },
  'SQLITE3実行時': { // @ SQLをパラメータPARAMSで実行する。完了するとコールバック関数Fを実行する。 // @SQLITE3じっこうしたとき
    type: 'func',
    josi: [['に'], ['を'], ['で']],
    fn: function (f, sql, params, sys) {
      if (!sys.__sqlite3db) throw new Error(ERR_OPEN_DB)
      const db = sys.__sqlite3db
      db.run(sql, params, function (err) {
        if (err) throw new Error('SQLITE3実行時のエラー『' + sql + '』' + err.message)
        sys.__v0['SQLITE3今挿入ID'] = this.lastID
        f()
      })
    }
  },
  'SQLITE3実行後': { // @ 『SQLITE3実行時』と同じ。 // @SQLITE3じっこうしたあと
    type: 'func',
    josi: [['に'], ['を'], ['で']],
    fn: function (f, sql, params, sys) {
      sys.__exec('SQLITE3実行時', [f, sql, params, sys])
    }
  },
  'SQLITE3取得時': { // @ SQLをパラメータPARAMSで取得実行する。完了するとコールバック関数Fが実行され、結果は第一引数に与えられる。 // @SQLITE3しゅとくしたとき
    type: 'func',
    josi: [['に'], ['を'], ['で']],
    fn: function (f, sql, params, sys) {
      if (!sys.__sqlite3db) throw new Error(ERR_OPEN_DB)
      const db = sys.__sqlite3db
      db.all(sql, params, (err, rows) => {
        if (err) throw err
        f(rows)
      })
    }
  },
  'SQLITE3実行': { // @ SQLをパラメータPARAMSで実行する。 // @SQLITE3じっこう
    type: 'func',
    josi: [['を'], ['で']],
    asyncFn: true,
    fn: function (sql, params, sys) {
      return new Promise((resolve, reject) => {
        if (!sys.__sqlite3db) {
          reject(ERR_OPEN_DB)
          return
        }
        const db = sys.__sqlite3db
        db.run(sql, params, function (err) {
          if (err) {
            console.log('[ERROR]', sql, err)
            reject(err)
            return
          }
          if (this.lastID) {
            sys.__v0['SQLITE3今挿入ID'] = this.lastID
          }
          // console.log(sql, params, err)
          resolve()
        })
      })
    },
    return_none: true
  },
  'SQLITE3取得': { // @ SQLをパラメータPARAMSで取得する。 // @SQLITE3しゅとく
    type: 'func',
    josi: [['を'], ['で']],
    asyncFn: true,
    fn: function (sql, params, sys) {
      return new Promise((resolve, reject) => {
        if (!sys.__sqlite3db) {
          reject(ERR_OPEN_DB)
          return
        }
        const db = sys.__sqlite3db
        db.get(sql, params, (err, row) => {
          if (err) {
            reject(err)
            return
          }
          resolve(row)
        })
      })
    },
    return_none: false
  },
  'SQLITE3全取得': { // @ SQLをパラメータPARAMSで全部取得する。 // @SQLITE3ぜんしゅとく
    type: 'func',
    josi: [['を'], ['で']],
    asyncFn: true,
    fn: function (sql, params, sys) {
      return new Promise((resolve, reject) => {
        if (!sys.__sqlite3db) {
          reject(ERR_OPEN_DB)
          return
        }
        const db = sys.__sqlite3db
        db.all(sql, params, (err, rows) => {
          if (err) {
            reject(err)
            return
          }
          resolve(rows)
        })
      })
    },
    return_none: false
  }
}

export default PluginSQLite3

// module.exports = PluginSQLite3

