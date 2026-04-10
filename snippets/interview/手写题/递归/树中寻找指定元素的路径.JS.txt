//  返回在一个树结构中一个指定节点的路径。就是从根节点往下走，children中的第几项，传回一个索引数组，它可以按照这个索引数组，直接按位去找到这个节点
const data = { // 模拟的antd的树结构数据，以ID作为唯一指定值
    key: '1',
    id: 'asascascasc',
    children: [
        {
            key: '1.1',
            id: 'asvasvgasf',
            children: [
                {
                    key: '1.1.1',
                    id: '8888',
                    children: [],
                },
                {
                    key: '1.1.2',
                    id: '341243',
                    children: [{
                        key: '1.1.2.1',
                        id: 'sdarqafascavf',
                        children: [],
                    },],
                },
            ],
        },
        {
            key: '1.2',
            id: 'vassfafdasfcac',
            children: []
        },
        {
            key: '1.3',
            id: 'cavcasfra',
            children: []
        },
        {
            key: '1.4',
            id: 'casfraracdacs',
            children: [
                {
                    key: '1.1.2',
                    id: '3412431',
                    children: [{
                        key: '1.1.2.1',
                        id: 'sdarqafascavf1',
                        children: [],
                    },],
                },
                {
                    key: '1.1.2',
                    id: '3412432',
                    children: [{
                        key: '1.1.2.1',
                        id: 'sdarqafascavf2',
                        children: [],
                    },],
                },
                {
                    key: '1.1.2',
                    id: '3412433',
                    children: [{
                        key: '1.1.2.1',
                        id: 'sdarqafascavf3',
                        children: [],
                    },],
                },
            ]
        },
    ],
}


const getPosByIdInTree = (tree, id) => {
    const tmp = [] // 路径数组
    if (tree.id === id) { return [0] }//根节点

    const FindPos = (sourceTree, sourceId) => {
        if (!sourceTree.children) {
            return; // 为末端节点
        }
        sourceTree.children.forEach((item, index) => {
            if (item.id === sourceId) {// 寻找到指定的元素节点
                tmp.push(index);
                FindPos(tree, sourceTree.id) // 继续寻找上层元素的位置
            } else {// 当前继续寻找别的子项
                FindPos(item, sourceId)
            }
        })
    }

    FindPos(tree, id);
    // return tmp
    // 这里会有一些特定的问题,这个路径是反序存储的，所以需要存进去之后反转一次
    // 另外看自己的需求，这个是否需要push(0)作为根节点的判定
    return tmp.reverse()
}

const findIdFromTree =(tree, id)=>{
    const result = [];
    if (tree.id === id) return [0];
    const findChildTree = (soouceTree, id)=> {
        const childTree = soouceTree.children
        if (!childTree) return;
        for(let i=0; i<childTree.length; i++){
            if(childTree[i].id ===id){
                result.push(i);
                findChildTree(tree, soouceTree.id) //继续在原树中查找父元素的路径
            }
            findChildTree(childTree[i], id) // 继续像子树中查找
        }
    }
    findChildTree(tree, id)
    return result.reverse();
}


// const source = 'sdarqafascavf2'
// const pos = getPosByIdInTree(data, source)
// console.log(pos);// [3, 2, 0] 不算根节点，测试通过



