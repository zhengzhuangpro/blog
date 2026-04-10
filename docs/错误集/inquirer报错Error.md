---
title: inquirer报错Error
---

### 报错内容

```bash
$ node dist/index.js create testName
/Users/zhengzhuang/example/node-example/cli/demo-cli/dist/index.js:2
"use strict";var e=require("commander"),n=require("path"),o=require("fs"),t=require("readline"),r=require("inquirer");function s(e,n,o,t){return new(o||(o=Promise))((function(r,s){function c(e){try{a(t.next(e))}catch(e){s(e)}}function i(e){try{a(t.throw(e))}catch(e){s(e)}}function a(e){var n;e.done?r(e.value):(n=e.value,n instanceof o?n:new o((function(e){e(n)}))).then(c,i)}a((t=t.apply(e,n||[])).next())}))}const c=()=>{const e="\n".repeat(process.stdout.rows);console.log(e),t.cursorTo(process.stdout,0,0),t.clearScreenDown(process.stdout)};var i="1.0.0";const a=new e.Command;a.version(i).command("create <name>").description("创建新的项目").action((e=>{(e=>{s(void 0,void 0,void 0,(function*(){const t=n.join(process.cwd(),e);o.existsSync(t)&&c(),c();const s=yield r.prompt([{type:"input",message:"设置一个用户名:",name:"name",default:"test_user"}]);console.log("answers",s)}))})(e)})),a.parse();
                                                                                                  ^

Error [ERR_REQUIRE_ESM]: require() of ES Module /Users/zhengzhuang/example/node-example/cli/demo-cli/node_modules/inquirer/lib/inquirer.js from /Users/zhengzhuang/example/node-example/cli/demo-cli/dist/index.js not supported.
Instead change the require of inquirer.js in /Users/zhengzhuang/example/node-example/cli/demo-cli/dist/index.js to a dynamic import() which is available in all CommonJS modules.
    at Object.<anonymous> (/Users/zhengzhuang/example/node-example/cli/demo-cli/dist/index.js:2:99) {
  code: 'ERR_REQUIRE_ESM'
}
```

在ts项目中，由于`inquirer`版本过高导致

### 解决方案

```bash
"inquirer": "^8.2.0",
```

安装低版本或者8.几版本，就可解决