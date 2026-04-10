

// 问：JavaScript 如何查找对象中某个 value 并返回路径上所有的 key？

function search(object, value) {
    for (var key in object) {
        if (object[key] == value) return [key];
        if (typeof(object[key]) == "object") {
            var temp = search(object[key], value);
            if (temp) return [key, temp].flat();
        }
    }
}



let obj = {
    key1: 'str1',
    key2: {
        key3: 'str3'
    },
    key4: {
        key5: {
            key6: 'str6',
            key7: 'str7'
        },
        key8: 'str8'
    },
    key9: 'str9'
};

const search4 = (obj, target) => {
  for (let key in obj) {
      if (obj[key] === target) { // 递归出口
          return [key]
      } else if(typeof obj[key] === 'object') {
        const val = search4(obj[key], target) //如果在当前的key 中找到了则有返回值，如果没有找到将返回 undefinde
        if (val) { // 如果有返回要将当前key 和返回的key 做链接
            return [key, val].flat();
        }
      }
  } 
}

search4(obj, 'str6')
