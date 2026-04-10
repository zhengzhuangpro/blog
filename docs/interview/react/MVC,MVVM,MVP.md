---
title: MVC,MVVM,MVP
---

https://www.ruanyifeng.com/blog/2015/02/mvcmvp_mvvm.html

mvc： 用户操作 => view 负责收集集体用户输入 => controller 逻辑处理 => model 数据持久化 =》 view 视图渲染


mvvm: 数据驱动
vm： 主要利用obj.proxy 对数据做劫持，结合发布和订阅这种模式来实现数据视图的双向绑定



实现Observer
写个简单的observer，监听对象的每一个属性的变化，监听到变化之后，需要实现一个消息订阅器，很简单，维护一个数组，用来收集订阅者，数据变动触发notify，再调用订阅者的update方法，代码改善之后是这样：

.实现Compile
compile主要做的事情是解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图，如图所示：

6.实现Watcher
Watcher订阅者作为Observer和Compile之间通信的桥梁，主要做的事情是:

1、在自身实例化时往属性订阅器(dep)里面添加自己

2、自身必须有一个update()方法

3、待属性变动dep.notice()通知时，能调用自身的update()方法，并触发Compile中绑定的回调，则功成身退。


实例化Watcher的时候，调用get()方法，通过Dep.target = watcherInstance标记订阅者是当前watcher实例，强行触发属性定义的getter方法，getter方法执行的时候，就会在属性的订阅器dep添加当前watcher实例，从而在属性值有变化的时候，watcherInstance就能收到更新通知。
