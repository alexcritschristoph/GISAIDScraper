/**
 * @name gisaid 
 *
 * @desc Logs into Gisaid. Provide your username and password as environment variables when running the script, i.e:
 * `GISAID_USER=myuser GISAID_PWD=mypassword node gisaid.js`
 *
 */

const fs = require('fs');
const puppeteer = require('puppeteer');
const util = require('util');

var glob = require("glob")

const files = glob.sync('./fasta/*.fasta');

const file_content = fs.readFileSync("metadata.tsv").toString()
var x = file_content.split('\n');
console.log(files);

urls = []
for (var i=0; i<x.length; i++) {
    y = x[i].split('\t')
    if (i > 0 && y.length > 2) {
      url = y[2].split("_").pop();
      id = url.split("/").pop();
      if ( ! files.includes("./fasta/" +id+'.fasta')){
        urls.push(url)
      }        
    }
}


const screenshot = 'gisaid.png';
(async () => {
  const browser = await puppeteer.launch({headless: true})
  const page = await browser.newPage()
  console.log('Username: ' + process.env.GISAID_USER)
  console.log('Password: ' + process.env.GISAID_PWD)
  await page.goto('https://platform.gisaid.org/epi3/start/EPI_ISL/410540')
  await page.waitForNavigation()
  await page.type('#elogin', process.env.GISAID_USER)
  await page.type('#epassword', process.env.GISAID_PWD)
  await page.waitForSelector('input[value="Login"]');
  await page.click('[value="Login"]')
  await page.waitForNavigation()

  for (url of urls) {
    id = url.split("/").pop()
    path = "fasta/" + id + ".fasta"
    if (!fs.existsSync(path)) {
      await page.goto("https://platform.gisaid.org/epi3/start/EPI_ISL/" + url)
      await page.waitForNavigation({ waitUntil: 'networkidle0' })
      await page.waitFor(2000);
      await page.waitForXPath("//iframe");
      console.log('Downloading: ' + url)
      const frame = await page.mainFrame().childFrames()[0]
      await frame.waitForXPath("//pre");
      const [lol] = await frame.$x("//pre")
      const text = await frame.evaluate(element => element.textContent, lol)
      fs.writeFileSync("fasta/" + id + ".fasta", text)
    }
  }
 
  browser.close()
})()
