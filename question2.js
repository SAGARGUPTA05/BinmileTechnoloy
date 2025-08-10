console.log("........Program started...........");

//  here one promise contains another promsie  first excute  after 3 seconds and then second execute after  3second 
const firstPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log("Step 1 complete");
        resolve();
    }, 3000);
});

console.log("Promise while pending:", firstPromise);
console.log("Program in progress");

firstPromise
    .then(() => {
        
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve("Step 2 complete");
            }, 3000);
        });
    })
    .then((data) => {
        console.log(data);
    })
    .catch(() => {
        console.log("Failure");
    });
