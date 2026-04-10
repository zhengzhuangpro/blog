//.Math.max


function _max(array) {
    return Math.max(...array)
}


// 2. sort

   function _max(array) {
       array.sort((a,b) => {
           return b-a
       })
       return array[0]
   }

// 3. 自己的解法

   function max(array) {
       // 补全代码
       if (array.length < 1) {
           return
       }
       if (array.length == 1) {
           return array[0]
       }
       var max = array[0]
       for(var i = 1; i < array.length; i++) {
           if (max < array[i]) {
               max = array[i]
           }  
       }
       return max
   }

// ​4.数组去重，不得用indexof set 等es6 语法


function unique (arr) {
    const obj ={}
    const result =[]
    arr.forEach(item => {
        let value = `${typeof item}${item}`
        if (!obj[value]){
            obj[value] = true
            result.push(item)
        }
    });
    return result
}
//算法：数组去掉指定几个值
//[1,2,3,4,,4,5,6]去掉[1,2]
function deleteItem (arr, deleteArr) {
    const result = arr
    deleteArr.forEach((item)=>{
        let i = arr.indexOf(item)
        arr.splice(i,1)
    })
    return result
}

// 两个数的和是一个target

// 第k大的数

//遍历第一个不知深度的数

// 树的广度遍历Z字型