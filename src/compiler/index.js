/**
 * 解析html生成ast语法树
 * @param {string} template
 */
export default function parse(template){
    const stack = [];   // 标签栈
    let root = null;    // 最终语法树

    let html = template
    while(html.trim()){
        if(html.indexOf('<!--') === 0){            // 过滤注释
            html = html.slice(html.indexOf('-->')+3)
            continue;
        }
        const startIdx = html.indexOf("<")
        if(startIdx === 0){
            if(html.indexOf("</") === 0){
                parseEnd()
            } else {
                parseStart()
            }
        } else if(startIdx>0){

        }
    }

    return null;

    function parseStart(){
        const endIdx = html.indexOf(">")
        let content = html.slice(1, endIdx).trim()
        html = html.slice(endIdx+1)
        const iFirstSpace = content.indexOf(" ") // index of first space
        let tag, sAttr;
        if(iFirstSpace === -1){     //no attr
            tag = content
            sAttr = ''
        } else {
            tag = content.slice(0, iFirstSpace)
            sAttr = content.slice(iFirstSpace+1)
        }
        let attrs = sAttr ? sAttr.split('') : []
        attrs = attrs.filter(attr=>attr!=='')
        const mAttr = parseAttrs(attrs)
        const elmAST = genAST(tag,mAttr)

        function parseAttrs(attrs){
            const reg = /(.*?)\s*=\s*"(.*?)"/
            const map = {}
            attrs.forEach(attr=>{
                const match = reg.exec(attr)
                if(match){
                    map[match[1]] = match[2]
                }
            })
            return map
        }
        function genAST(tag, mAttr){
            return {
                type: 1,
                tag,
                rawAttr: mAttr,
                children: []
            }
        }
    }

    function parseEnd(){

    }
}