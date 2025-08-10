
//  this function try to fetch url even if its fails it  for a specific number of times
function fetchWithRetry(url, retries) {
    return new Promise((resolve, reject) => {
         async function attempts() {

            try {

                const res=await fetch(url);
                if(!res.ok){
                    throw new Error (`'error :{res.status}`)
                }

                const data=await res.json();
                resolve(data)
                
            } catch (error) {
                if(retries<5){
                    setTimeout(attempts,3000);
                }else{
                    reject("max tries reached out")
                }
            }
            
         }
         attempts();
    });
}

fetchWithRetry("https://jsonplaceholder.typicode.com/posts/2", 0)
    .then((data) => console.log( data))
    .catch((err) => console.error( err));
