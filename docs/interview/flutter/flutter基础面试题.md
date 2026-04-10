---
title: flutter基础面试题
---

# flutter 基础面试题

https://www.jianshu.com/p/de8fbb09dfb4

### Dart 中 var 与 dynamic 的区别

使用 var 来声明变量，dart 会在编译阶段自动推导出类型。而 dynamic 不在编译期间做类型检查而是在运行期间做类型校验。

### const 和 final 的区别

const 的值在编译期确定，final 的值在运⾏时确定。

### Dart 中??与??=的区别

两者都是 dart 中的操作符，??表示如果为空则返回，??=表示如果为空则赋值。例如：

```dart
String a;
String b = a ?? "1";
print(b); //打印结果：1
print(a); //打印结果：null
a ??= "2";
print(a); //打印结果：2
```

### Flutter 中的 GlobalKey 是什么，有什么作用？

Globalkey 可以主动获取以及主动改变子控件的状态。

### Widget、Element、RenderObject 三者之间的关系

Widget 不是真正渲染 UI 的对象，它只是 Element 的一个配置描述，去告知 Element 应该如何去渲染，Widget 和 Element 之间是 ⼀对多的关系。
RenderObject 才是实际渲染的对象，Element 持有 RenderObject 和 Widget。
⼤致总结三者的关系是：配置⽂件 Widget ⽣成了 Element，⽽后创建 RenderObject 关联到 Element 的内部 renderObject 对象上，最后 Flutter 通过 RenderObject 数据来布局和绘制。
