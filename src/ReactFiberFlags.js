//可以给fiber添加一个副作用标识符，表示此fiber对应的DOM节点需要进行何种操作
export const NoFlags = 0b000000000000000000;//0 没有动作
export const Placement = 0b000000000000000010;//2 添加 或者说创建 挂载
export const Update = 0b000000000000000100;//4  更新
export const PlacementAndUpdate = 0b000000000000000110;//6 移动
export const Deletion = 0b000000000000001000;//8 删除、
//0 2 4 6 8
//无添加 更新 移动 删除