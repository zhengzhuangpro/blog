---
title: egg-cluster
---

#### 承接上文
在 **egg-bin** 模块解析一文结尾处，我们探索到 `npm run dev` 最终会 fork 一个子进程，执行 **start-cluster** 文件:
```js
require(options.framework).startCluster(options);
```
调试 `options` 参数内容如下：
```js
{
  tscompiler: 'ts-node/register',
  workers: 1,
  baseDir: '/Users/my/study/eggStudy/egg-bin',
  port: 7001,
  framework: '/Users/my/eggStudy/egg-bin/node_modules/egg'
}
```
**暂时先进入 egg 模块**

`require` 加载的是 `/Users/my/eggStudy/egg-bin/node_modules/egg` 模块输出的 startCluster 对象，egg 模块的 `index.js` 代码:
```js
'use strict';

exports.startCluster = require('egg-cluster').startCluster;
...
```
代码中看出 egg 模块输出了多个模块对象，也能猜想到这些对象将在后面为 egg 框架充当不同的角色，这一章不探究 egg 模块本身，而是进一步探索 **egg-cluster** 模块。
****
进入**egg-cluster** 模块

#### 带着问题研究源码

* egg-cluster 担任的角色
* egg 的多进程
* master agent workers 进程之间的关系

#### egg-cluster 源码解析
**目录结构如下**：
```js
index.js
package.json
lib
├── agent_worker.js
├── app_worker.js
├── master.js
└── utils
│   ├── manager.js
│   ├── messenger.js
│   ├── options.js
│   └── terminate.js
```
#### master 进程
##### index.js
首先我们还是分析 `index.js` 入口文件
```js
'use strict';

const Master = require('./lib/master');

exports.startCluster = function(options, callback) {
  new Master(options).ready(callback);
};

```
实例化 **Mater** 类并传入 `options` 参数，该参数是从 egg-bin 传递过来的。

##### ./lib/master.js 

**master** 类继承自 **Events** 对象， **master** 类内容较多，先将主要的方法简化一下，从全局大概了解之间的关系。
```js
class Master extends EventEmitter {
    constructor() {
        ...
    }
    detectPorts() {
        ... // 探测可用端口
    }
    startMasterSocketServer() {
    }
    stickyWorker() {
    }
    forkAgentWorker() {
        ... // 开启 agent 进程
    }
    forkAppWorkers() {
        ... // 开启 app 进程
    }
    killAgentWorker() {
        ... // 关闭 agent 进程
    }
    killAppWorkers() {} // 关闭 app 进程
    onAgentExit() {
        ... // agent 进程退出 handler
    }
    onAgentStart() {
        ... // agent 进程启动 handler
    }
    onAppExit() {
        ... // app 进程退出 handler
    }
    onAppStart() {
        ... // app 进程启动 handler
    }
    onExit() {
    ... //
    }
    onReload() {}
    close() {}
    _doClose() ()
}
```
#### **agent 进程**

在 `constructor` 中关键代码: 
```js

constructor () {
    ...
    this.detectPorts() // 探测端口
      .then(() => {
        this.forkAgentWorker(); // 调用启动进程方法
      });
}
detectPorts() {
    return GetFreePort()
      .then(port => {
        this.options.clusterPort = port;
        ...
}
forkAgentWorker() {
    ...
    const agentWorker = childprocess.fork(this.getAgentWorkerFile(), args, opt); //启动 agent 进程
    ...
}
  
getAgentWorkerFile() {
    return path.join(__dirname, 'agent_worker.js'); 
}

```
*`detectPorts`* 方法探测当前机器可用端口，然后调用 *`forkAgentWorker`* 方法，使用 *`childprocess.fork`* 开启一个新的进程，在新的进程执行了 `agent_worker.js`

##### **/lib/agent_worker.js**

agent_worker.js 关键代码：
```js
...
const Agent = require(options.framework).Agent;
debug('new Agent with options %j', options);
let agent;
try {
  agent = new Agent(options); // 
} catch (err) {
  ...
}
agent.ready(err => { // 注册 Agent 启动的成功后的回调函数
  if (err) return;
  agent.removeListener('error', startErrorHandler);
  process.send({ action: 'agent-start', to: 'master' }); // 通知 master 进程,agent 已经开启
})
agent.once('error', startErrorHandler);

gracefulExit({ // 退出进程
  logger: consoleLogger,
  label: 'agent_worker',
  beforeExit: () => agent.close(),
});
```
agent_worker.js 代码不多，大概说明一下。实例化的 **Agent** 类来自 **egg** 模块 **Agent**。实例化的具体内容暂时略过，成功后触发回调 `ready` 方法,通知`master` 进程，应用准备好了。 *`agent.ready`* 方法是从 **egg-core** 继承来的。追溯如下：

