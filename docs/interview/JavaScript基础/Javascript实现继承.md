---
title: Javascript实现继承
---

# Javascript 实现继承

继承（inheritance）是面向对象软件技术当中的一个概念。

如果一个类别 B“继承自”另一个类别 A，就把这个 B 称为“A 的子类”，而把 A 称为“B 的父类别”也可以称“A 是 B 的超类”

#### 继承的优点

> 继承可以使得子类具有父类别的各种属性和方法，而不需要再次编写相同的代码
>
> 在子类别继承父类别的同时，可以重新定义某些属性，并重写某些方法，即覆盖父类别的原有属性和方法，使其获得与父类别不同的功能

#### 实现方式（常见的继承方式）

下面给出 JavaScripy 常见的继承方式：

- 原型链继承
- 构造函数继承（借助 call）
- 组合继承
- 原型式继承
- 寄生式继承
- 寄生组合式继承

下面展开逐一讲解

#### 原型链继承

原型链继承是比较常见的继承方式之一，其中涉及的构造函数、原型和实例，三者之间存在着一定的关系，即每一个构造函数都有一个原型对象，原型对象又包含一个指向构造函数的指针，而实例则包含一个原型对象的指针

举个例子

```js
function Parent() {
  this.name = "parent1";
  this.play = [1, 2, 3];
}

function Child() {
  this.type = "child2";
}

Child.prototype = new Parent();
console.log(new Child()); // {type: 'child2'}
```

上面代码看似没问题，实际存在潜在问题

```js
var s1 = new Child();
var s2 = new Child();
s1.play.push(4);
console.log(s1.play, s2.play); // [1, 2, 3, 4] [1, 2, 3, 4]
```

改变 s1 的 play 属性，会发现 s2 也跟着发生变化了，这是因为两个实例使用的是同一个原型对象，内存空间是共享的

#### 构造函数继承

借助 `call` 调用 `Parent` 函数

```js
function Parent() {
  this.name = "parent1";
}

Parent.prototype.getName = function () {
  return this.name;
};

function Child() {
  Parent.call(this);
  this.type = "child";
}

let child = new Child();
console.log(child); // {name: 'parent1', type: 'child'}
console.log(child.getName()); // 会报错
```

可以看到，父类原型对象中一旦存在父类之前自己定义的方法，那么子类将无法继承这些方法

相比第一种原型链继承方式，父类的引用属性不会被共享，优化了第一种继承方式的弊端，但是只能继承父类的实例属性和方法，不能继承原型属性或者方法

#### 组合继承

原型链继承和构造函数继承各有优缺点，组合继承则将前两种方式继承起来

```js
function Parent() {
  this.name = "parent";
  this.play = [1, 2, 3];
}

Parent.prototype.getName = function () {
  return this.name;
};
function Child() {
  // 第二次调用 Parent()
  Parent.call(this);
  this.type = "child";
}

// 第一次调用 Parent()
Child.prototype = new Parent();

// 手动挂上构造器，指向自己的构造函数
Child.prototype.constructor = Child;

var s3 = new Child();
var s4 = new Child();

s3.play.push(4);

console.log(s3.play, s4.play); // 不互相影响
console.log(s3.getName()); // 正常输出'parent'
console.log(s4.getName()); // 正常输出'parent'
```

#### 原型式继承

借助`Object.create`方法实现普通对象的继承

```js
let parent = {
  name: "parent",
  friends: ["p1", "p2", "p3"],
  getName: function () {
    return this.name;
  },
};

let person = Object.create(parent);
person.name = "tom";
person.friends.push("jerry");

let person2 = Object.create(parent);
person2.friends.push("lucy");

console.log(person.name); // tom
console.log(person.name === person.getName()); // true
console.log(person2.name); // parent
console.log(person.friends); // ["p1", "p2", "p3", "jerry", "lucy"]
console.log(person2.friends); // ["p1", "p2", "p3", "jerry", "lucy"]
```

这种继承方式的缺点也很明显，因为`Object.create`方法实现的是浅拷贝，多个实例的引用类型属性指向相同的内存，存在篡改的可能

#### 寄生式继承

寄生式继承在原型式继承基础上进行优化，利用这个浅拷贝的能力再进行增强，添加一些方法

```js
let parent = {
  name: "parent",
  friends: ["p1", "p2", "p3"],
  getName: function () {
    return this.name;
  },
};

function clone(original) {
  let clone = Object.create(original);
  clone.getFriends = function () {
    return this.friends;
  };
  return clone;
}

let person = clone(parent);

console.log(person.getName()); // parent
console.log(person.getFriends()); // ["p1", "p2", "p3"]
```

其优缺点也很明显，因为`Object.create`方法实现的是浅拷贝，多个实例的引用类型属性指向相同的内存，存在篡改的可能

#### 寄生组合式继承

寄生组合式继承，借助解决普通对象的继承问题的`Object.create`方法，在前面几种继承方式的优缺点基础上进行改造，这也是所有继承方式里面相对最优的继承方式

```js
function clone(parent, child) {
  // 这里改用 Object.create 就可以减少组合继承中多进行一次构造的过程
  child.prototype = Object.create(parent.prototype);
  child.prototype.constructor = child;
}

function Parent6() {
  this.name = "parent6";
  this.play = [1, 2, 3];
}
Parent6.prototype.getName = function () {
  return this.name;
};
function Child6() {
  Parent6.call(this);
  this.friends = "child5";
}

clone(Parent6, Child6);

Child6.prototype.getFriends = function () {
  return this.friends;
};

let person6 = new Child6();
console.log(person6); //{friends: "child5", name: "child5", play: [1,2,3], __proto__: Parent6}
console.log(person6.getName()); // parent6
console.log(person6.getFriends()); // child5
```

可以看到 person6 打印出来的结果，属性都得到了继承，方法也没问题

文章一开头，我们是使用 ES6 中的 extends 关键字直接实现 JavaScript 的继承

```js
class Person {
  constructor(name) {
    this.name = name;
  }
  // 原型方法
  // 即 Person.prototype.getName = function() { }
  // 下面可以简写为 getName() {...}
  getName = function () {
    console.log("Person:", this.name);
  };
}

class Gamer extends Person {
  constructor(name, age) {
    // 子类中存在构造函数，则需要在使用“this”之前首先调用 super()。
    super(name);
    this.age = age;
  }
}

const asuna = new Gamer("Asuna", 20);
asuna.getName(); // 成功访问到父类的方法
```

利用 babel 工具进行转换，我们会发现 extends 实际采用的也是寄生组合继承方式，因此也证明了这种方式是较优的解决继承的方式

#### 总结

<img src='https://static01.imgkr.com/temp/17483b9f09734dd698858c1996eacb36.png' />

通过 Object.create 来划分不同的继承方式，最后的寄生式组合继承方式是通过组合继承改造之后的最优继承方式，而 extends 的语法糖和寄生组合继承的方式基本类似
