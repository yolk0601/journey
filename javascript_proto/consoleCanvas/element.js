// 实现元素类
// vals:元素字符内容， style: 元素样式，z_index: 层叠优先级，position:位置
this.Element = function(vals = [[]],style=[],z_index = 1,position) {
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
// 给element类添加操作方法
this.Element.prototype.clone = function () {
  return new this.constructor(JSON.parse(JSON.stringify(this.vals)), this.style.concat(), this.z_index, this.position);
};
// 元素删除
this.Element.prototype.remove = function (){
  // 获取元素所属场景
  let scene = this.group ? this.group.belong : this.belong;

  // 根据元素id从场景中查询到该元素index
  let index = scene.elements.findIndex((ele) => {
    return ele.id === this.id;
  });
  if (index >= 0) {
    //从场景中去除该元素项
    scene.elements.splice(index, 1);
  }
};
// 元素获取宽度或者设置宽度(裁剪宽度)
this.Element.prototype.width = function (width) {
  width  = parseInt(width);
  if(width && width > 0) {
    // 设置宽度，只用于裁剪，拓宽无效
    for (let j = 0, le = this.vals.length; i < le; j++) {
      this.vals[j].splice(width);
    }
    return width;
  } else {
    // 获取宽度
    return Math.max.apply(null, this.vals.map((v) => {
      return v.length;
    }));
  }
};
this.Element.prototype.height = function (height) {
  height = parseInt(height)
  if (height && height > 0) {
    // 设置高度，只用于裁剪，拓宽无效
    this.vals.splice(height);
    return height;
  } else {
    // 获取高度
    return this.vals.length;
  }
};
this.Element.prototype.scaleX = function (multiple, flag) {
  let scaleY = this.scale_y;
  multiple = +multiple;
  if (this.valsCopy){
    this.vals = JSON.parse(JSON.stringify(this.valsCopy));
  } else {
    // 首次使用时，保存原图副本
    this.valsCopy = JSON.parse(JSON.stringify(this.vals));
  }
  if (!flag) {
    // 使用原始图案重新缩放纵坐标(避免失真)，flag用于避免循环嵌套
    this.scaleY(this.scale_y, true);
  }
  if (multiple < 1) {
    for (let j = 0, le = this.vals.length; j < le; j++) {
      for (let i = 0, leItem = this.vals[j].length; i < leItem; i ++){
        [this.vals[j][Math.ceil(i * multiple)], this.vals[j][i]] = [this.vals[j][i], ' '];
      }
    }
    // 裁去缩小后的多余部分
    for (let j = 0, le = this.vals.length; j < le; j ++) {
      this.vals[j].splice(Math.ceil(this.vals[j].length * multiple));
    }
    this.scale_x = multiple;
  } else if (multiple > 1) {
    for (let j = 0, le = this.vals.length; j < le; j++) {
      for (let i = this.vals[j].length-1; i > 0; i--) {
        [this.vals[j][Math.ceil(i * multiple)], this.vals[j][i]] = [this.vals[j][i], ' '];
      }
    }
    // 填充放大后的未定义像素
    for (let  j =0, le = this.vals.length; j< le; j++) {
      for (let i = this.vals[j].length-1; i > 0; i--) {
        if (this.vals[j][i] === undefined) {
          this.vals[j][i]= ' ';
        }
      }
    }
    this.scale_x = multiple;
  } else {
    this.scale_x = 1;
    return ;
  }
};
this.elements.prototype.scaleY = function (multiple, flag) {
  multiple = +multiple;
  if (this.valsCopy) {
    // 每次变换使用原始图案
    this.vals = JSON.parse(JSON.stringify(this.valsCopy));
  }
};