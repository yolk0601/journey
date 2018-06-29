function CArray ( numElements ) {
  this.dataStore = [];
  this.pos = 0;
  this.numElements = numElements;
  for (let i = 0; i < numElements; ++i ) {
    this.dataStore[i] = i;
  }
}
CArray.prototype = new Array();
CArray.prototype.clear = function () {
  for ( let i = 0, le = this.dataStore.length; i < le; i++ ) {
    this.dataStore[i] = 0;
  }
}

CArray.prototype.setData = function () {
  console.log(this);
  for (let i = 0, le = this.numElements; i < le; i++ ) {
    this.dataStore[i] = Math.floor( Math.random() * ( this.numElements + 1 ) );
    this.pos = i;
  }
}

CArray.prototype.insert = function ( element ) {
  this.dataStore[this.pos ++ ] = element;
}

CArray.prototype.toString = function () {
  var retStr = "";
  for ( let i = 0, le = this.dataStore.length; i < le; i++) {
    retStr += this.dataStore[ i ] + " ";
    if( i > 0 & i%10 == 0) {
      retStr += "\n";
    }
  }
  return retStr;
}

CArray.prototype.swap = function ( arr, index1, index2 ) {
  var temp = arr[ index1 ];
  arr[ index1 ] = arr[ index2 ];
  arr[ index2 ] = temp;
}

// 冒泡排序
CArray.prototype.bubbleSort = function () {
  var numElements = this.dataStore.length;
  console.log(this.dataStore.length);
  for( let outer = numElements ; outer >= 2; --outer) {
    for( let inner = 0; inner < outer - 1; ++inner ) {
      if ( this.dataStore[ inner ] > this.dataStore[ inner + 1 ] ) {
        this.swap(this.dataStore, inner, inner + 1);
        // console.log('%cCISHU==> ', 'color: #fff; background:#000', inner, '数据==》', this.dataStore);
      }
    }
    console.log(this.dataStore)
  }
}

// 选择排序
CArray.prototype.selectionSort = function() {
  var min, temp;
  for ( let outer = 0, len = this.dataStore.length-2; outer <= len; ++outer) {
    min = outer;
    for ( let inner = outer + 1; inner <= this.dataStore.length-1; ++inner) {
      if ( this.dataStore[inner] < this.dataStore[min] ) { 
        min = inner;
      }
    }
    this.swap(this.dataStore, outer, min);
  }
}
// 快速排序
// CArray.prototype.quickSort = function() {
//   if (this.dataStore.length === 0) {
//     return [];
//   }
//   var right = new CArray(),
//       left = new CArray(),
//       pivot = this.dataStore[0];
//   for (var i = 1, len = this.dataStore.length; i < len; i++) {
//     if (this.dataStore[i] < pivot) {
//       right.push(this.dataStore[i]);
//     } else {
//       left.push(this.dataStore[i]);
//     }
//   }
//   console.log('right==》', right);
//   console.log('left == > ', left);
//   return right.quickSort().concat(pivot, left.quickSort());    
// }
// 自动化测试该 对象
var numElements = 11;
var myNums = new CArray(numElements);
myNums.setData();
console.log(myNums.toString());
// myNums.bubbleSort();
myNums.quickSort();
console.log(myNums.toString());
