---
title: vue创建企业级项目
---

##  vue-cli4.x创建企业级项目

#### 安装脚手架（vue-cli）

```js
$ npm install @vue/cli -g //全局安装最新的脚手架
```



#### 创建项目

```js
$ vue create vue-demo
```

在创建项目的时候可以使用

```
  $ vue ui
```

来进行创建，两种方式在创建的时候，直接选择上router和vuex，来进行项目创建

#### 移动端Vant

```
# 通过 npm 安装
$ npm i vant -S

# 通过 yarn 安装
$ yarn add vant
```

我这里都是使用的按需引入，用了
babel-plugin-import 是一款 babel 插件，它会在编译过程中将 import 的写法自动转换为按需引入的方式

### 导入所有组件

```
import Vue from 'vue';
import Vant from 'vant';
import 'vant/lib/index.css';

Vue.use(Vant);
```



#### 安装插件按需引入

```
npm i babel-plugin-import -D
```

```js
// 在.babelrc 中添加配置
// 注意：webpack 1 无需设置 libraryDirectory
{
  "plugins": [
    ["import", {
      "libraryName": "vant",
      "libraryDirectory": "es",
      "style": true
    }]
  ]
}

// 对于使用 babel7 的用户，可以在 babel.config.js 中配置
module.exports = {
  plugins: [
    ['import', {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: true
    }, 'vant']
  ]
};
// 接着你可以在代码中直接引入 Vant 组件
// 插件会自动将代码转化为方式二中的按需引入形式
import { Button } from 'vant';
```

#### Rem 适配

Rem 适配
Vant 中的样式默认使用px作为单位，如果需要使用rem单位，推荐使用以下两个工具

postcss-pxtorem 是一款postcss插件，用于将单位转化为rem
lib-flexible  用于设置rem基准值


###### 步骤

1.安装`px转rem`插件 安装postcss-px2rem-exclude lib-flexible

```
npm install postcss-px2rem-exclude lib-flexible -s
```

2.在main.js中引入lib-flexible

```
import 'lib-flexible';
```

3.在根目录新建postcss.config.js文件，在文件中进行配置

```js
module.exports = {
  plugins: {
      "postcss-px2rem-exclude": {
          remUnit: 75,
          remPrecision: 2,
          exclude: /node_modules|folder_name/i
      }
  }
};

/**
module.exports = {
    plugins: {
        'autoprefixer': {
            browsers: ['Android >= 4.0', 'iOS >= 8']
        },
        'postcss-pxtorem': {
            rootValue: 75.0,
            propList: ['*']
        }
    }
}
module.exports = ({ file }) => {
    let isVant = file && file.dirname && file.dirname.indexOf("vant") > -1;
    let rootValue = isVant ? 37.5 : 75; // 判断条件 请自行调整
    return {
        plugins: {
            autoprefixer: {},
            "postcss-pxtorem": {
                rootValue: rootValue,
                propList: ["*"] 
            }
        }
    }
}
*/
```

#### vue-cli3中使用iconfont

下载iconfont到src/assets文件夹

在main.js中引用iconfont/iconfont.css

```vue
import './assets/Iconfont/iconfont.css'
```

查看本地依赖中是否有sass-loader，如果没有需要安装一下

```js
$ npm install css-loader --save-dev
```

文件中使用

```vue
<i class="iconfont iconsearch"></i>
```

#### 使用sass

```js
npm install sass-loader --save-dev
```



#### 关于router

vue-router默认的路由模式是hash，我们要去掉url中的#需要将路由模式切换为history

```vue
const router = new VueRouter({
  mode: 'history',
  ...
})
```

#### 打包

根文件夹新建vue.config.js

```
module.exports = {
  lintOnSave: false,
  publicPath: './',
  // publicPath: '/',
  productionSourceMap: false
}
```

