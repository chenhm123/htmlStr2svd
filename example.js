var html2elementTree = require('index');
var svd = require('simple-virtual-dom');
var diff = svd.diff;
var patch = svd.patch;

var htmlStr = "<div class='d1 d4' id='d3' style='color:red;font-size:33px;'><div>33</div>\n\n<div>35</div><div></div><img src='xx'></div>";


var tree = html2elementTree(htmlStr);
var root = tree.render();

$('#test').html(root);

var newHtmlStr = "<div><div>22</div></div>";
patch(root,diff(tree,html2elementTree(newHtmlStr)));



