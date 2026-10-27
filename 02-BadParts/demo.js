

function doIt(myInput){
    const result = (myInput === false);   
    return result;  
}

const res1 = doIt(true);
const res2 = doIt(false);

console.log('Result', res1, res2);