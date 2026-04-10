const promiseAllSettled = (promiseArr = []) => {
   const len = promises.length;
   const result = []; 
   return new Promise((resolve, reject)=>{
       for (let i =0 ; i< len; i++) {
           promises[i].then(res =>{
               result.push({
                   status: 'fullfilled',
                   value: res,
               })
           }, err =>{
               result.push({
                  status: 'rejected',
                  resion: err, 
               })

           }).finally(()=>{
               if (i === len -1){
                   resolve(result)
               }
           })
       }
   })
}

