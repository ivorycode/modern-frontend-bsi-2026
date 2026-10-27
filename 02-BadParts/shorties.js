0 == 0
0 == '0'
0 == ''

false == false
false == 'false'
false == '0'

true == '1'
true == '2'

"\n \t" == 0

var myArray = [0]; 
myArray == myArray; 
myArray == !myArray

var myArray = [null, undefined, []]; 
myArray == ',,'

NaN === NaN
NaN !== NaN
typeof NaN

0.1 + 0.2
((0.1 + 0.2) + 0.3)
(0.1 + (0.2 + 0.3))

Math.min() < Math.max()

parseInt("12 Monkeys")

var ar = ['i', 'j', 'k'];
for(v in ar){ console.log(v) };


var print = function(v){console.log(v); return v;};
['10', '10', '10'].map(print);
['10', '10', '10'].map(parseInt);	


console.log('😀'.length); // unicode chars use 2 bytes
 
console.log(new Date(2016, 5, 31)); // months are zero based, days can overflow

console.log([10,5,1].sort()); //default comarator is string based

console.log((function foo(a,b){}).length); // number of arguments
