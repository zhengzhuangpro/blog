---
title: jest
---

```js
expect(data).toBe('peanut butter');
```

检查一个异步请求
```js
test('the data is peanut butter', () => {
  return fetchData().then(data => {
    expect(data).toBe('peanut butter');
  });
});
```


如果期望Promise被Reject，则需要使用 .catch 方法。 请确保添加 expect.assertions 来验证一定数量的断言被调用。 否则，一个fulfilled状态的Promise不会让测试用例失败。

```js
test('the fetch fails with an error', () => {
  expect.assertions(1);
  return fetchData().catch(e => expect(e).toMatch('error'));
});
```

您还可以使用 .resolves 匹配器在您期望的声明，Jest 会等待这一 Promise 来解决。 如果 Promise 被拒绝，则测试将自动失败。

```js
test('the data is peanut butter', () => {
  return expect(fetchData()).resolves.toBe('peanut butter');
});
```
