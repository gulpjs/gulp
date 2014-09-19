'use strict';

var timer = { }, batch = { };
var limit = {
  start : 5
};

function batchThese(name, data, callback){

  if(timer[name]){
    clearTimeout(timer[name]);
    delete timer[name];
  }

  batch[name] = batch[name] || [];
  batch[name].push(data);

  var bound = limit[name] || 3;
  if( batch[name].length > bound ){
    callback(batch[name]);
    delete batch[name];
    return ;
  }

  timer[name] = setTimeout(function(){
    if( batch[name] ){
      callback(batch[name]);
    }
    delete batch[name];
  });
}

module.exports = batchThese;
