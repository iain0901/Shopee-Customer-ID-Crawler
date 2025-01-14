let buyerIds = JSON.parse(localStorage.getItem('buyerIds') || '[]');
let originalIds = JSON.parse(localStorage.getItem('originalIds') || '[]');

function updateDisplay() {
  const textarea = document.getElementById('buyerIds');
  textarea.value = buyerIds.join('\n');
}

document.addEventListener('DOMContentLoaded', () => {
  updateDisplay();
});

document.getElementById('startButton').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, { action: "START_EXTRACTION" });
});

document.getElementById('copyButton').addEventListener('click', () => {
  const textarea = document.getElementById('buyerIds');
  textarea.select();
  document.execCommand('copy');
});

document.getElementById('downloadButton').addEventListener('click', () => {
  const content = document.getElementById('buyerIds').value;
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'buyer_ids.txt';
  a.click();
});

document.getElementById('removeDuplicates').addEventListener('click', () => {
  originalIds = [...buyerIds];
  localStorage.setItem('originalIds', JSON.stringify(originalIds));
  
  const uniqueIds = [...new Set(buyerIds)];
  const totalCount = buyerIds.length;
  const uniqueCount = uniqueIds.length;
  const duplicateCount = totalCount - uniqueCount;
  const duplicateRate = ((duplicateCount / totalCount) * 100).toFixed(2);
  
  buyerIds = uniqueIds;
  localStorage.setItem('buyerIds', JSON.stringify(buyerIds));
  updateDisplay();
  
  document.getElementById('progress').textContent = 
    `去除重複完成！\n` +
    `原有ID數: ${totalCount} 個\n` +
    `去重後剩餘: ${uniqueCount} 個\n` +
    `刪除重複: ${duplicateCount} 個\n` +
    `重複率: ${duplicateRate}%`;
});

document.getElementById('restoreButton').addEventListener('click', () => {
  if (originalIds.length > 0) {
    buyerIds = [...originalIds];
    localStorage.setItem('buyerIds', JSON.stringify(buyerIds));
    updateDisplay();
    document.getElementById('progress').textContent = '已復原到刪除重複前的狀態';
  } else {
    document.getElementById('progress').textContent = '沒有可以復原的數據';
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'UPDATE_PROGRESS') {
    document.getElementById('progress').textContent = message.data;
  } else if (message.type === 'UPDATE_IDS') {
    buyerIds = message.data;
    localStorage.setItem('buyerIds', JSON.stringify(buyerIds));
    updateDisplay();
  }
}); 