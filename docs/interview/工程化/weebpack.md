---
title: weebpack
---

DllPlugin
DllPlugin是webpack内置的插件，不需要额外安装，直接配置webpack.dll.config.js文件：

我们先来看看，这一步到底做了什么。执行：webpack --config webpack.dll.config，然后到指定的输出文件夹查看输出：

react.dll文件里是使用数组保存的模块，索引值就作为id；
react.manifest.json文件里，是用来描述对应的dll文件里保存的模块

```js

module.exports = {=
  entry: {
    // 第三方库
    react: ['react', 'react-dom', 'react-redux']
  },
  output: {
    // 输出的动态链接库的文件名称，[name] 代表当前动态链接库的名称，
    filename: '[name].dll.js',
    path: resolve('dist/dll'),
    // library必须和后面dllplugin中的name一致 后面会说明
    library: '[name]_dll_[hash]'
  },
  plugins: [
  // 接入 DllPlugin
    new webpack.DllPlugin({
      // 动态链接库的全局变量名称，需要和 output.library 中保持一致
      // 该字段的值也就是输出的 manifest.json 文件 中 name 字段的值
      name: '[name]_dll_[hash]',
      // 描述动态链接库的 manifest.json 文件输出时的文件名称
      path: path.join(__dirname, 'dist/dll', '[name].manifest.json')
    }),
  ]
}
```
使用DLLPlugin打包需要分离到动态库的模块
DllPlugin是webpack内置的插件，不需要额外安装，直接配置webpack.dll.config.js文件：

什么是DLL
它们被分割成一些相对独立的动态链接库，即DLL文件，放置于系统中。当我们执行某一个程序时，相应的DLL文件就会被调用。


为什么要使用Dll
通常来说，我们的代码都可以至少简单区分成业务代码和第三方库。如果不做处理，每次构建时都需要把所有的代码重新构建一次，耗费大量的时间。然后大部分情况下，很多第三方库的代码并不会发生变更（除非是版本升级），这时就可以用到dll：把复用性较高的第三方模块打包到动态链接库中，在不升级这些库的情况下，动态库不需要重新打包，每次构建只重新打包业务代码



loader 和 plugin 的区别
1.loader 转换
例如 Css-loader的作用主要是解析css文件中的@import和url语句，处理css-modules，并将结果作为一个js模块返回。
Less是CSS预处理语言，扩展了CSS语言，增加了变量、Mixin、函数等特性，Less-loader的作用就是将less代码转译为浏览器可以识别的CSS代码。

2  plugin 是打包功能的扩展