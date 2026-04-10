---
title: Suspense
---


https://react.docschina.org/docs/concurrent-mode-suspense.html
何为 Suspense？
Suspense 让组件“等待”某个异步操作，直到该异步操作结束即可渲染。在下面例子中，两个组件都会等待异步 API 的返回值：

说了那么多，Suspense 到底有什么用呢？对于这个问题，我们可以从不同的角度来回答：

它能让数据获取库与 React 紧密整合。如果一个数据请求库实现了对 Suspense 的支持，那么，在 React 中使用 Suspense 将会是自然不过的事。
它能让你有针对性地安排加载状态的展示。虽然它不干涉数据怎样获取，但它可以让你对应用的视图加载顺序有更大的控制权。
它能够消除 race conditions。即便是用上 await，异步代码还是很容易出错。相比之下，Suspense 更给人同步读取数据的感觉 —— 假定数据已经加载完毕。
