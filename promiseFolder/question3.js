console.log(".........Program started.........")



// here first promise is executed in 5 second then  2th executed after 2s  and then third after 10s
const myPromise= new Promise((resolve,reject)=>{
          setTimeout(() => {
            
             resolve({data:"Hello, Friend", error: null});
          }, 5000);
})

console.log("promise while :",myPromise);
console.log("program in progress")

myPromise.then((data)=>{ 
    console.log(data)
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
            resolve("First promise chain complete!")
        }, 2000);
      
    })
}).then((data)=>{
        console.log(data)
        return new Promise((resolve,reject)=>{
                    setTimeout(()=>{
                        resolve('Second promise chain complete!')
                    },10000)
        })
}).then((data)=>{

    console.log(data)

}).catch(()=>{
    console.log("failure")
})

