function CArray ( numElements ) {
  this.dataStore = [];
  this.pos = 0;
  this.numElements = numElements;
  this.clear = clear;
  this.insert = insert;
  this.swap = swap;
  this.toString = toString;
  this.setData = setData;
  for (let i = 0; i < numElements; ++i ) {
    this.dataStore[i] = i;
  }
}

function setData () {
  console.log(this);
  for (let i = 0, le = this.numElements; i < le; i++ ) {
    this.dataStore[i] = Math.floor( Math.random() * ( this.numElements + 1 ) );
    this.pos = i;
  }
}

function clear () {
  for ( let i = 0, le = this.dataStore.length; i < le; i++ ) {
    this.dataStore[i] = 0;
  }
}

function insert ( element ) {
  this.dataStore[this.pos ++ ] = element;
}

function toString () {
  var retStr = "";
  for ( let i = 0, le = this.dataStore.length; i < le; i++) {
    retStr += this.dataStore[ i ] + " ";
    if( i > 0 & i%10 == 0) {
      retStr += "\n";
    }
  }
  return retStr;
}

function swap ( arr, index1, index2 ) {
  var temp = arr[ index1 ];
  arr[ index2 ] = arr[ index1 ];
  arr[ index2 ] = temp;
}

// 自动化测试该 对象
// var numElements = 100;
// var myNums = new CArray(numElements);
// console.log(myNums.toString());
// myNums.setData();
// console.log(myNums.toString());