---
title: tsconfig
---

```json
{
	"compilerOptions": {
		"target": "es5",
		"module": "esnext",
		"lib": ["dom", "es2017"],
		"strict": true,
		"noImplicitAny": false,
		"baseUrl": "./",
		"esModuleInterop": true,
		"moduleResolution": "node",
		"resolveJsonModule": true,
		"noUnusedLocals": true, // 未使用变量报错
		"experimentalDecorators": true, // 启动装饰器
		"allowJs": false, // 是否编辑js文件
        "strictNullChecks": true, // 开启undefined null 检查
		"declaration": true, // 输出一个生命文件
	},
	"exclude": ["node_modules", "dist","**/__test__", "docs",]
}
```
