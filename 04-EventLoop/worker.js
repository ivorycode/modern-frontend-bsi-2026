onmessage = function (ev) {
  var result =  fibonacci(ev.data.number)
  postMessage(result);
}


function fibonacci(n) {
  if (n < 2)
    return 1;
  else
    return fibonacci(n - 2) + fibonacci(n - 1);
}