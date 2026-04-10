---
title: webpack5升级
---

# webpack4 升级为 webpack5

webpack5带来了几个非常管用的新特性，包括

- 开箱即用的**持久化缓存**
- 优雅的**资源处理模块**
- **打包体积优化**

## 升级的变化

### 1.1 命令行env的传参格式变化

- 错误示范

![1C3AD946FD48909CC2EC9A8FA956A318](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a6653225a9ed4340825e955f227c15ec~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)    

- 正确操作

Webpack5不再需要使用`--env.key=value`的语法，现在使用`--env key=value`

### 2.2 webpack-dev-server命令调用方式变化

- `webpack-dev-server config.js`->`webpack server config.js`

出于兼容考虑，我们需把`webpack-dev-server`升级到最新版本

```bash
$ npm install -D webpack-dev-server@latest
```

### 1.3 资源加载配置方式的变化

webpack5之前，通过`url-loader`与`file-loader`等loader来决定一些静态资源的加载。

而现在我们只需要指定type：

- `asset/resource`会将对应的资源加载成**url**，对应以前的`file-loader`
- `asset/inline`导出一个资源的**data URL**，对应以前的`url-loader`
- `asset/source`，对应以前的 `raw-loader`
- `asset`，可以在这里通过限制limit 来决定使用**inline**还是**resource**

```json
rules: [
	{
		test: /\.(png|gif|jpe?g|svg|bmp)$/i,
    type: 'asset/resource',
    exclude: resolve('src/assets/icons'),
    generator: {
      filename: 'img/[hash:7].[ext][query]',
    },
  },
  {
    test: /\.(woff|woff2|eot|ttf|otf)$/i,
    type: 'asset/resource',
    generator: {
      filename: 'fonts/[hash:7].[ext][query]',
    },
  },
]
```

### 1.4 核心包依赖版本升级

```json
"webpack": "^5.74.0",
"webpack-cli": "^4.10.0",
"webpack-dev-server": "^4.9.3",
```

webpack升级到5.x的情况下，至少需要把这些webpack相关的依赖包更新到最新版本（我这里都是通过@latest更新）

```bash
npm install webpack@latest webpack-cli@latest webpack-dev-server@latest
```

### 1.5 需要手动注入Node polyfill

依据官方的说法，webpack5之后**不再默认为工程注入NodeJS polyfill**，即如果你在webpack4版本的代码中使用了类似`process`这样的Node变量，需要**手动安装依赖与配置fallback**。

当然这是一个好事情，因为不需要注入所有垫片，可以减少构建体积

![48C0DB306922DBD18A546DAD5C9A5920](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ddba1c5a8b354216aacf5c2c808a3e24~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

#### #1 依赖对应

检查下表，这是webpack官方给出webpack4使用的polyfill包

![image-20220808183929602](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/986dff24ea0941c4a99fb0aeb9c1436a~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

#### #2 通过fallback注入垫片

![image-20220808184053872](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26f68accac5c46f6a721b48370eef52a~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

#### #3 代码的改变

像`process`的使用在webpack4是无需导入的，但是在webpack5这里我们最好手动导入

![image-20220808235253704](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/40e6c511bc2d4becafb7e91acb256c73~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

### 1.6 替换或者升级不兼容webpack5的插件

举个例子，QAPM项目中使用到了`webpack-cos-plugin`插件进行生产环境下编包自动上传，然而遗憾的是`webpack-cos-plugin`最新版也只支持到webpack4，在这种情况下我们只能替换插件。

幸运的是社区有同学开发了`webpack5-cos-plugin`，完全兼容`webpack-cos-plugin`

另外:

- `HardSourceWebpackPlugin`增加编译缓存 webpack5暂不支持