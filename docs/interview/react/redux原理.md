---
title: redux原理
---

redux原理：https://juejin.cn/post/6844904036013965325?share_token=75bc1d6d-55bb-44a2-9ed7-aae4522a9ce2

1. 既然是公共状态，那么就直接把公共状态提取出来好了。我们创建一个store.js文件，然后直接在里边存放公共的state，其他组件只要引入这个store就可以存取共用状态了。

2. 公共状态管理器，公共状态既能够被全局访问到，又是私有的不能被直接修改，思考一下，闭包是不是就就正好符合这两条要求，因此我们会把公共状态设计成闭包

3. getState()的实现非常简单，返回当前状态即可：

4. dispatch实现: 根据不同的actionType 更改具体的的state

```js
export const createStore = () => {    
    let currentState = {}       // 公共状态    
    function getState() {}      // getter    
    function dispatch() {}      // setter    
    function subscribe() {}     // 发布订阅    
    return { getState, dispatch, subscribe }
}
```

5. subscribe实现，但store的变化并不会直接引起视图的更新，我们需要监听store的变化，这里我们应用一个设计模式——观察者模式，
观察者对象有一个update方法(收到通知后要执行的方法)，我们想要在被观察者发出通知后，执行该方法；被观察者拥有addObserver和notify方法，addObserver用于将观察者们的update方法加入一个队列，而当notify被执行的时候，就从队列中取出所有观察者的update方法并执行，这样就实现了通知的功能。



1. redux原理

一个组件如果想从store存取公用状态，需要进行四步操作：
1. import引入store
2. getState获取状态
3. dispatch修改状态
4. subscribe订阅更新

react-redux提供Provider和connect两个API
1. Provider将store放进this.context里，省去了import这一步，，Provider是一个组件，接收store并放进全局的context对象

2. connect将getState、dispatch合并进了this.props，并自动订阅更新
connect接收mapStateToProps、mapDispatchToProps两个方法，然后返回一个高阶函数，这个高阶函数接收一个组件，返回一个高阶组件（其实就是给传入的组件增加一些属性和功能）connect根据传入的map，将state和dispatch(action)挂载子组件的props上




#### redux中间件(redux-thunk)

dispatch一个action之后，到达reducer之前，进行一些额外的操作，就需要用到middleware。你可以利用 Redux middleware 来进行日志记录、创建崩溃报告、调用异步接口或者路由等等。

使用redux-thunk实现异步redux
Redux存在一个问题，就是无法实现异步的action,这也就是为什么我们要引入redux-thunk的原因。
异步action和普通的action有什么不同？
普通action返回的是对象，但是异步action返回的是一个函数。

换言之，中间件都是对store.dispatch()的增强

applyMiddleware() 其实applyMiddleware就是Redux的一个原生方法，将所有中间件组成一个数组，依次执行。 中间件多了可以当做参数依次传进去
   
```js
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
 const store = createStore(
  reducers, 
  applyMiddleware(thunk)
);
```
