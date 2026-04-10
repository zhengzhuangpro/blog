---
title: promise问题
---

```js
const promiseA = new Promise( (resolutionFunc,rejectionFunc) => {
    resolutionFunc(777);
});

promiseA.then(() => {}, () => {
    console.log('reject')
return 1;
}).then((res) => {
    console.log(res, 'res')
}, (err) => {
     console.log(err, 'err')
}).catch((err) => {
      console.log(err, 'err')
})
```

```js
const promiseD = new Promise( (resolutionFunc,rejectionFunc) => {
    rejectionFunc(777);
});

promiseD.then(() => {}, () => {
    console.log('reject')
return 1;
}).then((res) => {
    console.log(res, 'res')
}, (err) => {
     console.log(err, 'err')
}).catch((err) => {
      console.log(err, 'err')
})
```

```js
Promise.reject()
  .then(() => 99, () => 42)
  .then(solution => console.log('Resolved with ' + solution));

```


```js
new Promise(function(resolve,reject){
    resolve(Promise.reject())
}).then(function () {
    console.log(1)
}).catch(function() {
    console.log(2)
})

```