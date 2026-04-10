---
title: 生成接口文档egg-swagger-doc
---

#### egg-swagger-doc

##### 输入安装
```bash
$ npm i egg-swagger-doc --save // 自动生成接口描述配置
```

##### 配置

```js
// config/config.default.js
config.swaggerdoc = {
    dirScanner: './app/controller', // 配置自动扫描的控制器路径
    // 接口文档的标题，描述或其它
    apiInfo: {
        title: 'egg测试小接口',  // 接口文档的标题
        description: '测试小接口文档 swagger-ui for egg',   // 接口文档描述
        version: '1.0.0',   // 接口文档版本
    },
    schemes: ['http', 'https'], // 配置支持的协议
    consumes: ['application/json'], // 指定处理请求的提交内容类型（Content-Type），例如application/json, text/html
    produces: ['application/json'], // 指定返回的内容类型，仅当request请求头中的(Accept)类型中包含该指定类型才返回
    securityDefinitions: {  // 配置接口安全授权方式
        // apikey: {
        //   type: 'apiKey',
        //   name: 'clientkey',
        //   in: 'header',
        // },
        // oauth2: {
        //   type: 'oauth2',
        //   tokenUrl: 'http://petstore.swagger.io/oauth/dialog',
        //   flow: 'password',
        //   scopes: {
        //     'write:access_token': 'write access_token',
        //     'read:access_token': 'read access_token',
        //   },
        // },
    },
    enableSecurity: false,  // 是否启用授权，默认 false（不启用）
    // enableValidate: true,    // 是否启用参数校验，默认 true（启用）
    routerMap: true,    // 是否启用自动生成路由，默认 true (启用)
    enable: true,   // 默认 true (启用)
};
```

##### 配置 egg-swagger-doc 插件信息
```js
// config/plugin.js
swaggerdoc: {
    enable: true,   // 启用 swagger-ui 默认启用
    package: 'egg-swagger-doc', // 指定 第三方插件 包名称
},
```





