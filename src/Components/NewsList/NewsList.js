import { constants } from "../../Data/constants.js";
import Component from "../../core/Component.js";
import PressNews from "./PressNews.js";

export default class NewsList extends Component {
  setup() {
    this.$state = {
      pressNewsData: [],
      page: 1,
      nowCategoryNewsData: [],
    };

    this.currentPercentage = 0;
    this.$nowPage;
    this.tabLiteral = "";

    this.fetchNewsData();
  }

  template() {
    return `
      <ul class="news-list__field-tab">
        <li class="news-list__field-tab__progress">
          <span>종합/경제</span>
          <span class="news-list__field-tab__progress-count">
            1
            <span class="news-list__field-tab__progress-entire">/ 14</span>
          </span>
        </li>
        <li class="news-list__field-tab__general">방송/통신</li>
        <li class="news-list__field-tab__general">IT</li>
        <li class="news-list__field-tab__general">영자지</li>
        <li class="news-list__field-tab__general">스포츠/연예</li>
        <li class="news-list__field-tab__general">매거진/전문지</li>
        <li class="news-list__field-tab__general">지역</li>
      </ul>
      <div class="news-list__press-news"></div>

      <div class="left-button_content">
        <img src="./assets/icons/LeftPage.svg" alt="LeftPage" />
      </div>
      <div class="right-button_content">
        <img src="./assets/icons/RightPage.svg" alt="RightPage" />
      </div>

      <div class="news-list__snack-bar hidden">
        내가 구독한 언론사에 추가되었습니다.
      </div>
    `;
  }

  mounted() {
    if (!this.$state.pressNewsData.news) return;

    this.startProgress();
    this.setListPageButton();
    this.setFieldTab();
    this.renderPressNews();
  }

  renderPressNews() {
    new PressNews(this.$target.querySelector(".news-list__press-news"), {
      nowCategoryNewsData: this.$state.nowCategoryNewsData,
      page: this.$state.page,
      SubscribeStore: this.$props.SubscribeStore,
      ModeStore: this.$props.ModeStore,
    });
  }

  async fetchNewsData() {
    const pressNewsData = await fetch("./src/Data/pressNews.json").then(
      (res) => {
        return res.json();
      }
    );

    this.setState({ pressNewsData: pressNewsData });
  }

  getCategoryData(category) {
    return this.$state.pressNewsData.news.filter(
      (item) => item.category === category
    );
  }

  clearProgress = () => {
    this.currentPercentage = 0;
  };

  startProgress() {
    const $progress = this.$target.querySelector(
      ".news-list__field-tab__progress"
    );
    const increment = 100 / (constants.PROGRESS_DURATION_MS / 16); // 16ms 마다 업데이트

    const progressTimer = setInterval(() => {
      this.currentPercentage += increment;

      if (this.currentPercentage >= 100) {
        this.movePageRight();
        this.clearProgress();
      }

      $progress.style.background = `linear-gradient(to right, #4362d0 ${this.currentPercentage}%, #7890e7 ${this.currentPercentage}%)`;
    }, 16); // 16ms 마다 업데이트

    this.$props.setProgressTimer(progressTimer);
  }

  renderContent() {
    this.$nowPage.data = this.$state.page + " ";
    this.clearProgress();
    this.renderPressNews();
  }

  movePage(amount) {
    this.setState({ page: this.$state.page + amount }, false);
    this.renderContent();
  }

  movePageLeft() {
    if (this.$state.page === 1) {
      this.convertTab(-1);
      this.setState({ page: this.$state.nowCategoryNewsData.length }, false);
      this.renderContent();
    } else {
      this.movePage(-1);
    }
  }

  movePageRight() {
    this.$state.page === this.$state.nowCategoryNewsData.length
      ? this.convertTab(1)
      : this.movePage(1);
  }

  setNowPageTag() {
    this.$nowPage = this.$target.querySelector(
      ".news-list__field-tab__progress-count"
    ).childNodes[0];
  }

  changePageTarget() {
    this.setNowPageTag();
    this.setState({ page: 1 }, false);
    this.renderContent();
  }

  setListPageButton() {
    const $leftButton = this.$target.querySelector(".left-button_content");
    const $rightButton = this.$target.querySelector(".right-button_content");

    this.setNowPageTag();

    $leftButton.addEventListener("click", () => this.movePageLeft());
    $rightButton.addEventListener("click", () => this.movePageRight());
  }

  makeTag(event, item) {
    if (event.target.innerHTML.includes(item)) {
      this.setState(
        {
          nowCategoryNewsData: this.getCategoryData(item).sort(
            () => Math.random() - 0.5
          ),
        },
        false
      );

      this.tabLiteral += `
        <li class="news-list__field-tab__progress">
          <span>${item}</span>
          <span class="news-list__field-tab__progress-count">
            1
            <span class="news-list__field-tab__progress-entire">/ ${this.$state.nowCategoryNewsData.length}</span>
          </span>
        </li>
      `;
    } else {
      this.tabLiteral += `<li class="news-list__field-tab__general">${item}</li>`;
    }
  }

  convertTab(amount) {
    const $liAll = this.$target.querySelectorAll(".news-list__field-tab > li");
    [...$liAll].forEach((item, index) => {
      if (item.className === "news-list__field-tab__progress") {
        $liAll[
          (index + amount + constants.FIELDTAB_LIST.length) %
            constants.FIELDTAB_LIST.length
        ].click();
        return;
      }
    });
  }

  setFieldTab() {
    if (!this.$state.nowCategoryNewsData.length) {
      this.setState(
        {
          nowCategoryNewsData: this.getCategoryData(
            constants.FIELDTAB_LIST[0]
          ).sort(() => Math.random() - 0.5),
        },
        false
      );
    }

    this.tabLiteral = "";
    const $fieldTabList = this.$target.querySelectorAll(
      ".news-list__field-tab > li"
    );
    [...$fieldTabList].forEach((item) => {
      item.addEventListener("click", (event) => {
        constants.FIELDTAB_LIST.forEach((item) => this.makeTag(event, item));
        this.$target.querySelector(".news-list__field-tab").innerHTML =
          this.tabLiteral;

        this.setFieldTab();
        this.startProgress();
        this.changePageTarget();
      });
    });
  }
}
