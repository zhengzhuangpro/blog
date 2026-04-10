// 以 @qq.com 结尾
// 4-11 位 必须是纯数字
// 首位不是 0 
 
function isQQ (str) {
    let i = str.indexOf('@');
    const cell = str.slice(i)
    if (i > -1){
        if (cell !== '@qq.com') {
            return false
        }
       const head = str.split('@')
       len = head[0] && head[0].length || 0;

       if (len < 4 || len > 11) {
           return false;
       } else {
           let result = true
          const arr = head[0].split('');
          console.log(arr, 'arr')
          for (let i=0; i< arr.length; i++) {
              console.log(parseInt(arr[i]), '!!')
              if (parseInt(arr[i]) === NaN){
                  result = false;
                  return false;
              }
          }
          return result;
       }
    } else{
        return false;
    }

}

 
function isQQ (str) {
    const regx =/^[1-9][0-9]{3,10}@qq\.com$/i
   return regx.test(str)
}

function isQQ (str) {
    const regx =/^[^0][0-9]{3,10}@qq\.com$/i
   return regx.test(str)
}