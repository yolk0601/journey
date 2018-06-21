function func1 () {
  console.log('func1');
}
function func2 (func1){
  if( typeof func1 === "function") {
    console.log(typeof func1.nodeType !== "number")
    console.log('func1 is function ');
  } else {
    console.log(typeof func1.nodeType !== "number")
    console.log('func1 is not function');
  }
}
func2(func1)