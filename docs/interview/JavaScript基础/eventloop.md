---
title: eventloop
---

事件循环(event-loop)是什么？

同步和异步任务分别进入不同的执行"场所"，同步的进入主线程，异步的进入Event Table并注册函数。
当指定的事情完成时，Event Table会将这个函数移入Event Queue。
主线程内的任务执行完毕为空，会去Event Queue读取对应的函数，进入主线程执行。
上述过程会不断重复，也就是常说的Event Loop(事件循环)。


总方针是先同步再异步，异步中先微任务，在宏任务。
macro-task(宏任务)：setTimeout，setInterval
micro-task(微任务)：Promise.then/catch，process.nextTick

event loop 和 渲染的关系

https://juejin.cn/post/6998154127763046437

流程


1.从任务队列中取出一个宏任务并执行。


2.检查微任务队列，执行并清空微任务队列，如果在微任务的执行中又加入了新的微任务，也会在这一步一起执行。


3.进入更新渲染阶段，判断是否需要渲染，这里有一个 rendering opportunity 的概念，也就是说不一定每一轮 event loop 都会对应一次浏览 器渲染，要根据屏幕刷新率、页面性能、页面是否在后台运行来共同决定，通常来说这个渲染间隔是固定的。（所以多个 task 很可能在一次渲染之间执行）

4.浏览器会尽可能的保持帧率稳定，例如页面性能无法维持 60fps（每 16.66ms 渲染一次）的话，那么浏览器就会选择 30fps 的更新速率，而不是偶尔丢帧。

如果满足以下条件，也会跳过渲染：

浏览器判断更新渲染不会带来视觉上的改变。

map of animation frame callbacks 为空，也就是帧动画回调为空，可以通过 requestAnimationFrame 来请求帧动画。