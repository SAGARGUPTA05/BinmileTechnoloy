// this function is try to fetch url within the specific  time period
function  fetchWithTimeout(url,timeout){
   

    return new Promise((resolve,reject)=>{
          
          
                fetch(url).then((res)=>{
                      
                        resolve(res.json())
                }).catch(()=>{
                       reject("rejected")
                })

                setTimeout(() => {
                      
                        reject("timeout error")
                }, timeout);

           
    })

}


fetchWithTimeout("https://jsonplaceholder.typicode.com/posts/1",3000).then((data)=>{ console.log(data)}).catch((data)=>{ console.log(data)})