---
title: useLayoutEffect
---


1. useEffect 是异步执行的，而useLayoutEffect是同步执行的。
2. useEffect 的执行时机是浏览器完成渲染之后异步不会阻塞渲染，而 useLayoutEffect 的执行时机componentDidMount 等价。useLayoutEffect在浏览器执行绘制之前，useLayoutEffect 内部的更新计划将被同步刷新
3. 这是因为 useLayoutEffect 是不会在服务端执行的，所以就有可能导致 ssr 渲染出来的内容和实际的首屏内容并不一致。而解决这个问题也很简单
4. 总结
优先使用 useEffect，因为它是异步执行的，不会阻塞渲染
会影响到渲染的操作尽量放到 useLayoutEffect中去，避免出现闪烁问题
useLayoutEffect和componentDidMount是等价的，会同步调用，阻塞渲染
在服务端渲染的时候使用会有一个 warning，因为它可能导致首屏实际内容和服务端渲染出来的内容不一致。

uselayout 的使用场景
除非要修改DOM并且不让用户看到修改DOM的过程，才考虑使用useLayoutEffect，否则应当使用useEffect。