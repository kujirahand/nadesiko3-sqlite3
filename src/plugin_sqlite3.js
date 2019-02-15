// plugin_sqlite3.js
const sqlite3 = require('sqlite3')
const PluginSQLite3 = {
  '初期化': {
    type: 'func',
    josi: [],
    fn: function (sys) {
    }
  },
  // @SQLite3
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
  'SQLITE3実行後': { // @ SQLをパラメータPARAMSで実行する。完了するとコールバック関数Fを実行する。 // @SQLITE3じっこうしたあと
    type: 'func',
    josi: [['に'], ['を'], ['で']],
    fn: function (f, sql, params, sys) {
      if (!sys.__sqlite3db) throw new Error('SQLITE3実行時の前に『SQLITE3開く』でデータベースを開いてください')
      const db = sys.__sqlite3db
      db.run(sql, params, (err) => {
        if (err) throw new Error('SQLITE3実行後のエラー『' + sql + '』' + err.message)
        f()
      })
    }
  },
  'SQLITE3取得後': { // @ SQLをパラメータPARAMSで取得実行する。完了するとコールバック関数Fが実行され、結果は第一引数に与えられる。 // @SQLITE3じっこうしゅとくしたあと
    type: 'func',
    josi: [['に'], ['を'], ['で']],
    fn: function (f, sql, params, sys) {
      if (!sys.__sqlite3db) throw new Error('SQLITE3実行時の前に『SQLITE3開く』でデータベースを開いてください')
      const db = sys.__sqlite3db
      db.all(sql, params, (err, rows) => {
        if (err) throw err
        f(rows)
      })
    }
  }
}

module.exports = PluginSQLite3
