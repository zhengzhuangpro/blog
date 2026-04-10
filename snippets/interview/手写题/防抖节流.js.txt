

//防抖
const debounce = (fun, wait)=> {
    const timer = null;
    return function (){
        if (timer){
            clearTimeout(timer) 
         }
         timer = setTimeout(()=>{
             return function(...args){
                 fun.apply(this, args)  //this 指当前对象，也就是正在调用这个函数的对象。 使用 apply改变fn的 this 指向
             }
         }, wait)
    }
}
// apply 接受的是一个参者数组 ，call func.call(obj, 'C', 'D'); 

//节流

const throttle = (fn, wait) => {
    let previous = 0;
    return function (...args) {
        const now = +new Date();
        if (now - previous > wait || now - previous === wait){
            fn.apply(this, args)
            previous = now;
        }
    }
}