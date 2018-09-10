// 学习代码
// 创建事件发射器：一个pub|sub 例子
var EventEmitter = require('events').EventEmitter
var channel = new EventEmitter();
// 事件监听，事件名称是 join
channel.on('join', function () {
    console.log('welcome!')
})
// 事件触发， 触发 join事件
channel.emit('join')
// 事件：
/*
事件 只是个键， 可以是任何字符串， data, join 或者 某些 其他的自己命名的很长的
除了   error  这个错误事件
*/
