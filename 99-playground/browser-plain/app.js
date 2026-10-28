console.log("Running example !!!");
// alert("Watch the console!");

/// Demo API:
// https://swapi.info/api/people/1



const source =
    rxjs.fromEvent(
        document.getElementById('demo'),'click'
    );

const {filter, map, mergeMap, tap} = rxjs.operators;

// const source = rxjs.interval(1000);

const observable = source.pipe(
    map((x) => x.clientX),
    map((x) => x + 1),
    tap((x) => console.log(x)),
    mergeMap((x) => axios.get(`https://swapi.info/api/people/${x}`)),
    map((x) => x.data.name),
    // filter((x) => x % 2 === 0)
);

observable.subscribe(
    (x) => console.log(x),
    (err) => console.error(err),
    () => console.log('Completed')
);


console.log('Finished?', rxjs);


