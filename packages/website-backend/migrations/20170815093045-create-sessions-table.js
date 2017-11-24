var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('sessions', {
    sid   : { type: 'string'   , notNull: true, primaryKey: true },
    sess  : { type: 'json'     , notNull: true },
    expire: { type: 'timestamp', notNull: true },
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('sessions', callback);
};
