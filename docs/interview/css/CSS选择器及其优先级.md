---
title: CSS选择器及其优先级
---

<table border="0" align="center" bordercolor="black">
    <tr align="center">
        <td>选择器</td>
        <td>格式</td>
        <td>优先级权重</td>
    </tr>
    <tr align="center">
        <td>id选择器</td>
        <td>#id</td>
        <td>100</td>
    </tr>
    <tr align="center">
        <td>类选择器</td>
        <td>#classname</td>
        <td>10</td>
    </tr>
    <tr align="center">
        <td>属性选择器</td>
        <td>a[ref=“eee”]</td>
        <td>10</td>
    </tr>
    <tr align="center">
        <td>伪类选择器</td>
        <td>li:last-child</td>
        <td>10</td>
    </tr>
    <tr align="center">
        <td>标签选择器</td>
        <td>div</td>
        <td>1</td>
    </tr>
    <tr align="center">
        <td>伪元素选择器</td>
        <td>li:after</td>
        <td>1</td>
    </tr>
    <tr align="center">
        <td>相邻兄弟选择器</td>
        <td>h1+p</td>
        <td>0</td>
    </tr>
    <tr align="center">
        <td>子选择器</td>
        <td>ul>li</td>
        <td>0</td>
    </tr>
    <tr align="center">
        <td>后代选择器</td>
        <td>li a</td>
        <td>0</td>
    </tr>
    <tr align="center">
        <td>通配符选择器</td>
        <td>*</td>
        <td>0</td>
    </tr>
</table>

对于选择器的**优先级**：

- 标签选择器、伪元素选择器：1
- 类选择器、伪类选择器、属性选择器：10
- id 选择器：100
- 内联样式：1000

**注意事项：**

- !important声明的样式的优先级最高；
- 如果优先级相同，则最后出现的样式生效；
- 继承得到的样式的优先级最低；
- 通用选择器（*）、子选择器（>）和相邻同胞选择器（+）并不在这四个等级中，所以它们的权值都为 0 ；
- 样式表的来源不同时，优先级顺序为：内联样式 > 内部样式 > 外部样式 > 浏览器用户自定义样式 > 浏览器默认样式。