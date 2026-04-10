---
title: egg-bin
---


在初始化的 egg 项目 `package.json` 中可以看到:
```js
"scripts": {  
    "dev": "egg-bin dev",
    "debug": "egg-bin debug",
    "test-local": "egg-bin test",
    "cov": "egg-bin cov"
  }
```
在 **egg** 项目 `package.json` 中看到 `dev` 、`debug` 、`test-local` 、`cov` 命令都是依赖 **egg-bin** 启动的。
#### egg-bin 源码解析
**目录结构如下**：
```js
package.json
index.js
bin
├── egg-bin.js
├── ets.js
└── mocha.js
lib
├── cmd
│   ├── autod.js
│   ├── cov.js
│   ├── debug.js
│   ├── dev.js
│   ├── local.js
│   ├── pkgfiles.js
│   └── test.js
├── command.js
└── start-cluster
```
****
**package.json 入口**

在 **egg-bin** 模块的 package.json 中可以看到 bin 入口文件是 `/bin/egg-bin.js`
```js
"bin": {
    "egg-bin": "bin/egg-bin.js",
    "mocha": "bin/mocha.js",
    "ets": "bin/ets.js"
  },
```

**bin/egg-bin.js**
```js
#!/usr/bin/env node

'use strict';

const Command = require('..');
new Command().start();
```
**Command** 对象来自 `index.js`, `index.js` 代码如下：
```js
const Command = require('./lib/command');

class EggBin extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-bin [command] [options]';
    this.load(path.join(__dirname, 'lib/cmd')); // 加载命令行参数对应的 js 文件
  }
}

module.exports = exports = EggBin;
```
在 `inde.js` 中我们看到 **Command** 对象就是 **EggBin** 类，该类又继承自 **Command**，关于命令行实现和处理都在该类上实现的。

接下来进入 `./lib/command.js` ：
```js
'use strict';

const path = require('path');
const fs = require('fs');
const BaseCommand = require('common-bin');

class Command extends BaseCommand {
 ...
}

module.exports = Command;
```
从代码中可以看出 **Command** 类又继承自 **BaseCommand**, 由此发现 `egg-bin` 模块命令的实现使用的是 `common-bin` 公共模块。

这里和大家简单说明一下 common-bin 模块使用([使用实例](https://github.com/zhoujingang/npmTest/tree/master/common-bin))。
前面在 **EggBin** 类 `constructor` 中调用了 this.load 方法
```js
this.load(path.join(__dirname, 'lib/cmd'));
```
该方法加载了 `lib/cmd` 目录下的 js 文件：
* autod.js
* cov.js
* debug.js
* dev.js
* pkgfiles.js
* test.js  

相当于定义了 `autod`、`cov`、`debug`、`dev`、`pkgfiles`、`test`命令，比如当我们执行 `npm run dev` 的时候，就会执行 `dev.js`。
相当于在 egg-bin 模块目录执行了:
```sh
node ./bin/egg-bin.js dev
```
所以 **Egg** 启动 `npm run dev ` 执行的是 `dev.js` 文件。

#### dev.js 源码解析
dev.js 主要包含三个功能
1. 命令行参数设置(根目录、端口、进程数量..)
2. 进程参数格式化(参数传递、端口探测是否可用)
3. 进程启动
```js
class DevCommand extends Command {
  constructor(rawArgv) {
    this.options = { // 命令行参数设置
      ...
    };
  }

  * run(context) {
    ...
    const task = this.helper.forkNode(this.serverBin, devArgs, options);  // 进程启动
    ...
  }
  
  * formatArgs(context) { //进程启动参数格式化
    ...
      const port = yield detect(this.defaultPort);
    ...
  }
}

module.exports = DevCommand;

``` 
进程在启动之前的参数，也就是 `formatArgs` 方法的返回值，调式输出如下：
```js
{
  ...
  tscompiler: 'ts-node/register',
  workers: 1, // 进程数量
  baseDir: '/Users/***/study/eggStudy/egg-bin', // 当前进程根目录
  port: 7001, //端口
  framework: '/Users/***/study/eggStudy/egg-bin/node_modules/egg' //框架目录
} 
```

启动进程是执行 *`this.helper.forkNode`* , 最开始我以为 `this.helper.forkNode` 方法是 **EggBin** 类上面的方法，源码翻一遍也没找到，后来发现该方法是 `common-bin` 模块的方法，用来 fork 一个子进程。*`this.serverBin`* 参数就是执行文件,该参数就是 `lib/start-cluster` 文件。

start-cluster 文件：
```js
require(options.framework).startCluster(options);
```
从 `npm run dev` 开始执行一系列代码后，最终走进了 `start-cluster` 中的代码， **egg-bin** 模块的任务就结束了。

后续将为大家解析重点模块 —— **egg-cluster**