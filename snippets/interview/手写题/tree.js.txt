const tree = {
    id: 'root',
    children: [
      {
        id: 'node-1',
        children: [
          {
            id: 'node-1-1',
            children: [
              {
                id: 'node-1-1-1'
              }
            ]
          },
          {
            id: 'node-1-2'
          }
        ],
      },
      {
        id: 'node-2',
        children: 'unexpected'
      },
      {
        id: 'node-3',
        children: [
          {
            id: 'node-3-1',
            children: [
              {
                id: 'node-3-1-1',
                children: [
                  {
                    id: 'node-3-1-1-1'
                  },
                ]
              },
              {
                id: 'node-3-1-2'
              }
            ]
          }
        ]
      }
    ]
  };
  
  // 请实现一个函数，接收树中任意节点的 id，返回此节点信息



  const treeId = (tree, id) => {
    if (id === tree.id) return tree 
    const children = tree.children
    const len = Array.isArray(children)&& children.length || 0
    for(let i= 0; i < len; i++) {
       const item = children[i]
      if (item.id === id) {
        return item
      } else {
        treeId(item, id)
      } 
    }
  }