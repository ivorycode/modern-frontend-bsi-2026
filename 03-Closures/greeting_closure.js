let name = 'Bob';

function getGreetingClosure(currentName) {
    const text = 'Hello ' + currentName;
    return function() {
        console.log(text);
    };
}

const sayHello = getGreetingClosure(name);

name = "Tim";
sayHello();
