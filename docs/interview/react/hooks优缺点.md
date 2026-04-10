---
title: hooks优缺点
---

hooks 的原理：https://juejin.cn/post/6944863057000529933
https://blog.csdn.net/qq_36380426/article/details/116382485


hooks优缺点：https://www.jianshu.com/p/d5e4aa1a568d

hooks 的更新阶段：
1 updateWorkInprogerss
2 updateState
3 updateEffect
4 updateMemo
5 updateRef

hooks 的优势：
1. 它通过自定义hooks来复用状态，从而解决了类组件有些时候难以复用逻辑的问题
2. 虽然状态(from useState)和副作用(useEffect)的存在依赖于组件，但它们可以在组件外部进行定义。这点是class component做不到的，你无法在外部声明state和副作用（如componentDidMount）。
3. 高阶组件和renderProps也同样能做到。但hooks实现起来的代码量更少，以及更直观

4.  向props或状态取值更加方便，函数组件的取值都从当前作用域直接获取变量，而类组件需要先访问实例this，再访问其属性或者方法，多了一步


缺点：
1. 你必须清楚代码中useEffect和useCallback的“依赖项数组”的改变时机。有时候，你的useEffect依赖某个函数的不可变性，这个函数的不可变性又依赖于另一个函数的不可变性，这样便形成了一条依赖链。

2. 例如 debounce ，在hooks 中就必须使用useDebounce，不能使用普通function 的 debounce。因为state改变触发函数重新初始化，所以无法记录之前的状态。

3. this 指向问题，不明确容易混乱

这个问题在class component不会出现，因为class component的属性和方法都存放在一个instance上，调用方式是：this.state.xxx和this.method()。因为每次都是从一个不变的instance上进行取值




hooks 原理：
文将重点围绕四个中重点hooks展开，分别是负责组件更新的useState，负责执行副作用useEffect ,负责保存数据的useRef,负责缓存优化的useMemo， 至于useCallback,useReducer,useLayoutEffect原理和那四个重点hooks比较相近，


stateMounted 阶段 hooks 总结：

我们来总结一下初始化阶段,react-hooks做的事情，在一个函数组件第一次渲染执行上下文过程中，每个react-hooks执行，都会产生一个hook对象，并形成链表结构，绑定在workInProgress的memoizedState属性上，然后react-hooks上的state绑定在当前hooks对象的memoizedState属性上。对于effect副作用钩子，会绑定在workInProgress.updateQueue上，等到commit阶段，dom树构建完成，在执行每个 effect 副作用钩子。



react hooks 的常见问题：
1 在无状态组件每一次函数上下文执行的时候，react用什么方式记录了hooks的状态？
current fiber树: 当完成一次渲染之后，会产生一个current树,current会在commit阶段替换成真实的Dom树。
workInProgress.memoizedState: 在class组件中，memoizedState存放state信息，在function组件中，memoizedState在一次调和渲染过程中，以链表的形式存放hooks信息。


2 为什么不能条件语句中声明hooks? hooks声明为什么在组件的最顶部？
在组件初始化的时候,每一次hooks执行，如useState(),useRef(),都会调用mountWorkInProgressHook,
首先每次执行一个hooks函数，都产生一个hook对象，里面保存了当前hook信息,然后将每个hooks以链表形式串联起来，
函数组件用memoizedState存放hooks链表。react用链表来严格保证hooks的顺序
一旦在条件语句中声明hooks，在下一次函数组件更新，hooks链表结构，将会被破坏，current树的memoizedState缓存hooks信息，和当前workInProgress不一致，如果涉及到读取state等操作，就会发生异常。


3 function函数组件中的useState，和 class类组件 setState有什么区别？

setState和useState是异步执行的（不会立即更新state的结果）
多次执行setState和useState，只会调用一次重新渲染render
不同的是，setState会进行state的合并，而useState则不会

```js
class Component extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      a: 1,
    }
  }

  handleClickWithPromise = () => {
    Promise.resolve().then(() => {
      this.setState({a: this.state.a + 1})
      this.setState({a: this.state.a + 1})
    })
  }

  handleClickWithoutPromise = () => {
    this.setState({a: this.state.a + 1})
    this.setState({a: this.state.a + 1})
  }

  render() {
    console.log('a', this.state.a)
    return (
      <Fragment>
        <button onClick={this.handleClickWithPromise}>异步执行</button>
        <button onClick={this.handleClickWithoutPromise}>同步执行</button>
      </Fragment>
    )
  }
}
// class 的setState
// 当点击同步执行按钮时，两次 setState 合并，只执行了最后一次，打印 2
// 当点击异步执行按钮时，两次 setState 各自 render 一次，分别打印 2，3
```

