---
title: egg中间件
---

##### 在框架和插件中使用中间件
框架和插件不支持在 config.default.js 中匹配 middleware，需要通过以下方式：

```js
// app.js
module.exports = app => {
  // 在中间件最前面统计请求时间
  app.config.coreMiddleware.unshift('report');
};

// app/middleware/report.js
module.exports = () => {
  return async function (ctx, next) {
    const startTime = Date.now();
    await next();
    // 上报请求时间
    reportTime(Date.now() - startTime);
  }
};
```



**应用层定义的中间件（app.config.appMiddleware）和框架默认中间件（app.config.coreMiddleware）都会被加载器加载，并挂载到 app.middleware 上。**

##### router 中使用中间件
以上两种方式配置的中间件是全局的，会处理每一次请求。 如果你只想针对单个路由生效，可以直接在 app/router.js 中实例化和挂载，如下：

```js
module.exports = app => {
  const gzip = app.middleware.gzip({ threshold: 1024 });
  app.router.get('/needgzip', gzip, app.controller.handler);
};
```



##### 框架默认中间件
除了应用层加载中间件之外，框架自身和其他的插件也会加载许多中间件。所有的这些自带中间件的配置项都通过在配置中修改中间件同名配置项进行修改，例如框架自带的中间件中有一个 bodyParser 中间件（框架的加载器会将文件名中的各种分隔符都修改成驼峰形式的变量名），我们想要修改 bodyParser 的配置，只需要在 config/config.default.js 中编写

```js
module.exports = {
  bodyParser: {
    jsonLimit: '10mb',
  },
};
```

