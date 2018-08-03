function foo (num) {
  console.log("foo：", num)
  console.log(this) // window
  console.log('before', this.count)
  this.count ++;
  console.log('after', this.count)
}
foo.count = 0;
// console.log('foo.proto：',  foo);
// console.log('foo.type', typeof foo);
var i;
for (i =0; i < 10; i++) {
  if (i > 5) {
    foo(i);
  }
}

console.log(foo.count)

// 词法作用域 替换
function foo (num) {
  console.log("foo：", num)
  console.log(this) // window
  console.log('before', data.count)
  data.count ++;
  console.log('after', data.count)
}
data = {
  count: 0
}
var i;
for (i =0; i < 10; i++) {
  if (i > 5) {
    foo(i);
  }
}
console.log(data.count)

// 具项函数
function foo() {
  foo.count = 4; // foo 指向它自身
  console.log(count)
}
setTimeout (function () {
  // 匿名函数 无法志向自身
}, 10)

// foo的词法作用域
function foo (num) {
  console.log("foo：", num)
  console.log('before', foo.count)
  foo.count ++;
  console.log('after', foo.count)
}
foo.count = 0;
// console.log('foo.proto：',  foo);
// console.log('foo.type', typeof foo);
var i;
for (i =0; i < 10; i++) {
  if (i > 5) {
    foo(i);
  }
}

console.log(foo.count)

// 强制指向 foo函数
function foo (num) {
  console.log("foo：", num)
  console.log('before', this.count)
  this.count ++;
  console.log('after', this.count)
}
foo.count = 0;
// console.log('foo.proto：',  foo);
// console.log('foo.type', typeof foo);
var i;
for (i =0; i < 10; i++) {
  if (i > 5) {
    foo.call(foo, i);
  }
}

console.log(foo.count)


var a = 1
function baz () {
  console.log('baz:a', this.a)
}
function bar () {
  var a = 2;
  // baz();
  function bax () {
    console.log('aaa', this.a)
  }
  console.log('a:', this.a);
  bax();
}
bar();

