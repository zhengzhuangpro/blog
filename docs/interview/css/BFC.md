---
title: BFC
---

### 何为 BFC

`BFC`全称：`Block Formatting Context`， 名为 “块级格式化上下文”。

`W3C`官方解释为：`BFC`它决定了元素如何对其内容进行定位，以及与其它元素的关系和相互作用，当涉及到可视化布局时，`Block Formatting Context`提供了一个环境，`HTML`在这个环境中按照一定的规则进行布局。

简单来说就是，`BFC`是一个完全独立的渲染区域（布局环境），让处于 `BFC`内部的元素与外部的元素相互隔离，使内外元素的定位不会相互影响。

在`BFC`中，盒子从顶端开始垂直地一个接一个地排列，两个盒子之间的垂直的间隙是由他们的`margin`值所决定的。在一个`BFC`中，两个相邻的块级盒子的垂直外边距会产生折叠。

每一个盒子的左外边缘（`margin-left`)会触碰到容器的左边缘(`border-left`)(对于 从右到左的格式来说，则触碰到右边缘）。

### 形成或触发 BFC 的条件

1. `position:absolute`或`fixed`；
2. `float:left/right;`
3. `overflow:hidden;`不为`visible`， 常用方式;
4. `display`: `inline-block`, `flow-root`, `table-cell`, `table-caption`, `flex`, `inline-flex`等。

IE 下为 Layout，可通过 zoom:1 触发

### BFC 的特性

1. 内部的`Box`会在垂直方向上一个接一个的放置
2. 垂直方向上的距离由`margin`决定
3. `BFC`的区域不会与`float`的元素区域重叠
4. 计算`BFC`的高度时，浮动元素也参与计算
5. `BFC`就是页面上的一个独立容器，容器里面的子元素不会影响外面元素

### 应用

阻止`margin`重叠 可以包含浮动元素 —— 清除内部浮动(清除浮动的原理是两个`div`都位于同一个 `BFC`区域之中) 自适应两栏布局 可以阻止元素被浮动元素覆盖
