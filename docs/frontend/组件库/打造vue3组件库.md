---
title: 打造vue3组件库
---

随着前端业务的不断扩大,也造了一些的***轮子***或者面向业务***二次封装的代码***用在各个项目当中,为了提升团队开发效率,稳定开发质量,开拓前端工程化,一个服务于业务的***业务组件库***必不可少~

## 1.技术选型

| 技术       | 简述                                                      |
| ---------- | --------------------------------------------------------- |
| Vue3       | ~                                                         |
| Typescript | ~                                                         |
| Rollup     | 一个轻量简单的打包工具,Vue和react源码就是用这个工具打包的 |

## 2.环境搭建

1. 创建一个文件夹

   ```bash
   mkdir @base/vue-ui
   ```

2. 在***package.json***中直接写入

   ```json
   {
    "name": "@base/vue-ui",
    "version": "1.0.0",
    "description": "",
    "author": "zhengzhuang",
    "types": "dist/index.d.ts",
    "license": "ISC",
    "main": "dist/@base/vue-ui.umd.js",
    "module": "dist/@base/vue-ui.esm.js",
    "scripts": {
      "build": "npm run clean && npm run build:esm && npm run build:umd",
      "dev": "npm run clean && npm run dev:umd",
      "build:esm": "rollup  --config build/rollup.esm.config.js",
      "build:umd": "rollup --config build/rollup.umd.config.js",
      "clean": "rimraf ./dist"
    },
    "devDependencies": {
      "rollup": "^2.38.5",
      "rollup-plugin-vue": "6.0.0-beta.6",
      "rollup-plugin-typescript2": "^0.29.0",
      "@rollup/plugin-node-resolve": "^11.1.1",
      "@types/lodash-es": "^4.17.4",
      "@vue/compiler-sfc": "^3.0.0",
      "postcss-import": "^14.0.0",
      "rimraf": "^3.0.2"
    },
    "dependencies": {
      "rollup-plugin-postcss": "^4.0.0",
      "rollup-plugin-commonjs": "^10.1.0",
      "tailwindcss": "^1.9.0",
      "postcss": "^8.2.8",
      "lodash-es": "^4.17.20",
      "typescript": "~3.9.3",
      "vue": "^3.0.0"
    }
   }
   ```

   之后执行`npm install`

## 3.编写Rollup的配置文件

与***package.json***平级创建一个***build***文件夹,分别创建三个文件

1. ***rollup.config.js***

   ```bash
   import vue from 'rollup-plugin-vue'
   
   import typescript from 'rollup-plugin-typescript2'
   import {nodeResolve} from '@rollup/plugin-node-resolve'
   import postcss from 'rollup-plugin-postcss'
   import {name} from '../package.json'
   import commonjs from 'rollup-plugin-commonjs';
   import postcssImport from 'postcss-import';
   // 处理 apply 以及内置 mixin
   import tailwindcss from 'tailwindcss'
   
   const file = type => `dist/${name}.${type}.js`
   
   const overrides = {
       compilerOptions: {declaration: true},
       exclude: ["tests/**/*.ts", "tests/**/*.tsx"]
   }
   
   export {name, file}
   export default {
       input: 'src/index.ts',
       output: {
           name,
           file: file('esm'),
           format: 'es'
       },
       plugins: [
           nodeResolve(),
   
           typescript({tsconfigOverride: overrides}),
           vue(),
           postcss({
               extensions: [".css"],
               extract: true,
               plugins: [postcssImport(), tailwindcss()]
           }),
           commonjs({
               include: [
                   "node_modules/**",
                   "node_modules/**/*"
               ]
           }),
       ],
       external: ['vue', 'echarts', 'lodash-es']
   }
   ```

2. ***rollup.ems.config.js***

   ```bash
   import basicConfig, { name, file } from './rollup.config'
   export default {
     ...basicConfig,
     output: {
       name,
       file: file('esm'),
       format: 'es'
     }
   }
   ```

3. ***rollup.umd.config.js***

   ```bash
   import basicConfig, { name, file } from './rollup.config'
   export default {
     ...basicConfig,
     output: {
       name: 'well-bricks',
       file: file('umd'),
       format: 'umd',
       globals: {
         'vue': 'Vue',
       },
       exports: 'named'
     }
   }
   ```

到这里我们就把Rollup打包工具的配置弄好了

## 4.创建组件

1. 创建`/packages/components/textButton`文件夹,并在***textButton***文件夹下面创建`index.ts`、`index.vue`以及`index-group.vue`

2. 创建`/src/index.ts`

3. 创建`/packages/main.css`

此事目录结构应为：

![image-20220713101133295](https://tva1.sinaimg.cn/large/e6c9d24ely1h452tq7ipjj207307dq30.jpg)

## 5.全局注册与局部注册组件

此时我们要清楚全局引入和局部引入的区别

- 全局引入是利用了vue的install语法,循环组件都挂载到vue的实例对象上
- 局部引入是利用了export的特性

在`/src/index.ts` 写入:

```typescript
/* eslint-disable */
import {App} from 'vue'

import './main.css'   // 引入样式
import TextButton from './components/textButton'

const components = [
    TextButton
]

// 全局注册
const install = (app: App) => {
    components.forEach(component => {
        app.component(component.name, component)
    })
}

// 局部注册
export {
    TextButton,
    install
}
export default {
    install
}
```

ps: 到这里其实你就已经打造好了一个组件库框架,接下来我们对具体的组件进行开发

## 6.组件内容开发

1. 在` /src/components/textButton/index.vue`中写入

   ```vue
   ```

   
