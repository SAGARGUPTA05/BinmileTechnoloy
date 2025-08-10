console.log("......Program started...........");


// create a promise which   resolve afet 3 seconds and reject after 2 seconds
const checkPromise = new Promise((resolve, reject) => {
    let check = false;
    
    if(check==false){
    setTimeout(() => { 
        
        reject();
    }, 2000);
}
     else{
    setTimeout(() => { 
            resolve();
    }, 3000);
}
});

console.log("Program in pending: ",checkPromise);
console.log("Program in progress");

checkPromise
    .then(() => { 
        console.log("Program complete"); 
    })
    .catch(() => { 
        console.log("Program failure"); 
    });
