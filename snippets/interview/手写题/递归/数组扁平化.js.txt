const flat  =(arr)=> {
    const result = [];
    arr.forEach(item => {
        if (Array.isArray(item)){
            result.push(...flat(item))
        }else{
            result.push(item)
        }
    });
    return result;
}

// 使用 reduce
const flatReduce =(arr)=> {
const result = arr.reduce((pre, curr) => {
    return pre.concat(Array.isArray(curr)? flatReduce(curr): curr)
}, [])
return result
}