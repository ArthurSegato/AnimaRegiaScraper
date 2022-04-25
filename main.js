/*
*   LIBRARIES
*/
const fs = require('fs');
const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
/*
*   VARIABLES
*/
// From which chapter this script should start downloading
const startChapter = 518;
// Until which chapter the program should download
const endChapter = 682;
/*
*   FUNCTIONS
*/
// Function to pause execution for a while
const delay = ms => new Promise(res => setTimeout(res, ms));
// Create a folder for the current chapter
const Create_Folder = function(currentChapter){
  // Path for the parent folder
  const parentFolderPath = `downloaded_chapters`;
  // Generate a folder path for the actual chapter based on the parent path
  const chaptersFolderPath = `${parentFolderPath}/${currentChapter}`;
  // Verify if the parent folder already exists, if not, create one and display a message on console
  if(!fs.existsSync(parentFolderPath)){
    fs.mkdirSync(parentFolderPath);
    console.info("Parent folder created.");
  }
  // Verify if a folder for the current chapter already exists, if not, create one and display a message on console
  if(!fs.existsSync(chaptersFolderPath)){
    fs.mkdirSync(chaptersFolderPath);
    console.info(`${currentChapter} folder created.`);
  }
}
// Extract the name of the current chapter
const Get_Chapter_Name = function(stringHTML){
  // Convert the html of the page from string to DOM
  const domHTML = new JSDOM(stringHTML);
  // Extract a list from the DOM
  const stringList = domHTML.window.document.querySelector("li#chapter-list").innerHTML;
  // Convert the list to DOM
  const domList = new JSDOM(stringList);
  // Entract the active list item from DOM
  const stringLinks = domList.window.document.querySelector("li.active").innerHTML;
  // Convert the list item to DOM
  const domLinks = new JSDOM(stringLinks);
  // Extrat the chapter title from the html tag
  const chapterTitle = domLinks.window.document.querySelector("a").innerHTML;
  // return the title, after removing the chapter number
  return chapterTitle.split(": ").pop();
}
// Extract the url of the chapter pages
const Get_Chapter_Pages = function(stringHTML, currentChapter){
  // Convert the html page from string to DOM
  const domHTML = new JSDOM(stringHTML);
  // Extracts the list of image from a div
  const imageList = domHTML.window.document.querySelector("div#all").children;
  // Call a function to download the images from the list above
  for(let i = 0; i < imageList.length; i++){
    Donwload_Images(imageList[i].getAttribute("data-src"), `downloaded_chapters/${currentChapter}/${i}.jpg`);
  }
}
// Download all the pages to the chapter folder
async function Donwload_Images(url, image_path){
  // Wait some seconds to avoid get fucked by cloudflare
  await delay(2000);
  // Requests the image
  axios({
    url,
    responseType: 'stream',
  }).then(
    response =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(image_path))
          .on('finish', () => resolve())
          .on('error', e => reject(e));
      }),
  );
}
// Acess Anima Regia website
(async () => {
  // Create all the chapters folders first
  for(let currentChapter = startChapter; currentChapter <= endChapter; currentChapter++){
    Create_Folder(currentChapter);
  }
  // Acess all the chapters of the manga
  for(let currentChapter = startChapter; currentChapter <= endChapter; currentChapter++){
    // Requests the website html
    axios
      .get(`http://animaregia.net/manga/yowamushi-pedal-ptbr/${currentChapter}/1`)
      .then(res => {
        Get_Chapter_Name(res.data);
        Get_Chapter_Pages(res.data, currentChapter);
      })
      .catch(error => {
        console.error(error);
      })
      await delay(2000);
      console.info(`Donwloaded chapter: ${currentChapter}`);
  }
})();