---
title: vue实现双向数据绑定原理是什么
---

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script src="https://cdn.bootcss.com/vue/2.5.16/vue.js"></script>
    <!-- 引入vue文件 -->
    <div id="box">
      <new-input v-bind:name.sync="name"></new-input>
      {{name}}
      <!-- 小胡子语法 -->
      <input type="text" v-model="name" />
    </div>
    <script>
      Vue.component("new-input", {
        props: ["name"],
        data: function () {
          return {
            newName: this.name,
          };
        },
        template: `<label><input type="text" @keyup="changgeName"
        v-model="newName" /> 你的名字：</label>`,
        // 模板字符串
        methods: {
          changgeName: function () {
            this.$emit("update:name", this.newName);
          },
        },
        watch: {
          name: function (v) {
            this.newName = v;
          },
        },
        //    监听
      });

      new Vue({
        el: "#box",
        //挂载实例
        data: {
          name: "nick",
        },
        //赋初始值
      });
    </script>
  </body>
</html>

```

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <input type="text" v-mode="msg" />
    <p v-mode="msg"></p>
    <script>
      const data = {
        msg: "你好",
      };
      const input = document.querySelector("input");
      const p = document.querySelector("p");
      input.value = data.msg;
      p.innerHTML = data.msg;
      //视图变数据跟着变
      input.addEventListener("input", function () {
        data.msg = input.value;
      });
      //数据变视图变
      let temp = data.msg;
      Object.defineProperty(data, "msg", {
        get() {
          return temp;
        },
        set(value) {
          temp = value;
          //视图修改
          input.value = temp;
          p.innerHTML = temp;
        },
      });
      data.msg = "小李";
    </script>
  </body>
</html>
```

