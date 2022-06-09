
import { createFiberRoot } from './ReactFiberRoot';
import { updateContainer } from './ReactFiberReconciler';
function render(element, container) {
    //1.创建一个fiberRoot, 它其实指向是我们的div#root这个容器
    let fiberRoot = container._reactRootContainer;
    if (!fiberRoot) {
        fiberRoot = container._reactRootContainer = createFiberRoot(container);
    }
    //把element这个虚拟DOM变成真实DOM插入容器中
    updateContainer(element, fiberRoot);
}
const ReactDOM = {
    render
}
export default ReactDOM;