
export default class Vue {
    constructor(options) {
        const {el, data} = options
        this.$data = data
        observe(this.$data)
        Object.keys(this.$data).forEach(key=>{
            proxy(this, "$data", key)
        })
        compile(this, el)
    }
}

// 设置数据响应式或返回响应式对象
function observe(data){
    if(typeof data !== "object") {return;}
    if(!data.__ob__){
        data.__ob__ = new Observer(data)
    }
    return data.__ob__
}

class Observer{
    constructor(data) {
        this._data = data
        this.dep = new Dependency()
        this.walk()
    }
    walk(){
        Object.keys(this._data).forEach(key=>{
            const dep = new Dependency()
            let value = this._data[key]
            const childOb = observe(value)
            Object.defineProperty(this._data,key,{
                enumerable: true,
                configurable: true,
                get(){
                    if(Dependency.target){
                        dep.depend()
                        childOb && childOb.dep.depend()
                    }
                    return value
                },
                set(newVal){
                    observe(newVal)
                    value = newVal
                    dep.notify()
                }
            })
        })
    }
}

class Dependency{
    /**
     * @type {Watcher | null}
     */
    static target = null;
    constructor() {
        this.subs = []
    }
    depend(){
        this.subs.push(Dependency.target)
        Dependency.target.addDep(this)
    }
    notify(){
        this.subs.forEach(watcher=>{
            watcher.update()
        })
    }
}

class Watcher{
    constructor(vm, key ,callback) {
        this.deps = []
        this.vm = vm
        this.key = key
        this.callback = callback
        Dependency.target = this
        this.value = this.get()
        Dependency.target = null;
        this.callback(this.value)
    }
    addDep(dep){
        this.deps.push(dep)
    }
    get(){
        const arr = this.key.split(".")
        return arr.reduce(
            (obj,key)=>obj[key],
            this.vm.$data
        )
    }
    update(){
        this.callback(this.get())
    }
}

function compile(vm, el){
    vm.$el = document.querySelector(el);
    const fragment = document.createDocumentFragment();
    let child;
    while((child = vm.$el.firstChild)){
        fragment.append(child)
    }
    fragmentCompile(fragment)
    vm.$el.appendChild(fragment)

    /**
     * @param { DocumentFragment | ChildNode } node
     */
    function fragmentCompile(node){
        const reg = /{{\s*(\S+)\s*}}/;
        if(node.nodeType === 3){
            // 文本节点
            const rawTpl = node.nodeValue
            const result = reg.exec(rawTpl)
            if(result){
                new Watcher(vm, result[1], newValue =>{
                    node.nodeValue = rawTpl.replace(reg, newValue)
                })
            }
        }
        node.childNodes.forEach(child=>fragmentCompile(child))
    }
}

function proxy(target, sourceKey, key){
    Object.defineProperty(target,key,{
        get(){
            return target[sourceKey][key]
        },
        set(newValue){
            target[sourceKey][key] = newValue
        }
    })
}