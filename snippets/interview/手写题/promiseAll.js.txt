
  Promise.prototype.all = function(promises) {
    const results = [];
    const len = promises.length;
    return new Promise((resolve, reject)=>{
      for (let i= 0; i< len; i++) {
        promises[i].then(res=>{
          results.push(promises[i])
          if (i === len-1) {
            return resolve(results)
          }
        }, err =>{
          return reject(err);
        })
      }
    })
  }

  Promise.prototype.race = function (promiseArr) {
    return new Promise(function (resolve, reject) {
        for (let promise of promiseArr) {
            if (typeof promise === 'object' && typeof promise.then === 'function') {
                // 数组传进来的项是一个Promise实例，执行then方法。
                // resolve只有一个，那个实例对象最先执行完就会使用这个resolve
                promise.then(resolve, reject);
            } else {
                // 不是Promise实例对象直接返回当前值
                resolve(promise);
            }
        }
    })
}


Promise.prototype.race = function (promiseArr){
  return new Promise((resolve, reject) => {
    for(let promise of promiseArr ) {
      promise.then(resolve, reject)
    }
  })
}