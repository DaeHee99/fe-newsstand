const NEWS_COUNT = 24;

let pages = 0;

const $prevPageButton = document.querySelector(".container-grid-view_left-btn");
const $nextPageButton = document.querySelector(
  ".container-grid-view_right-btn"
);
const $headerDate = document.querySelector(".container-header_date");

/* utils */
const fetchNewsData = async () => {
  try {
    const response = await fetch("./mocks/news.json");
    const data = await response.json();

    // shuffle data
    return data.sort(() => Math.random() - 0.5);
  } catch (error) {
    console.error(error.message);
  }
};

/* grid view control */
const fillNewsContents = (newsData) => {
  const $gridView = document.querySelector(".grid-view");
  $gridView.innerHTML = "";
  const startIndex = pages * NEWS_COUNT;

  for (let i = startIndex; i < startIndex + NEWS_COUNT; i++) {
    const $li = document.createElement("li");
    $li.className = "grid-cell";

    const $button = document.createElement("button");

    const $img = document.createElement("img");
    $img.className = "grid-cell_news-img";

    $img.src = newsData[i].src;
    $img.alt = newsData[i].name;

    $button.appendChild($img);
    $li.appendChild($button);

    $gridView.appendChild($li);
  }
};

const setDate = () => {
  const today = new Date();

  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "long",
  };

  $headerDate.innerText = today.toLocaleDateString("ko-KR", options);
};

(async function init() {
  setDate();

  const newsData = await fetchNewsData();

  newsData.forEach((news) => {
    news.src = news.src.replace("images", "images/light");
  });

  fillNewsContents(newsData);

  /* event handler */

  const handlePrevButtonClick = () => {
    $nextPageButton.classList.remove("hidden");
    pages--;

    if (pages === 0) {
      $prevPageButton.classList.add("hidden");
    }
    fillNewsContents(newsData);
  };

  const handleNextButtonClick = () => {
    const maxPage = Math.floor(newsData.length / NEWS_COUNT) - 1;

    if (pages === maxPage) {
      return;
    }

    $prevPageButton.classList.remove("hidden");
    pages++;

    if (pages === maxPage) $nextPageButton.classList.add("hidden");
    fillNewsContents(newsData);
  };

  $prevPageButton.addEventListener("click", handlePrevButtonClick);
  $nextPageButton.addEventListener("click", handleNextButtonClick);
})();
