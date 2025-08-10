function batchFetch(urls, batchSize) {
  return new Promise((resolve, reject) => {
    let results = [];

    function fetchUrl(url) {
      return fetch(url).then((res) => {
        if (!res.ok) throw new Error(`error ${res.status}`);
        return res.json();
      });
    }

    async function batches() {
      try {
        for (let i = 0; i < urls.length; i += batchSize) {
          const batch = urls.slice(i, i + batchSize);
          const arrOfBatch = [];
          for (let url of batch) {
            const data = await fetchUrl(url);
            arrOfBatch.push(data);
          }
          results.push(arrOfBatch);
        }
        resolve(results);
      } catch (err) {
        reject(err.message);
      }
    }

    batches();
  });
}

batchFetch(
  [
    "https://jsonplaceholder.typicode.com/posts/2",
    "https://jsonplaceholder.typicode.com/posts/3",
    "https://jsonplaceholder.typicode.com/posts/4",
    "https://jsonplaceholder.typicode.com/posts/5",
    "https://jsonplaceholder.typicode.com/posts/6",
  ],
  2
)
  .then((data) => {
    console.log("All results:", data);
  })
  .catch((err) => {
    console.log("Error:", err);
  });
