---
title: memo 和 useMemo
---

memo 是一个高阶组件，接受一个组件也返回一个组件。原理：将props 做一次浅copy 对比如果未发生变化，则不再渲染执行子组件
React.memo() 是一个高阶组件，我们可以使用它来包装我们不想重新渲染的组件，除非其中的 props 发生变化
useMemo() 是一个 React Hook，我们可以使用它在组件中包装函数。 我们可以使用它来确保该函数中的值仅在其依赖项之一发生变化时才重新计算官方文档写的是这个可以优化用以优化每次渲染的耗时工作。


什么是 React.memo ？
React.memo 和 React.PureComponent 类似， React.PureComponent 在类组件中使用，而React.memo 在函数组件中使用

在 React 应用中，当某个组件的状态发生变化时，它会以该组件为根，重新渲染整个组件子树。

如要避免不必要的子组件的重渲染，你需要在所有可能的地方使用 memo


useMemo and useCallback
useMemo 相当于Vue中computed里的计算属性，当某个依赖项改变时才重新计算值，这种优化有助于避免在每次渲染时都进行高开销的计算。



useCallback 作用
使用场景是：有一个父组件，其中包含子组件，子组件接收一个函数作为props；通常而言，如果父组件更新了，子组件也会执行更新；

用useCallback 包裹需要传递的函数，则没有变化时候是结合 react.Memo 的使用就不会引起子组件的更新了

文章：https://blog.csdn.net/wu_xianqiang/article/details/103981087?utm_source=app&app_version=5.3.0


何时使用 useMemo 
https://zhuanlan.zhihu.com/p/147173462
