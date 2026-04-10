---
title: egg定时任务
---

#### egg定时任务

修改定时任务需要重启服务，才会生效

```js
const Subscription = require('egg').Subscription;

class UpdateCache extends Subscription {
  // 通过schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '1m', //  1 分钟间隔
      type: 'all',  // 制定所有的 worler 都需要执行
      // immediate: true, //项目启动就执行一次定时任务
      // env: ["dev", "debug"], //该定时任务在开发环境和debug模式下才执行
      // disable: false, //参数为 false时，定时任务会被启动。
    }
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const { ctx } = this;
    console.log('定时任务');
    const res = await ctx.curl('http://www.api.com/cache', {
      dataType: 'json',
    });
    ctx.app.cache = res.data;
  }
}

module.exports = UpdateCache;
```