function aa (arr) {
  var min,temp;
  for (var outer = 0; outer <= arr.length-2; ++outer){
    min = outer;
    for (var inner = outer + 1; inner <= arr.length-1; ++ inner) {
      if (arr[inner] < arr[min]) {
        min = inner;
      }
    }
    temp = arr[outer];
      arr[outer] = arr[min];
      arr[min] = temp;
      console.log(arr)
  }
  return arr;
}
arr = [42,12,3,654,21,53,63,2,57,321];
arr = [42, 12,24]
console.log(aa(arr))

function bb (arr){
  for(var outer = arr.length; outer > 2; --outer) {
    for (var inner = 0 ; inner < outer-1; ++ inner){
      if (arr[inner] < arr[inner +1]) {
        var temp = arr[inner];
        arr[inner] = arr[inner +1];
        arr[inner+1] = temp;
      }
    }
  }
  return arr
}
console.log(bb([42,12,3,654,21,53,63,2,3,57,321]))

// 快速排序 递归   ====>  ？ 非递归会吗？
function kuaiSu(arr) {
  if (arr.length === 0) {
    return [];
  }
  var right = [];
  var left = [];
  var pivot = arr[0];
  for (var i = 1; i < arr.length; ++i ) {
    if (arr[i] <= pivot ) {
      right.push(arr[i]);
    } else {
      left.push(arr[i])
    }
  }
  return kuaiSu(right).concat(pivot, kuaiSu(left));
}
kuaiSu([42,12,3,654,21,53,63,2,3,57,321])

// 归并排序

function mergeSort(arr) {
  if (arr.length < 2) {
    return arr;
  }
  var step = 1;
  var left, right;
  while (step < arr.length) {
    left = 0;
    right = step;
    while(right + step <= arr.length){
      mergeArray(arr, left, left + step, right, right + step);
      left = right + step;
      right = left + step;
    }
  }
  if ( right < arr.length) {
    mergeArray(arr, left, left + step, right, right + step);
  }
  step *= 2;
}
function mergeArray (arr, startLeft, stopLeft, startRight, stopRight) {
  var rightArr = new Array(stopRight - startRight + 1);
  var leftArr = new Array(stopLeft - startLeft + 1);
  k = startRight;
  for (var i = 0; i < (rightArr.length-1); ++i) {
    rightArr[i] = arr[k];
    ++k;
  }
  k = startLeft;
  for(var i = 0; i < (leftArr.length-1); ++i) {
    leftArr[i] = arr[k];
    ++k;
  }
  rightArr[rightArr.length-1] = Infinity; // 哨兵值
  leftArr[leftArr.length-1] = Infinity; // 哨兵值
  var m = 0;
  var n = 0;
  for ( var k = startLeft ; k < stopRight ; ++k) {
    if (leftArr[m] <= rightArr[n]){
      arr[k] = leftArr[m];
      m++;
    } else {
      arr[k] = rightArr[n];
      n++;
    }
  }
  console.log("left array==> ", leftArr);
  console.log("right array==> ", rightArr);
}
var arr = [6, 10, 1, 9,4, 8, 7, 3, 5];
console.log(mergeSort(arr))

// 归并排序 可实现
// https://www.cnblogs.com/zichi/p/4796727.html
function merge(left, right) {
  var result = [];

  while (left.length && right.length) {
    if (left[0] < right[0])
      result.push(left.shift());
    else
      result.push(right.shift());
  }

  return result.concat(left, right);
}

function mergeSort(a) {
  if (a.length === 1)
    return a;

  var work = [];
  for (var i = 0, len = a.length; i < len; i++)
    work.push([a[i]]);

  work.push([]); // 如果数组长度为奇数

  for (var lim = len; lim > 1; lim = ~~((lim + 1) / 2)) {
    for (var j = 0, k = 0; k < lim; j++, k += 2) 
      work[j] = merge(work[k], work[k + 1]);

    work[j] = []; // 如果数组长度为奇数
  }

  return work[0];
}

console.log(mergeSort([1, 3, 4, 2, 5, 0, 8, 10, 4]));
