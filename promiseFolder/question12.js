//try to fetch url  within the fixed number of tries

function fetchWithExponentialBackoff(url, maxRetries) {
  let tries = 0;

  return new Promise((resolve, reject) => {
    async function attempts() {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`error ${res.status}`);

        const data = await res.json();
        resolve(data);
      } catch (err) {
        if (tries < maxRetries) {
          const delay = Math.pow(2, tries) * 1000;
          tries++;
          console.log(`retry ${tries} after ${delay}ms`);
          setTimeout(attempts, delay);
        } else {
          reject(`max tries reach out ${err.message}`);
        }
      }
    }

    attempts();
  });
}

fetchWithExponentialBackoff("https://jsonplaceholder.typicode.com/posts/2", 3)
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log(err);
  });