1. **agent** 类所在位置 **/egg/index.js**:

```js
exports.Agent = require('./lib/agent');
```

2. **/egg/lib/agent.js**:
**Agent 继承自 EggApplication**
```js
const EggApplication = require('./egg');
class Agent extends EggApplication {
    ...
}
```
3. **/egg/lib/egg.js**:
**EggApplication 继承自 EggCore**
```js
const EggCore = require('egg-core').EggCore;
class EggApplication extends EggCore {
    ...
}
```
4. **/egg-core/index.js**:
**进入 egg-core 模块**
```js
const EggCore = require('./lib/egg');
module.exports = {
  EggCore,
  EggLoader,
  BaseContextClass,
  utils,
};
```
5. **/egg-core/lib/egg.js**
```js
const KoaApplication = require('koa');
class EggCore extends KoaApplication {
    ...
    ready(flagOrFunction) { // 这里
        return this.lifecycle.ready(flagOrFunction);
    }
}
```
其实查找 ready 方法还有两个目的：

* 可追溯 **agent** 的原型链，及原型链的引用过程，方便后面源码查看；
* 在查询到 **EggCore** 类的时候，会发现 **EggCore** 类继承自 **KoaApplication**，`require('koa')`,这便解释了为什么 **Egg** 框架是基于 **Koa** 的开发。


扯的有点远了，回到 egg_cluster 模块，当 **agent** 进程启动成功后，发出 `agent-start` 消息：
```js
process.send({ action: 'agent-start', to: 'master'});
```

 **agent** 进程收到消息后：
 ```js
agentWorker.on('message', msg => {
  if (typeof msg === 'string') {
    msg = {
      action: msg,
      data: msg,
    };
  }
  msg.from = 'agent';
  this.messenger.send(msg);
});
```
`this.messenger` 对象是 **/lib/utils/messenger.js**，主要负责 master、 agent、app进程之间的消息中转。

##### **/lib/utils/messenger.js**
**agent** 通过 **messenger** 消息中心通知 **master**
```js
class Messenger{
    ...
    send(data) {
        if (data.to === 'master') {
          // app/agent to master
          this.sendToMaster(data);
          return;
        }
    }
    ...
    sendToMaster(data) {
        this.master.emit(data.action, data.data); //发出 agent-start 信号，通知 master
    }
}
```
这时 master 进程得知 agent-start 信号后，注意 master 中监听事件，看代码：

