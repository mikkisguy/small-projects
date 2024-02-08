import "./style.css";
import { Welcome } from "./dataTypes";
import clouds from "./images/clouds-unsplash.jpg";

const APP_ID = import.meta.env.VITE_APP_ID;
const API_KEY = import.meta.env.VITE_API_KEY;

const fetchYleData = async (pageNumber: number): Promise<Welcome> => {
  const response = await fetch(
    `https://external.api.yle.fi/v1/teletext/pages/${pageNumber}.json?app_id=${APP_ID}&app_key=${API_KEY}`
  );

  return await response.json();
};

const getArticles = async (from: number, to: number) => {
  let newsArtciles = [];

  for (let i = from; i <= to; i++) {
    const articleData: Welcome = await fetchYleData(i);
    const articleLines = articleData.teletext.page.subpage[0].content[0].line;

    let article = {
      header: "",
      content: "",
    };

    articleLines.forEach((line, i) => {
      const skipIDs = [0, 1, 3, 4];
      const headerID = 2;

      if (!skipIDs.includes(i) && i !== headerID && line.Text) {
        article.content += line.Text?.replace(/ +/g, " ");
      } else if (i === headerID) {
        article.header = line.Text?.replace(/ +/g, " ").trim() || "";
      }

      article.content += " ";
    });

    newsArtciles.push(article);
  }

  return newsArtciles;
};

const kotimaa = await getArticles(103, 110);
const ulkomaa = await getArticles(131, 138);

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<html>
  <div id="news">
    <div id="kotimaa">
    </div>
    <div id="ulkomaa">
    </div>
  </div>
`;

document.querySelector<HTMLDivElement>(
  "#news"
)!.style.backgroundImage = `url(${clouds})`;

document.querySelector<HTMLDivElement>("#kotimaa")!.innerHTML = kotimaa
  .map((article) => {
    const presidentAlgorithmCheck = ["Stubb", "Haavisto"];

    if (presidentAlgorithmCheck.some((word) => article.header.includes(word))) {
      article.header = `>> ${article.header} <<`;
    }

    return `
      <div class="article">
        <p class="header"><span class="terminal">mikkis@mg:~/header$ </span><span class="header-text">${article.header}</span></p>
        <p class="content"><span class="terminal">mikkis@mg:~/content$ </span>${article.content}</p>
      </div>
    `;
  })
  .join("");

document.querySelector<HTMLDivElement>("#ulkomaa")!.innerHTML = ulkomaa
  .map((article) => {
    return `
      <div class="article">
      <p class="header"><span class="terminal">mikkis@mg:~/header$ </span><span class="header-text">${article.header}</span></p>
      <p class="content"><span class="terminal">mikkis@mg:~/content$ </span>${article.content}</p>
      </div>
    `;
  })
  .join("");

