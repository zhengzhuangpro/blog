
function deepClone(obj) {
    const result = shallowClone(obj);
    Object.entries(result).forEach(
        ([key,value])=>{
            if (typeof value === 'object'){
                result[key] = deepClone(value);            
            } else{
				result[key] = value
			}  
        }    
    );
    return result;
}

