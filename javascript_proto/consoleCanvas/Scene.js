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