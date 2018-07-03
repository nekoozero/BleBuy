//商品的构造函数
function Goods(name,price,num){
  this.goosname = name;
  this.price = price;
  this.number=num;
}



module.exports = {
  Goods: Goods
}