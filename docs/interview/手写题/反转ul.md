---
title: 反转ul
---

# 反转 ul

```jsx | preview
/**
 * defaultShowCode: true
 */
import React from "react";

class App extends React.Component {
  componentDidMount() {
    const ul = document.getElementById("ul");
    const list = ul.getElementsByTagName("li");
    const fragment = document.createDocumentFragment();

    let i = list.length - 1;
    while (i >= 0) {
      fragment.appendChild(list[i]);
      i--;
    }

    ul.appendChild(fragment);
  }

  render() {
    return (
      <ul id="ul">
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
        <li>5</li>
      </ul>
    );
  }
}

export default () => <App title="First Demo" />;
```