```js
function Component() {
  const [a, setA] = useState(1)
  console.log('a', a)

  function handleClickWithPromise() {
    Promise.resolve().then(() => {
      setA((a) => a + 1)
      setA((a) => a + 1)
    })
  }

  function handleClickWithoutPromise() {
    setA((a) => a + 1)
    setA((a) => a + 1)
  }

  return (
    <Fragment>
      <button onClick={handleClickWithPromise}>{a} 异步执行</button>
      <button onClick={handleClickWithoutPromise}>{a} 同步执行</button>
    </Fragment>
  )
}
// 当点击同步执行按钮时，两次 setA 都执行，但合并 render 了一次，打印 3
// 当点击异步执行按钮时，两次 setA 各自 render 一次，分别打印 2，3

```
为什么class 的setState 和 hooks useState 不同呢
答案：
用大白话说就是在实际的 useState/setState 前后各加了段逻辑给包了起来。只要是在同一个事务中的 setState 会进行合并（注意，useState不会进行state的合并）处理。
为什么会有同步执行和异步执行结果不同呢？
这里就涉及到 react 的 batchUpdate 机制，合并更新。异步不能进行事务操作，同步可以
首先，为什么需要合并更新呢？
如果没有合并更新，在每次执行 useState 的时候，组件都要重新 render 一次，会造成无效渲染，浪费时间（因为最后一次渲染会覆盖掉前面所有的渲染效果）。
所以 react 会把一些可以一起更新的 useState/setState 放在一起，进行合并更新。


4 react 是怎么捕获到hooks的执行上下文，是在函数组件内部的？
答案：

5 为什么useRef不需要依赖注入，就能访问到最新的改变值？
答案：
就是返回了缓存下来的值，也就是无论函数组件怎么执行，执行多少次，hook.memoizedState内存中都指向了一个对象



6 useMemo是怎么对值做缓存的？如何应用它优化性能？

我们执行useMemo函数，做的事情实际很简单，就是判断两次 deps是否相等，如果不想等，证明依赖项发生改变，那么执行 useMemo的第一个函数，得到新的值，然后重新赋值给hook.memoizedState,如果相等 证明没有依赖项改变，那么直接获取缓存的值。

不过这里有一点，值得注意，nextCreate()执行，如果里面引用了usestate等信息，变量会被引用，无法被垃圾回收机制回收，就是闭包原理，那么访问的属性有可能不是最新的值，所以需要把引用的值，添加到依赖项 dep 数组中。每一次dep改变，重新执行，就不会出现问题了


7 为什么两次传入useState的值相同，函数组件不更新?
答案：更新，设置相同的值，多次改触发，会render多次

batchUpdate机制，合并更新


8 function组件和class组件本质的区别

```js
function Index(){
    const [ num ,setNumber ] = React.useState(0)
    const handerClick=()=>{
        for(let i=0; i<5;i++ ){
           setTimeout(() => {
                setNumber(num+1)
                console.log(num)
           }, 1000)
        }
    }
    return <button onClick={ handerClick } >{ num }</button>
}


```
打印结果：0 0 0 0 0
这个问题实际很蒙人，我们来一起分析一下,第一个类组件中，由于执行上setState没有在react正常的函数执行上下文上执行，而是setTimeout中执行的，批量更新条件被破坏。原理这里我就不讲了,所以可以直接获取到变化后的state。

但是在无状态组件中，似乎没有生效。原因很简单，在class状态中，通过一个实例化的class，去维护组件中的各种状态；但是在function组件中，没有一个状态去保存这些信息，每一次函数上下文执行，所有变量，常量都重新声明，执行完毕，再被垃圾机制回收。所以如上，无论setTimeout执行多少次，都是在当前函数上下文执行,此时num = 0不会变，之后setNumber执行，函数组件重新执行之后，num才变化。

所以， 对于class组件，我们只需要实例化一次，实例中保存了组件的state等状态。对于每一次更新只需要调用render方法就可以。但是在function组件中，每一次更新都是一次新的函数执行,为了保存一些状态,执行一些副作用钩子,react-hooks应运而生，去帮助记录组件的状态，处理一些额外的副作用。


在function组件中，没有一个状态去保存这些信息，每一次函数上下文执行，所有变量，常量都重新声明，执行完毕，再被垃圾机制回收，为了保存一些状态,执行一些副作用钩子,react-hooks应运而生，去帮助记录组件的状态，处理一些额外的副作
createElement。useMemo、useCallback、useEffect等有deps参数的Hook API都依赖Fiber.memoizedState属性（存储结果）
