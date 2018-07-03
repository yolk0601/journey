// 寄生构造函数
function Person (name, age, job) {
  var  o = new Object();
  o.name = name;
  o.age = age;
  o.job = job;
  o.sayName = function () {
    return this.name
  };
  return o;
}
var p = new Person("huangtao", "123", "huds");
p
// 寄生构造函数 写法 与工厂模式类似。
// 其中的不同点有： 工厂模式只是一个函数，而不是构造函数
// 2. 工厂模式不需要使用 new 操作符来初始化对象
function factory (name, age, job) {
  var o = new Object();
  o.name = name;
  o.age = age;
  o.job =job;
  o.sayName = function () {
    return this.name;
  }
  return o;
}
var f = factory('hello',12, 'work');
f

// 稳妥构造函数
// 1. 没有公共属性 2. 不引用this 3. 不使用new
// 类似基本包装类型的情况  ==>  var n = Number(1);
function Person(name, age, job){
  var o = new Object();
  o.sayName = function () {
    return name;
  }
  return o;
}
var p = Person('haungtao', 12, 'woek');
p

// 如果用 for in 循环数组，会出现一些问题，removebyvalue 出现。
var arr = [{a:"123"},{a:"1232"},{a:"125"},{a:"126"}]
for (var item in arr) {
  console.log(item);
  console.log(arr[item]);
}

// 原型链继承
function SuperType () {
  this.property = true;
  this.color = ['red', 'yellow'];
}
SuperType.prototype.getSuperValue = function () {
  return this.property;
}
function subType () {
  this.subProperty = false;
}
subType.prototype = new SuperType();
subType.prototype.getSubValue = function () {
  return this.subProperty;
}
var instance1 = new subType();

instance1.property =false;
instance1.color.push('blue');
instance1; 
// color 属性还在原型上面
var instance2 = new subType();
instance2;
// color 属性还在原型上面

// 借用构造函数，实现继承
function superType () {
  this.color = ["red", "blue", "green"];
}
function subType () {
  superType.call(this);
  this.age =12; 
}
var  p1 = new subType();
p1.color.push("yellow");
p1;
// color属性被领出来到实例上面了。
var p2= new subType();
p2
