function Person(){

}
Person.prototype.name="name";
Person.prototype.age= "26";
Person.prototype.job="qianduan";
Person.prototype.sayName = function(){
  console.log(this.name);
}
var huangtao  = new Person();
huangtao.name = 'huangtao'
var key = Object.keys(Person.prototype)
key
var key1 = Object.keys(huangtao)
key1
var key1_1 = Object.getOwnPropertyNames(huangtao)
key1_1
huangtao

function Person1(){}
Person1.prototype = {
  name:"name",
  age: "12",
  job:"work",
  sayName:function (){
    return this.name;
  }
}
var p = new Person1();
p

// 重写原型对象
function Person() {
}
Person.prototype = {
  name: "name",
  age: '32',
  sayName: function () {
    return this.name;
  }
}
var p = new Person();
p.sayName()

// 基本包装类上 添加 方法
String.prototype.startWith= function (){
  console.log(this[0].toUpperCase())
  return this[0].toUpperCase()+this.substring(1)
}
var str = "bsssd";
str.startWith()

// 构造函数 定义实例属性  原型 定义方法+共享属性
function Person () {
  this.name= "your name";
  this.age = "20";
  this.work = "freedom";
}
Person.prototype = {
  constructor: Person,
  sayname: function () {
    return this.name;
  }
}
var p = new Person();
p.name = "huangtao"
p.name

