//this function tries to fetch data in sequence 

function fetchSequentially(urls) {
  return new Promise(async (resolve, reject) => {
    let result = [];

    try {
      for (let url of urls) {
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`error: ${res.status}`);
        }

        const data = await res.json();
        result.push(data);
      }

      resolve(result)
    } catch (error) {
      reject(error.message);
    }
  });
}

fetchSequentially([
  "https://jsonplaceholder.typicode.com/posts/1",
  "https://jsonplaceholder.typicode.com/posts/2",
])
  .then((data) => {
    console.log(data);
  })
  .catch((data) => {
    console.log(data);
  });
