import { constants } from "../../Data/constants.js";
import { renderNewspaper } from "./newspaper.js";

let page = 0;

const $leftButton = document.querySelector(".left-button_content");
const $rightButton = document.querySelector(".right-button_content");

const setDisplayButton = () => {
  $leftButton.style.display = page === constants.MIN_PAGE ? "none" : "block";
  $rightButton.style.display = page === constants.MAX_PAGE ? "none" : "block";
};

const renderContent = () => {
  renderNewspaper(page, constants.LIGHT_MODE);
  setDisplayButton();
};

const movePageLeft = () => {
  page--;
  renderContent();
};

const movePageRight = () => {
  page++;
  renderContent();
};

const setPageButton = () => {
  $leftButton.addEventListener("click", movePageLeft);
  $rightButton.addEventListener("click", movePageRight);
};

export { setPageButton };