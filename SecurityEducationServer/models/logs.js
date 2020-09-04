const Sequelize = require('sequelize');
const dbConfig = require('../database/db-config');

/**
 * Logs テーブルの Entity モデル
 */
const logs = dbConfig.define('logs', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true 
  },
  user_id: {
    type: Sequelize.STRING
  },
  type: {
    type: Sequelize.STRING
  },
  datetime: {
    type: Sequelize.STRING
  },
}, {
  // タイムスタンプの属性 (updatedAt, createdAt) が不要ならば次のプロパティは false
  timestamps: false,

  // テーブル名を変更したくない場合は次のプロパティを true
  // デフォルトでは sequelize はテーブル名を複数形に変更する
  //freezeTableName: true
});

module.exports = logs;