**/lib/master.js**
```js
class Master extends EventEmitter {
    constructor() {
    ...
        this.on('agent-start', this.onAgentStart.bind(this));
        this.on('app-exit', this.onAppExit.bind(this));
        this.on('app-start', this.onAppStart.bind(this));
        this.on('reload-worker', this.onReload.bind(this));
        // fork app workers after agent started
        this.once('agent-start', this.forkAppWorkers.bind(this));
    }
    ...
}
```
此时 master 进程会有两处监听到 `agent-start` 信号，开启 app 进程是 `this.once` 监听触发的，执行一次后该监听事件便注销了。 
关于 **on** 和 **once**，详看 Node 的 [events](http://nodejs.cn/api/events.html#emitteronceeventname-listener) 对象。
**agent** 进程已经完成，下面进入 **app** 进程
#### 启动 app 进程
`this.forkAppWorkers.bind(this)` 
```js
forkAppWorkers() {
    ...
    cfork({
      exec: this.getAppWorkerFile(), //  执行文件路径
      args, // exec 参数
      silent: false, // 是否将输出发送到父进程，默认 `false`
      count: this.options.workers, // 开启进程数量, 默认为`os.cpus().length`
      // don't refork in local env
      refork: this.isProduction, // 当进程断开连接或意外退出时是否重启，默认为true
      windowsHide: process.platform === 'win32', //隐藏在 Windows 系统上创建的进程控制台窗口，默认false
    });
    ...
    cluster.on('fork', worker => { // 开启新进程会触发 fork 事件
        ...
    });
    cluster.on('disconnect', worker => { // 监听子进程 disconnect 事件
        ...
    });
    cluster.on('exit', (worker, code, signal) => { // 监听子进程 exit 事件
        ...
    });
    cluster.on('listening', (worker, address) => { // 监听子进程 listening 事件
        ...
    });
}
getAppWorkerFile() {
    return path.join(__dirname, 'app_worker.js');
}
```
**app** 进程启动使用的是 [**`cfork`**](https://www.npmjs.com/package/cfork) **npm** 包,这个包提供批量开启进程、进程重启的功能。
**`cfork`** 参数说明：

* **exec**:  执行文件路径
* **args**:  exec 参数
* **count**: 开启进程数量, 默认为`os.cpus().length`
* **silent**: 是否将输出发送到父进程，默认 `false`
* **refork**: 当进程断开连接或意外退出时是否重启，默认为true
* **windowsHide**： 隐藏在 Windows 系统上创建的进程控制台窗口，默认false

##### **/lib/app_worker.js**

```js
    ...
app.ready(startServer);
function startServer(err) {
    ...
    let server;  
    server = require('http').createServer(app.callback()); 
    ...
        server.listen(...args); 
        ...
    }
}
```
**app** 进程使用 **http** 模块创建服务并监听端口。**`server.listen`** 事件会触发 `cluster.on('listening')` 方法（ [cluster官方文档](http://nodejs.cn/api/cluster.html#event-fork)）。

此时 **app** 进程会向 **master** 进程发送消息 `app-start`，看 **master.js**:
```js
this.on('app-start', this.onAppStart.bind(this));
...
this.messenger.send({
    action: 'app-start',
    data: {
        workerPid: worker.process.pid,
        address,
    },
    to: 'master',
    from: 'app',
});
...
onAppStart() {
   this.ready(true);
}
```
**master** 接收 `app-start` 信号后，执行 `onAppStart` 方法，判断当前子进是否全部启动成功（`isAllAppWorkerStarted`），如果全部启动成功，然后通知其他进程：
```js
this.ready(() => {
            this.isStarted = true;
            const action = 'egg-ready';
            this.messenger.send({
                action,
                to: 'parent',
                data: {
                    port: this[REAL_PORT],
                    address: this[APP_ADDRESS],
                    protocol: this[PROTOCOL],
                },
            });
            this.messenger.send({
                action,
                to: 'app',
                data: this.options,
            });
            this.messenger.send({
                action,
                to: 'agent',
                data: this.options,
            });
        });
```
整个 **`npm run dev`** 的过程就结束了。这个流程熟悉后，后面 **`start`** 的进程开启流程也就熟悉了，在 **dev** 环节，如果没有传入指定参数， **app** 进程的数量默认是 1，**start** 环境下默认是 `os.cpus().length`

#### 总结一下
##### egg-cluster 实现egg 的多进程
**egg-cluster** 在 **egg** 框架中负责开发环境、生产环境下的进程启动和通信；
在开发环境下的进程结构：
```js
                +--------+          +-------+
                | Master |<-------->| Agent |
                +--------+          +-------+
                    ^    
                    |     
                    |       
                    |         
                    v          
               +----------+   
               |    App   | 
               +----------+
```
生产环境下的结构：
```js
                +--------+          +-------+
                | Master |<-------->| Agent |
                +--------+          +-------+
                ^   ^    ^
               /    |     \
             /      |       \
           /        |         \
         v          v          v
+----------+   +----------+   +----------+
| Worker 1 |   | Worker 2 |   | Worker 3 |
+----------+   +----------+   +----------+
```
进程启动顺序：
```js
+---------+           +---------+          +---------+
|  Master |           |  Agent  |          |  Worker |
+---------+           +----+----+          +----+----+
     |      fork agent     |                    |
     +-------------------->|                    |
     |      agent ready    |                    |
     |<--------------------+                    |
     |                     |     fork worker    |
     +----------------------------------------->|
     |     worker ready    |                    |
     |<-----------------------------------------+
     |      Egg ready      |                    |
     +-------------------->|                    |
     |      Egg ready      |                    |
     +----------------------------------------->|
```

1. Master 启动后先 fork Agent 进程
2. Agent 初始化成功后，通过 IPC 通道通知 Master
3. Master 再 fork 多个 App Worker
4. App Worker 初始化成功，通知 Master
5. 所有的进程初始化成功后，Master 通知 Agent 和 Worker 应用启动成功

##### 进程通讯的方式

* **关于消息中心**： **Messenger** 会统一收集来自 **master** 、 **agent**、 **app** 发出的消息。根据 `from` 标识区分来源，根据 `to` 分发给目标，使用 `action` 标记发送行为。

* **关于消息发送**：**master** 使用 `sendmessage(worker, data)`  **app** 和 **agent** 使用 `process.send(data);` 

* **关于消息接收**：**master** 使用 `worker.on` 和 `cluster.on` （因为app进程是以集群的模式启动的）**app** 和 **agent** 使用 `process.on('message');`。



##### egg 继承的原型链
```js     
EggApplication ------> EggCore ------> KoaApplication     
```





