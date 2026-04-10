/**
 * @param {string} s
 * @return {number}
 */
 var lengthOfLongestSubstring = function(str) {
    const len = str.length;
    let temp = new Map();
    let k= 0;
    let maxlen = 0;
    for (let i=0; i<len;) {
        if (temp.has(str[i])) { // 已重复
            const mark = temp.get(str[i]);
            k = mark +1;
            // console.log(temp, 'repeat')
            temp.clear()
            i = k ;
        } else {  // 未重复
            temp.set(str[i], i);
            // console.log(temp, 'unrepeat')
            i++; 
        }
        if (temp.size> maxlen) {
                maxlen = temp.size;
        }
    
    }
    return maxlen;
    };