// [f1, f2, f3]
// 实现： f1(f2(（f3）))
// compose 函数可以接收多个独立的函数作为参数，然后将这些函数进行组合串联，最终返回一个“组合函数”。
// 参数是多个函数，返回值是一个“组合函数”。
// 组合函数内的所有的函数从右至左一个一个执行（主要符合数学从右到左的操作概念）。
// 组合函数内除了第一个执行函数的参数是多元的，其它函数的参数都是接收上一个函数的返回值。


// 利用函数柯里化的思想，通过递归调用返回一个函数实现函数的串联

// 同步
const compose = function(...args) {
const len = args.length;
let count = len -1;
let result;
return function fn (...args) {
    result = args[count].apply(this, args) // 执行函数的结果
    if (count <= 0) { //递归出口
        count = len-1;
        return result;
    } else { // 否则 就进行递归调用
        count--;
        return fn.call(null, result);
    }
}
}


// 异步的

// 原理：Promise 可以指定一个 sequence，来规定一个执行 then 的过程，
// then 函数会等到执行完成后，再执行下一个 then 的处理。
// 启动sequence 可以使用 Promise.resolve() 这个函数。构建 sequence 可以使用 reduce 。
 


  const composePromise = (funs)=> {
      const init = funs.pop();
      return function(...args) {
          funs.reverse.reduce((sequence, curFun)=>{
              sequence.then((res)=>{
                  curFun.call(null, res)
              })
          }, Promise.resolve(init.apply(null, args)))
      }
  }