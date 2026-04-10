---
title: Flutter 实用方法
date: 2022-07-13 15:40:12
tags:
categories: flutter
---

#### flutter 更改状态栏字体颜色

dark: 字体黑色

light: 字体白色

```dart
SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle.dark);
```

#### Flutter 沉浸式状态栏

```
void main() {
  runApp(MyApp());
  if (Platform.isAndroid) {
    // 以下两行 设置android状态栏为透明的沉浸。写在组件渲染之后，是为了在渲染后进行set赋值，覆盖状态栏，写在渲染之前MaterialApp组件会覆盖掉这个值。
    SystemUiOverlayStyle systemUiOverlayStyle =
        SystemUiOverlayStyle(statusBarColor: Colors.transparent);
    SystemChrome.setSystemUIOverlayStyle(systemUiOverlayStyle);
  }
}
```

#### Flutter 点击空白出隐藏键盘

```dart
body: GestureDetector(
    behavior: HitTestBehavior.translucent,
    onTap: () async{
        // 点击空白处收起键盘
        FocusScope.of(context).requestFocus(FocusNode());
    },
    child: Container(),
),
```

#### flutter 键盘弹出 导致超出屏幕

```dart
return Scaffold(
  appBar: AppBar(
    elevation: 0.0,
    title: new Text("登陆"),
  ),
  resizeToAvoidBottomPadding: false, //输入框抵住键盘
);
```

#### flutter 监听页面返回触发事件

```dart
body: GestureDetector(
  behavior: HitTestBehavior.translucent,
  onTap: () async {
    /// 点击空白处收起键盘
    FocusScope.of(context).requestFocus(FocusNode());
  },
  body: Container(),
}
```

#### flutter 获取屏幕宽高度

```dart
MediaQuery.of(context).size.width
MediaQuery.of(context).size.height
```

#### flutter 在安全区域之内

```
Material(
  color: Colors.blue,
  bottom: false,
  child: SafeArea(
    child: SizedBox.expand(
      child: Card(color: Colors.yellowAccent),
    ),
  ),
);
```



