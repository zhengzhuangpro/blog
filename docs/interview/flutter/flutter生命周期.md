---
title: flutter生命周期
---

# flutter 生命周期

## 简述生命周期

- `initState`：state 创建初始化时调用，表示 state 将和一个 BuildContext 产生关联，需要注意的是此时 BuildContext 还没有完全加载完成，如果需要获取 BuildContext 及监听第一次 build 完成可以在下面回调中获取
  ```dart
   widgetsBinding = WidgetsBinding.instance;
   widgetsBinding.addPostFrameCallback((callback){
     print("addPostFrameCallback be invoke");
   });
  ```
- `didChangeDependencies`：在 initState() 之后调⽤，当 State 对象的依赖关系发⽣变化时，该⽅法被调⽤，初始化时也会调⽤。
- `deactivate`：当 state 暂时在视图树种移除时被调用，页面切换时也会调用。
- `dispose`：state 销毁时调用，在调用此方法之前会先调用 deactivate()。
- `didUpdateWidget`：当 widget 状态发生变化时调用。

## 生命周期阶段

flutter 生命周期大体上可以分为三个阶段：初始化、状态变化、销毁。

- 初始化阶段

  - 对应执行构造方法和 initState 时候

- 状态变化阶段

  - 开新的 widget 或者调用 setState 方法的时候

- 销毁阶段
  - deactivate 和 dispose

## 生命周期阶段执行的函数

- `initState`
  - 调用次数：1 次
  - 插入渲染树时调用，只调用一次，widget 创建执行的第一个方法，这里可以做一些初始化工作，比如初始化 State 的变量。
- `didChangeDependencies`
  - 调用次数：多次
    - 初始化时，在 initState()之后立刻调用
    - 当依赖的 InheritedWidget rebuild,会触发此接口被调用
    - 实测在组件可见状态变化的时候会调用
- `build`
  - 调用次数：多次
    - 初始化之后开始绘制界面
    - setState 触发的时候会
- `didUpdateWidget`
  - 调用次数：多次
  - 组件状态改变时候调用
- `deactivate`
  - 当 State 对象从树中被移除时，会调用此回调，会在 dispose 之前调用。
  - 页面销毁的时候会依次执行：deactivate > dispose
- `dispose`
  - 调用次数：1 次
  - 当 State 对象从树中被永久移除时调用；通常在此回调中释放资源。
- `reassemble`
  - 在热重载(hot reload)时会被调用，此回调在 Release 模式下永远不会被调用

## App 生命周期

通过`WidgetsBindingObserver`的`didChangeAppLifecycleState`来获取。通过该接口可以获取是生命周期在`AppLifecycleState`类中。

- `resumed`
  - 可见并能响应用户的输入，同安卓的 onResume
- `inactive`
  - 处在并不活动状态，无法处理用户响应，同安卓的 onPause
- `paused`
  - 不可见并不能响应用户的输入，但是在后台继续活动中，同安卓的 onStop

## 下面是生命周期：

- 初次打开 widget 时，不执行 AppLifecycleState 的回调；
- 按 home 键或 Power 键， AppLifecycleState inactive---->AppLifecycleState pause
- 从后台到前台：AppLifecycleState inactive--->ApplifecycleState resumed
- back 键退出应用： AppLifecycleState inactive--->AppLifecycleState paused
