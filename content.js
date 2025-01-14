// 監聽來自 popup.js 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "START_EXTRACTION") {
    startExtraction();
  }
});

async function startExtraction() {
  let buyerIds = []; // 改用陣列來保存所有ID（包含重複）
  
  // 加入測試用的買家ID（兩個相同的）
  buyerIds.push("3dstu_test");
  buyerIds.push("3dstu_test");
  
  let hasNextPage = true;
  let currentPage = 1;

  while (hasNextPage) {
    await waitForElement('.buyer-username');
    
    const buyers = document.querySelectorAll('.buyer-username');
    const currentPageIds = [];
    buyers.forEach(buyer => {
      const id = buyer.textContent.trim();
      buyerIds.push(id);
      currentPageIds.push(id);
    });

    const totalCount = buyerIds.length;
    const uniqueCount = new Set(buyerIds).size;
    const duplicateCount = totalCount - uniqueCount;
    const duplicateRate = ((duplicateCount / totalCount) * 100).toFixed(2);

    // 更新進度和統計
    chrome.runtime.sendMessage({
      type: 'UPDATE_PROGRESS',
      data: `正在提取第 ${currentPage} 頁 | 本頁新增 ${currentPageIds.length} 個ID\n` +
            `總共收集: ${totalCount} 個ID | 不重複: ${uniqueCount} 個\n` +
            `重複: ${duplicateCount} 個 | 重複率: ${duplicateRate}%`
    });

    // 更新ID列表
    chrome.runtime.sendMessage({
      type: 'UPDATE_IDS',
      data: buyerIds
    });

    const nextButton = document.querySelector('.eds-button--frameless.eds-pager__button-next');
    
    if (nextButton && !nextButton.disabled) {
      nextButton.click();
      currentPage++;
      await new Promise(resolve => setTimeout(resolve, 5000));
    } else {
      hasNextPage = false;
      chrome.runtime.sendMessage({
        type: 'UPDATE_PROGRESS',
        data: `提取完成！\n` +
              `總共收集: ${totalCount} 個ID | 不重複: ${uniqueCount} 個\n` +
              `重複: ${duplicateCount} 個 | 重複率: ${duplicateRate}%`
      });
    }
  }
}

// 輔助函數：等待元素出現
function waitForElement(selector) {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve();
    }

    const observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
} 