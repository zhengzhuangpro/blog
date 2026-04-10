---
title: Flutter与原生通信的Channel有哪几种
---

#

Flutter 定义了三种不同类型的 Channel，它们分别是：

- `BasicMessageChannel`：用于传递字符串和半结构化的信息。
- `MethodChannel`：用于传递方法调用（method invocation）。
- `EventChannel`: 用于数据流（event streams）的通信。
