function transformStr3(str){
    var re=/-(\w)/g;
    return str.replace(re,function ($0,$1){
      console.log($0);
      console.log($1);
      return $1.toUpperCase();
    });
}
