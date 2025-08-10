//condition fetch on the basis of first url fetching is it's feching successful it will fetch 3rd url else 2 url only

function conditionalChaining(firstUrl, secondaryUrls) {
  return new Promise(async (resolve, reject) => {
    try {
      let result = [];
      const res = await fetch(firstUrl);

      if (!res.ok) {
        const secondRes = await fetch(secondaryUrls[0]);
        if(!secondRes.ok)
        {
            throw new Error(`error ${secondRes.status}`)
        }
        const secondData = await secondRes.json();
        result.push(secondData);
      } else {
        const firstData =await  res.json();
        const thirdRes = await fetch(secondaryUrls[1]);
        if(!thirdRes.ok)
        {
            throw new Error(`error ${thirdRes.status}`)
        }
        const thirdData = await thirdRes.json();
        result.push(firstData);
        result.push(thirdData);
      }

      resolve(result);
    } catch (error) {
      reject(error.message);
    }
  });
}

conditionalChaining("https://jsonplaceholder.typicode.com/posts/1", [
  "https://jsonplaceholder.typicode.com/posts/2",
  "https://jsonplaceholder.typicode.com/posts/3",
])
  .then((data) => {
    console.log(data);
  })
  .catch((data) => {
    console.log(data);
  });
