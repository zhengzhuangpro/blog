---
title: hooks生命周期
---

useState 只在初始化时执行一次，后面不再执行；

useEffect 相当于是 componentDidMount，componentDidUpdate 和 componentWillUnmount 这三个函数的组合，可以通过传参及其他逻辑，分别模拟这三个生命周期函数

useEffect 第二个参数是一个数组，
如果数组为空时，则只执行一次（相当于componentDidMount）；
如果数组中有值时，componentDidMount + 值更新时，useEffect 中的函数才会执行
如果没有第二个参数，则每次render时，useEffect 中的函数都会执行；


effect 的清除阶段（返回函数）在每次重新渲染时都会执行，而不是只在卸载组件的时候执行一次。它会在调用一个新的 effect 之前对前一个 effect 进行清理，从而避免了我们手动去处理一些逻辑 。为了说明这一点，下面按时间列出一个可能会产生的订阅和取消订阅操作调用序列

effect 会在每个render 中执行，而不仅仅是一次。这是为什么React还可以在下次执行effect 之前清除前一个render 的effect 的原因


每次render 后都会执行 useEffect 吗？是的！预设情况下，它在第一个render和随后每一个更新之后执行。你可能会发现把effect 想成发生在「render 之后」更为容易，而不是考虑「mount」和「更新」。React 保证DOM 在执行effect 时已被更新。


执行顺讯：先render   => 执行useEffetct => 先清除前一个render的 effect，然后在执行新的effect
