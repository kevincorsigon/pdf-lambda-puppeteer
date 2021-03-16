const getHtmlContentFromUrl = function(url) {
  return new Promise<Buffer>((resolve, reject) => {
  
    let client = url.toString().indexOf("https") === 0 ? require('https') : require('http');

    client.get(url, (resp) => {
      let chunks = [];

      resp.on('data', (chunk) => {
        chunks.push(chunk);
      });

      resp.on('end', () => {
        resolve(Buffer.concat(chunks));
      });

    }).on("error", (err) => {
      reject(err);
    });
  });
}

export const getTemplate = async (url: string) => {
  return await getHtmlContentFromUrl(url).then(buf => {
    return buf.toString('utf-8');  
  })  
};
