---
title: css
---

1. 为什么css设置1px，但是在移动端上显示却感觉有些粗呢？

我们就大概知道了1px线变粗的原因。简单来说就是手机屏幕分辨率越来越高了，同样屏幕大小的一个手机，它的实际物理像素数更多了。因为不同的移动设备有不同的像素密度，所以我们所写的1px在不同的移动设备上展示是不一样的。


优点：
所有场景都能满足
支持圆角(伪类和本体类都需要加border-radius)
缺点：
需要注意 `<input type="button">` 是没有 `:before`、`:after` 伪元素的
对于已经使用伪类的元素(例如clearfix)，可能需要多层嵌套

实现0.5px

```css
.scale-1px:after{
  content: '';
  position: absolute;
  bottom: 0;
  background: #000;
  width: 100%;
  height: 1px;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
}

四条boder样式设置：
.scale-1px{
  position: relative;
  margin-bottom: 20px;
  border:none;
}
.scale-1px:after{
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  border: 1px solid #000;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 200%;
  height: 200%;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
  -webkit-transform-origin: left top;
  transform-origin: left top;
}
```



2. flex 实现吸顶
3. fixed 吸顶下面怎么撑开
下面的元素 marging-top
或者用div 占位
