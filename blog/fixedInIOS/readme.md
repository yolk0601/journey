#### fixed布局在ios机器上有很多问题

##### 总结问题： 
1. fixed在某些情况下可能导致容器内的子元素的1px边框线消失，即使使用z-index也无法解决。
解决方法：可以使用translateZ属性来解决。(未复现该bug)
2. fixed定位的容器内不能带有input，这是常见的bug。
解决方法： 在input聚焦的时候去掉fixed定位状态，改为absolute。
3. fixed＋可滚动的容器内会导致fixed定位的子元素在滚动时定位失效，滚动完成后才正常回到fixed的位置。
解决方法：尽量不要在可滚动的容器内包含fixed定位的子元素。
4. ios不支持onresize事件
5. 开发移动端页面时使用固定定位position:fixed时会出现的问题：页面滑动失去惯性，即当我们滑动页面后松开手指，页面会立即停止。
6. 开发移动端页面时使用固定定位position:fixed时会出现的问题：使用fixed定位的元素会随着页面的滑动而抖动的像是犯病了一样。
7. 在ios中，position:fixed的效果并不理想，最突出的莫过于 底部固定定位+input出现的问题


#### 解决方案

###### 1. 滑动无惯性
-webkit-overflow-scroll:touch解决滑动无惯性 
哪个元素/页面使用了fixed定位，就给哪个元素添加该属性。