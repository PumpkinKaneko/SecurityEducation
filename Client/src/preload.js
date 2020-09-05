/**
 * preload.js
 * process や Electron を windowオブジェクト に保存する処理
 */

 //const electron = require('electron');
 const fs = require('fs')
 const path = require('path')
 const crypto = require('crypto')

process.once('loaded', () => {
  
  //console.log('---- preload.js loaded ----');
  global.process = process;
  //global.electron = electron;
  global.module = module;
  global.fs = fs;
  global.path = path;
  global.crypto = crypto;
});