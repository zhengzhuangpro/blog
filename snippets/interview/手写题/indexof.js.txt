

function indexOf(str, val){
    if (!str || !val) return 
    var strLen = str.length, valLen = val.length
    for(var i = 0; i < strLen; i++){
        var matchLen = i + valLen
        var matchStr = str.slice(i, matchLen)
        if(matchLen > strLen){ // 剩余的字符串已经小于待查找字符串长度则说明未找到
            return -1
        }
        if(matchStr === val){ //截取的字符串 正好 等于目标字符串则说明找到则返回下标
            return i
        }
    }
    return -1
}


function indexOf (str, target) {
    if (!str || !target) return;
    const strlen = str.length;
    const targetLen = target.length
    for(let i= 0; i< strlen; i++){
        const matchStr = str.slice(i, i+targetLen);
        if (matchStr === target){
            return i
        }
        if (i+targetLen > strlen){
            return -1
        }
    } 
}
