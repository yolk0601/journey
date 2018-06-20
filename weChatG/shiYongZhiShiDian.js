/* == 与 ===
== 会为比较对象转换类型
=== 不会转换类型。比较了类型也比较了数值
*/
"1" == 1
// true
"1"===1
// false
null == undefined
// true
null === undefined
// false
typeof null
// "object"
typeof undefined
// "undefined"

var obj = new Number (123)
obj == 123
// true
obj ===123
// false
/* 比较特殊点*/
NaN == NaN
// false
NaN === NaN
// false
/*
undefined是由Javascript运行时默认赋值给变量的，
null则是由程序员来显式赋值。当程序员给一个变量赋值为null时，通常表示这个变量已经不用了
*/