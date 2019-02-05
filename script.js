const puppeteer = require('puppeteer');

(async () => {
  // Launch a browser: {headless:false} => see the UI of Chrome 
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  await page.goto('https://edition.cnn.com');
  await page.screenshot({path: 'example.png'});

  console.log('screenshot done')
  

  // Wait to have at least 1 DOM element that match the selector
  await page.waitForSelector('.cd__headline > a')
  // page.$$ is an equivalent of document.querySelectorAll: https://pptr.dev/#?product=Puppeteer&version=v1.12.1&show=api-pageselector-1
  let $headlineTitles = await page.$$('.cd__headline > a')
  
  let titles = await page.$$eval('.cd__headline > a', $as => [...$as].map($a => $a.innerText))
  let hrefs = await page.$$eval('.cd__headline > a', $as => [...$as].map($a => $a.getAttribute('href')))

  console.log('TCL: titles', titles)
  console.log('TCL: hrefs', hrefs)

  await page.waitFor(5000)

  await browser.close();
})();

// (async () => {
//   puppeteer.launch({headless:false})
//   .then(async (browser) => {
//     const page = await browser.newPage();
//     await page.goto('https://edition.cnn.com');
//     await page.screenshot({path: 'example.png'});
  
//     await browser.close();
//   })

// })();