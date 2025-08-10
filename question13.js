  // if all urls feching failed  it will reject  else if will return the fetch data

function fetchWithFallback(urls) {
  return new Promise(async (resolve, reject) => {
    let result = [];
    let errorcount=0;

    for (let i = 0; i < urls.length; i++) {
      try {
        const res = await fetch(urls[i]);
        if (!res.ok) {
          throw new Error(`'error: ${res.status}`);
        }

        const data = await res.json();
        result.push(data);
      } catch (error) {
        errorcount++;
       
      }
    }
     if (errorcount === urls.length) {
          reject(`all  fetch failed`);
        }else{
            resolve(result)
        }
  });
}

fetchWithFallback([
  "https://jsonplaceholder.typicode.com/posts/2",
  "https://jsonplaceholder.typicode.com/posts/3",
  "https://jsonplaceholder.typicode.com/posts/4",
])
  .then((data) => {
    console.log(data);
  })
  .catch((data) => {
    console.log(data);
  });
