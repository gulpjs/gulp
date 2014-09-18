'use strict';

var timer = { }, batch = { };

module.exports = function (name, data, callback){

  if(timer[name]){
    clearTimeout(timer[name]);
    delete timer[name];
  }

  batch[name] = batch[name] || [];
  batch[name].push(data);

  if( batch[name].length > 3 ){
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
};
