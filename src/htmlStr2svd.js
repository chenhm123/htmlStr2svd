/**
 * Created by chenhm on 17/07/2017.
 */
var svd = require('simple-virtual-dom');
var El = svd.el;
if (typeof module === 'object' && typeof module.exports === 'object') {
    require('./htmlparser.js');
}

function removeDOCTYPE(html) {
    return html
        .replace(/<\?xml.*\?>\n/, '')
        .replace(/<!doctype.*\>\n/, '')
        .replace(/<!DOCTYPE.*\>\n/, '');
}

function getElementTree(html) {
    html = removeDOCTYPE(html);
    var bufArray = [];
    var results = {
        children:[],
        tag:'root'
    };
    HTMLParser(html, {
        start: function(tag, attrs, unary) {
            var elOption = {};
            elOption.tag = tag;
            if (attrs.length !== 0) {
                elOption.props = attrs.reduce(function(pre, attr) {
                    pre[attr.name] = attr.value;
                    return pre;
                }, {});
            }
            if (unary) {
                var parent = bufArray[0] || results;
                if (parent.children === undefined) {
                    parent.children = [];
                }
                parent.children.push(new El(elOption.tag,elOption.props,elOption.children));
            } else {
                bufArray.unshift(elOption);
            }
        },
        end: function(tag) {
            var elOption = bufArray.shift();
            if (elOption.tag !== tag) throw new Error('template标签使用不规范');

            var el = new El(elOption.tag,elOption.props,elOption.children);

            if (bufArray.length === 0) {
                results.children.push(el);
            } else {
                var parent = bufArray[0];
                if (parent.children === undefined) {
                    parent.children = [];
                }
                parent.children.push(el);
            }
        },
        chars: function(text) {
            if(!text.trim()) return;

            if (bufArray.length === 0) {
                throw new Error('template 必须只有一个顶级节点')
            } else {
                var parent = bufArray[0];
                if (parent.children === undefined) {
                    parent.children = [];
                }
                parent.children.push(text);
            }
        },
        comment: function(text) {
            //不对注释做处理
        },
    });
    if(results.children.length !== 1){
        // throw new Error('顶级节点必须有且只有一个');
        results.children = [new El('div',{},results.children)];
    }
    return results.children[0];
}

module.exports = getElementTree;
