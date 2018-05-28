// https://mp.weixin.qq.com/s/NY9t1HsEZjZJX8hnvvz4Kw
// 实现场景类
window.ConsoleCanvas = new function () {
  // 场景
  this.Scene = function(name = '', style){
    // 场景元素集合
    this.elements = [];
    // 场景样式
    this.style = Object.prototype.toString.call(style) === '[object Array]' ? style: [];
    //场景名称
    this.name = name.toString();
  };
  // 场景添加元素或组合
  this.Scene.prototype.add = function (ele) {
    if (!ele) {
      return;
    }
    ele.belong = this;

    // 添加的元素是组合元素
    if (ele.isGroup) {
      // 提出组合里的元素归入场景
      this.elements.push(...ele.elements);
      return;
    }
    this.elements.push(ele);
  };
}
// 实现元素类
// vals:元素字符内容， style: 元素样式，z_index: 层叠优先级，position:位置
this.Element  = function(vals = [[]],style=[],z_index = 1,position) {
  // 元素随机id
  this.id = Number(Math.random().toString().substr(3,1) + Date.now()).toString(36);
  this.vals = vals;
  this.style = style;
  this.z_index = z_index;

  // 元素缩放值
  this.scale_x = 1;
  this.scale_y = 1;
  this.postion = {
    x: position && position.x ? position.x : 0,
    y: position && position.y ? position.y : 0
  }
  // 元素所属的组合
  this.group = null;
  // 元素所属的场景
  this.belong = null;
};