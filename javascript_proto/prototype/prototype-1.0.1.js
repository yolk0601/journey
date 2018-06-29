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
huangtao