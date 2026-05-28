// DOM 選擇器
const navItems = document.querySelectorAll(".nav-item");
const sections = document.querySelectorAll(".section");
const tabBtns = document.querySelectorAll(".tab-btn");

// 初始化
function init() {
  setupNavigation();
  setupTabs();
  setupAudioPlayer();
}

// 设置左侧導航
function setupNavigation() {
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      const sectionId = item.getAttribute("data-section");

      // 更新導航項的 active 狀態
      navItems.forEach((nav) => nav.classList.remove("active"));
      item.classList.add("active");

      // 更新內容區的顯示
      sections.forEach((section) => section.classList.remove("active"));
      const targetSection = document.getElementById(sectionId);
      if (targetSection) {
        targetSection.classList.add("active");
      }

      // 根據選中的條文更新右側說明面板
      updateExplanationForSection(sectionId);
    });
  });

  // 點擊第一個導航項為默認值
  if (navItems.length > 0) {
    navItems[0].click();
  }
}

// 根據條文ID更新說明面板
function updateExplanationForSection(sectionId) {
  // 隱藏所有說明
  const allExplanations = document.querySelectorAll(".section-explanation");
  allExplanations.forEach((exp) => {
    exp.style.display = "none";
  });

  // 顯示對應的說明
  const targetExplanation = document.getElementById(`${sectionId}-explanation`);
  if (targetExplanation) {
    targetExplanation.style.display = "block";
  }

  // 重置標籤到第一個
  resetExplanationPanel();
}

// 设置右侧標籤
function setupTabs() {
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabName = btn.getAttribute("data-tab");

      // 更新按鈕的 active 狀態
      tabBtns.forEach((tab) => tab.classList.remove("active"));
      btn.classList.add("active");

      // 更新內容的顯示 - 只顯示當前段落中的對應標籤內容
      const explanationContent = document.querySelector(".explanation-content");
      const allTabContents = explanationContent.querySelectorAll(".tab-content");
      
      allTabContents.forEach((content) => {
        content.classList.remove("active");
        if (content.getAttribute("data-tab") === tabName) {
          // 檢查這個tab-content是否屬於當前顯示的section
          const sectionExp = content.closest(".section-explanation");
          if (sectionExp && sectionExp.style.display !== "none") {
            content.classList.add("active");
          }
        }
      });
    });
  });

  // 不需要在這裡點擊第一個標籤，因為在初始化時會通過resetExplanationPanel來設定
}

// 重置說明面板
function resetExplanationPanel() {
  tabBtns.forEach((btn) => btn.classList.remove("active"));
  
  // 隱藏所有tab-content
  const allTabContents = document.querySelectorAll(".explanation-content .tab-content");
  allTabContents.forEach((content) => content.classList.remove("active"));

  // 顯示當前顯示的section中的第一個tab-content
  const visibleExplanation = document.querySelector(".section-explanation:not([style*='display: none'])");
  if (visibleExplanation) {
    const firstTab = visibleExplanation.querySelector(".tab-content");
    if (firstTab) {
      firstTab.classList.add("active");
    }
  }

  // 激活第一個標籤按鈕
  if (tabBtns.length > 0) {
    tabBtns[0].classList.add("active");
  }
}

// 设置音频播放器
function setupAudioPlayer() {
  const allPlayBtns = document.querySelectorAll(".play-btn");
  allPlayBtns.forEach((playBtn) => {
    playBtn.addEventListener("click", () => {
      const isPlaying = playBtn.hasAttribute("data-playing");

      if (!isPlaying) {
        playBtn.setAttribute("data-playing", "true");
        playBtn.textContent = "⏸ 暫停語音";
        playBtn.style.background = "#6c757d";

        // 模擬播放時長
        setTimeout(() => {
          if (playBtn.hasAttribute("data-playing")) {
            playBtn.removeAttribute("data-playing");
            playBtn.textContent = "▶ 播放語音說明";
            playBtn.style.background = "var(--primary-yellow)";
          }
        }, 3000);
      } else {
        playBtn.removeAttribute("data-playing");
        playBtn.textContent = "▶ 播放語音說明";
        playBtn.style.background = "var(--primary-yellow)";
      }
    });
  });
}

// 鍵盤快捷鍵
document.addEventListener("keydown", (e) => {
  // Alt + 數字鍵快速切換章節
  if (e.altKey && e.key >= "1" && e.key <= "7") {
    const index = parseInt(e.key) - 1;
    if (navItems[index]) {
      navItems[index].click();
    }
  }

  // Alt + T 快速切換標籤
  if (e.altKey && e.key === "t") {
    e.preventDefault();
    const activeTabIndex = Array.from(tabBtns).findIndex((btn) =>
      btn.classList.contains("active")
    );
    const nextIndex = (activeTabIndex + 1) % tabBtns.length;
    tabBtns[nextIndex].click();
  }
});

// 平滑滾動到內容
function scrollToContent() {
  const articleContent = document.querySelector(".article-content");
  if (articleContent) {
    articleContent.scrollTop = 0;
  }
}

// 當切換內容時，滾動到頂部
navItems.forEach((item) => {
  item.addEventListener("click", () => {
    setTimeout(scrollToContent, 100);
  });
});

// 頁面加載完成後初始化
document.addEventListener("DOMContentLoaded", init);
