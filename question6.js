//  this  function first try to save all urls  data and then resolve and 
// if one of the url  occur error it will  reject the process
function fetchAllWithErrors(urls) {  
    return new Promise((resolve, reject) => {
        let results = [];
        let completed = 0;
        let hasError = false;

        urls.forEach((element, index) => {
            fetch(element)
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`Error: ${res.status}`);
                    }
                    return res.json();
                })
                .then(data => {
                    results[index] = data;
                    completed++;

                 
                    if (completed === urls.length && !hasError) {
                        resolve(results);
                    }
                })
                .catch(err => {
                    if (!hasError) { 
                        hasError = true;
                        reject(err);
                    }
                });
        });
    });
}

fetchAllWithErrors(["https://jsonplaceholder.typicode.com/posts/1", "https://jsonplaceholder.typicode.com/posts/2"])
.then(data => {
    console.log( data);
})
.catch(error => {
    console.error(error.message);
});
