
// this fnction tries to reject is all urls gotb reject else if first is fetched it resolve 
function fetchAnyWithErrors(urls) {
    return new Promise((resolve, reject) => {
        let errors = [];
        let count = 0;
        let resolved = false;

        urls.forEach((url, index) => {
            fetch(url)
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`error ${res.status}`);
                    }
                    return res.json();
                })
                .then(data => {
                    if (!resolved) {
                        resolved = true;
                        resolve(data);
                    }
                })
                .catch(err => {
                    errors[index] = err.message;
                    count++;

                    if (count === urls.length && !resolved) {
                        reject(new Error(errors));
                    }
                });
        });
    });
}

fetchAnyWithErrors([
    "https://invalid-url.com", 
    "https://jsonplaceholder.typicode.com/posts/1"
])
.then(data => console.log(data))
.catch(err => console.error( err.message));
