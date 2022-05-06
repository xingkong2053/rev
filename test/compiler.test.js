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

test('plain text', ()=>{
    expect(parse("plain text xxxx").toBe(null))
})

test('tag with text',()=>{
    const text = "this is a text";
    const ast = {
        type: 1,
        tag: "div",
        rawAttr: {
            id: "app",
            "class": "container",
            "v-model": "input"
        },
        children: []
    };
    ast.children.push({
        type: 3,
        text
    })
    expect(parse(`
        <div id="app" class="container" v-model="input">${text}</div>
    `)).toStrictEqual(ast)
})

test('tag with text 2',()=>{
    const text = " hello {{ user.name }}";
    const ast = {
        type: 1,
        tag: "div",
        rawAttr: {},
        children: [{
            type: 3,
            text,
            expression: "user.name"
        }]
    }
    expect(parse(`
        <div>${text}</div>
    `)).toStrictEqual(ast)
})