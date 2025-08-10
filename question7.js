//this function try to fetch urls in  fixed timeperiod is  if fetch data within time period is resolve else reject

function fetchWithRace( urls,timeout)
 {
     return new Promise(( resolve,reject)=>{


        let timebond= setTimeout(() => {
              reject(new Error(`time error`))
        }, timeout);
    

    urls.map((elem)=>{
        fetch(elem).then( res=>{
            if(!res.ok){
                throw new Error(`Error: ${res.status}`)
            }
          return   res.json();
        }).then((data)=>{
             clearTimeout(timebond);
            resolve(data)

        }).catch((err)=>{

            
                reject("error while fetching")
            
        })

      
    })
     })
 }

 fetchWithRace(["https://jsonplaceholder.typicode.com/posts/1", "https://jsonplaceholder.typicode.com/posts/2"],1000).then((data)=>{
    console.log(data);
 }).catch((data)=>{
    console.log(data)
 })