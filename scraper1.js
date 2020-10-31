const puppeteer = require('puppeteer');
const connection = require('./moviesDB');
const mysql = require('mysql');

const movies = [];

async function getElText(page, selector) {
  return await page.evaluate((selector) => {
    return document.querySelector(selector).innerText
  }, selector);
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const navigationPromise = page.waitForNavigation();

  // Write your code here
  await navigationPromise;

  await page.goto('https://www.youtube.com/watch?v=ZtYTwUxhAoI');
  await page.waitForSelector('h1.title');

  await page.evaluate(_ => {
  window.scrollBy(0, window.innerHeight);
  });
  // await page.waitForTimeout(2000);
  await page.waitForSelector('#comments');


  const comments = [];
  for (let i = 1; i < 100; i++) {
    const authorSelector = `.style-scope:nth-child(${i}) > #comment > #body > #main > #header > #header-author > #author-text > .style-scope`
    const commentSelector = `.style-scope:nth-child(${i}) > #comment > #body > #main > #expander #content-text`;
    await page.waitForSelector(commentSelector);
    await page.waitForSelector(authorSelector);
    const commentText = await getElText(page, commentSelector);
    const author = await getElText(page, authorSelector);

    if (commentText) {
      // write each comment to DB or file
      // or batch the for processing later
      console.log(`${author}: ${commentText}`);
      comments.push(commentText);

      const movie = { author, commentText };
      movies.push(movie);

      var newmovie  = {c_nickname:movie.author, c_value:movie.commentText};

      connection.query("INSERT INTO comments SET ?", newmovie, (err,rows) => {
          if(err) 
          {
            console.log("Error in SQL");
            console.log('\n');
            console.error(err.message);
            //throw err;
          }
          else 
          {
            console.log('Movie:\n');
            console.log(rows);
          }


        });

    }


  }

  // await browser.close();
})()