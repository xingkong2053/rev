import parse from "../src/compiler";

test('only tag',()=>{
    const ast = {type:1, tag: 'div', rawAttr: {}, children: []}
    expect(parse(`<div></div>`)).toStrictEqual(ast)
})

test('tag with attrs',()=>{
    const ast = {
        type: 1,
        tag: "div",
        rawAttr: {
            id: "app",
            "class": "container",
            "v-model": "input"
        },
        children: []
    }
    expect(parse(`<div id="app" class="container" v-model="input"></div>`))
        .toStrictEqual(ast)
})