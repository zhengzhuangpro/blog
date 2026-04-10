---
title: new操作符
---

# new 操作符

在 new 关键字创建对象时，会进行如下操作:

1. 创建一个空对象 {}，就是在栈内新建一个 obj，实际上就是对应堆内的一个地址。
2. 将新建 obj 的隐式原型*proto*指向构造函数的原型 prototype 对象。
3. 改变构造函数的 this 指向，指向新对象 obj，并利用 call() apply()执行构造函数。
4. 返回结果，如果函数返回的是基本数据类型，则实际生成对象，返回 this，如果返回的是引用数据类型，则返回该引用数据类型值。

```js
function myNew(fn, args) {
  let object = {};
  object.__proto__ = fn.prototype;
  let res = fn.apply(object, args);
  return res instanceof Object ? res : object;
}
```
