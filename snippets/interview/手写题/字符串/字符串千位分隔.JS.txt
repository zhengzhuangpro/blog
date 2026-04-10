// 将普通的数字转换为带千位分隔符格式的数字字符串是一个非常常见的问题，
// 千位分隔符格式的规则是数字的整数部分每三位一组，以“，”分节。小数部分不分节 。
// 示例：19,351,235.235767


const toThousand = (num) => {
    if (!num.toString()) return
    const temp = num.toString().split(".")
    const arr = temp[0].split("").reverse();
    const results = [];
    for (let i= 0; i<arr.length; i++){
        if (i!==0 && i%3 === 0){
            results.push(',')
        }
        results.push(arr[i])
    }
    const str = results.reverse().join("")
    return temp[1] ? `${str}.${temp[1]}` : str
}

console.log(toThousand(1234567894532))
toThousand(673439.4542)
