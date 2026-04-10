---
title: webpack优化实战md
---

# webpack优化实战

## 1 构建时间优化

构建时间越短，整体开发体验越好。

我们在开发环境引入了`speed-measure-webpack-plugin`用来测速

![image-20220808203019425](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/84b7ff53da754707a1c77e3b5f9d458e~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

![image-20220808203048366](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1687ee1fdf8b41d7a5fcd30b32408399~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

### 1.1 持久化缓存

![image-20220808193733459](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a0fc02c279941589aa0a8ad3760974c~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

开启持久化缓存可以大幅降低我们项目**二次构建**的时间，非常建议开启，建议使用`filesystem`，使用`memory`对于中大型项目会吃不消

### 1.2 sourcemap优化

使用webpack打包文件的时候，可以选择生成`sourcemap`文件。

按照社区推荐

- 建议在开发环境使用`eval-cheap-module-source-map`，内联sourcemap，减少构建时间。

![image-20220808200411886](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/284c6f59c72a43ed91fcb7dc7fb450ef~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

- 建议在生产环境使用`source-map`，生成专门的`.map.js`文件，一般来讲根据具体需求删除或者移动sourcemap文件，增加代码被反编译的难度

![image-20220808200356228](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a14c06359b6d473aa063c51a60c0bcc3~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

### 1.3 watch优化

大部分项目中，`node_modules`的变换频率都是极低的，所以我们在使用watch功能的时候可以通过配置

`ignored`来忽略`node_modules`从而减少性能压力

![image-20220808200918320](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df70b82edf164505ad8a147fee58620b~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

### 1.4 在开发环境中使用style-loader

之前的QAPM项目中，不管是开发环境还是生产环境一开始都是通过`MiniCssExtractPlugin`生成css文件并引入页面的方式来使用css

![image-20220808201238517](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97985b2e7bae4a649e4888d03303d4eb~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

然而这是不对的，一方面`MiniCssExtractPlugin`并对于热更新HMR支持的不是很好

（这里还有一个问题，开发环境配置`hash`会使得构建性能进一步下降）

我这里的解决方案是在开发环境中使用`style-loader`，这个loader作为webpack的入门级loader天然支持HMR并且简单易用，同时性能上也相对比较好。

![image-20220808201013487](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98bbab99f9e646649e20f22d04868c42~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

### 1.5 TerserPlugin插件缓存

这个其实没啥好说的，记得把缓存打开，同时最好设定一定的`exclude`，比如去除node_modules

![image-20220808202416271](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87a7e43fec8f48ebb05c2218a3a73c55~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

### 1.6 noParse优化

React已经为我们打包了生产环境需要使用的文件，这样可以跳过编译环节

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e86d2275c9bd4c80a1e97f774115a647~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

### 1.7 Js加载优化

这里的优化点总结如下

- 使用thread-loader加快构建速度
- 为babel-loader开启缓存
- 通过`exclude`排除`node_module`
- 使用`react-refresh/babel`为React项目添加热更新能力

![image-20220808202746789](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b6a8ea391ce348aa82129aaa77142fd7~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

## 2 打包体积优化

我们在生产环境构建的config文件中使用`webpack-bundle-analyzer`来分析打包体积

![image-20220808203125162](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd799852889f4694b89542de1787ac02~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

![image-20220808203437098](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d0f80ea4f91b4de8b4e4a5bd9738e050~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

### 2.1 lodash优化

由于lodash是一个UMD规范的包，所以默认做的全量引入

![image-20220808204433162](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/80ae4e54b4cf43bcbbc0cd32e412ba43~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

![image-20220808203732889](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a90cd8cf997846aabae77a20146f201c~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

我们可以通过`LodashModuleReplacementPlugin`来移除你未用到的lodash特性

### 2.2 moment优化

webpack 打包momentjs时会把所有语言包都打包，这样会使打包文件很大。此插件可以帮助我们只打包需··要的语言包，大大减小打包文件大小。

![image-20220808210003575](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9fa92862582a4a5d91b9f0d28afb1e4c~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

限定查找 moment/locale 上下文里符合 /zh-cn|en-gb/ 表达式的文件，只打包这几种本地化内容

### 2.3 CSS tree-shaking

通过`PurgeCSS`来进行CSS体积优化，CSS的作用原理是通过**正则**，所以建议使用PurgeCSS时一定要**配置好白名单，同时保证选中所有的使用到样式文件类的地方**。否则可能会**丢失样式**

![image-20220808210130811](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9dac4d6d9414480da268a390f77df708~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

### 2.4 splitChunks提取公共代码

SplitChunks插件是webpack中用来提取或分离代码的插件，主要作用是提取公共代码，减少代码被重复打包，拆分过大的js文件，合并零散的js文件

![image-20220808210536590](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6474308b501846c0be005912a71c6762~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

在webpack5中使用，我们可以根据实际情况进行拆包，从而减少构建体积。(一般拆一下node_modules)

对于这里的规则，将只说只说一些重点

- `minChunks`：引用阈值，被引用次数超过该阈值的模块才会被拆包处理；
- `maxInitialRequest/maxAsyncRequests`：用于限制Initial/Async Chunk最大并行请求数，本质上是在限制最终产生的分包数量；
- `minSize`： 超过这个大小的 Chunk 会被拆包；
- `maxSize`： 超过这个大小的 Chunk 会尝试继续拆包；
- `cacheGroups`：缓存组规则，为不同类型的资源设置更有**针对性的拆包策略**。
- `priority`: 优先级，在缓存组规则中使用

### 2.5 gzip压缩

配置`compression-webpack-plugin`插件，生成额外的gzip静态文件

![image-20220808233715022](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/94c2a9150a744f22a6e792411a26b3a3~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

这种形式对于我们使用`nginx`的项目只需要简单开启gzip_static和gzip_proxied

![image-20220808233830357](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb44a6b4f91b4606aa337e20ecdfb916~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

如果使用CDN的话就要看服务商有没有提供相关功能