---
title: var
---

```js
function test1(){
    let total = 0,res = []
    var i = 0 // 这里改成let呢？结果一样吗？
    for(;i < 3;i ++){
        res[i] = function(){
            total += i
            console.log(total)
        }
    }
   console.log(res[0]())  // 3
   console.log(res[1]()) // 6
   console.log(res[2]()) // 9
    // 怎样改才能输出0/1/3？
}
```

如何打印出 0，1，3  

答案：变成闭包


```js
function test1(){
    let total = 0,res = []
    let i = 0 // 这里改成let呢？结果一样吗？
    for(;i < 3;i ++){
        res[i] = function(){
            total += i
            console.log(total)
        }(i)
    }
   console.log(res[0]())  // 3
   console.log(res[1]()) // 6
   console.log(res[2]()) // 9
    // 怎样改才能输出0/1/3？
}
```


```js
var a = 1;
function Fn1() {
    var a = 2;
    alert(this.a + a); // 这儿会执行几次，分别是多少
}
function Fn2() {
    var a = 10;
    Fn1(); // 3
}
Fn2();
var Fn3 = function() {
    this.a = 3;
}
Fn3.prototype = {
    a: 4
}
var fn3 = new Fn3();
Fn1.call(fn3); // 5
```
