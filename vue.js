
class Vue {
    constructor(options) {
        const {el, data} = options
        this.$data = data
        observe(this.$data)
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
    constructor(vm, callback) {
        Dependency.target = this
        this.deps = []
        this.vm = vm
        this.callback = callback
    }
    addDep(dep){
        this.deps.push(dep)
    }
    update(){
        this.callback()
    }
}

function compile(vm, el){
    vm.$el = document.querySelector(el);
    const fragment = document.createDocumentFragment();
    let child;
    while((child = vm.$el.firstChild)){
        fragment.append(child)
        console.log(fragment)
    }

}