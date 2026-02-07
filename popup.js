const tabsList = document.getElementById('tabsList');
const resetAllBtn = document.getElementById('resetBtn');

const STORAGE_KEY = 'tabTitles';

let tabs = [];
let persistedTitles = {};

const loadPersistedTitles = async () => {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  persistedTitles = result[STORAGE_KEY] || {};
};

const saveCustomTitle = async (tabId, customTitle, originalTitle) => {
  persistedTitles[tabId] = {
    customTitle,
    originalTitle,
    timestamp: Date.now()
  };
  await chrome.storage.local.set({ [STORAGE_KEY]: persistedTitles });
};

const removeCustomTitle = async (tabId) => {
  delete persistedTitles[tabId];
  await chrome.storage.local.set({ [STORAGE_KEY]: persistedTitles });
};

const cleanupOldEntries = async () => {
  const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
  let hasCleanup = false;
  
  for (const [tabId, data] of Object.entries(persistedTitles)) {
    if (data.timestamp < oneDayAgo) {
      delete persistedTitles[tabId];
      hasCleanup = true;
    }
  }
  
  if (hasCleanup) {
    await chrome.storage.local.set({ [STORAGE_KEY]: persistedTitles });
  }
};

const getTabIcon = (tab) => {
  return tab.favIconUrl 
    ? `<img src="${tab.favIconUrl}" class="tab-icon" alt="">`
    : '<svg class="tab-icon" fill="currentColor" viewBox="0 0 16 16"><path d="M2 3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3zm1 0v10h10V3H3z"/></svg>';
};

const setupDisplayEvents = (tabItem, tab) => {
  const display = tabItem.querySelector('.tab-display');
  display.addEventListener('click', () => toggleEditMode(tab.id));
  
  const actionBtn = tabItem.querySelector('.tab-action-btn');
  actionBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (tab.currentTitle !== tab.originalTitle) {
      resetTabTitle(tab.id);
    } else {
      toggleEditMode(tab.id);
    }
  });
};

const setupEditEvents = (tabItem, tab) => {
  const input = tabItem.querySelector('.tab-edit-input');
  input.focus();
  input.select();
  
  input.addEventListener('input', (e) => {
    const tabData = tabs.find(t => t.id === tab.id);
    tabData.currentTitle = e.target.value;
    tabData.isModified = e.target.value !== tabData.originalTitle;
  });
  
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      applyTabTitle(tab.id);
    }
  });
  
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      cancelEdit(tab.id);
    }
  });
  
  const applyBtn = tabItem.querySelector('.tab-apply-btn');
  applyBtn.addEventListener('click', () => applyTabTitle(tab.id));
};

const loadTabs = async () => {
  try {
    await loadPersistedTitles();
    
    const allTabs = await chrome.tabs.query({ currentWindow: true });
    
    tabs = allTabs.map(tab => {
      const saved = persistedTitles[tab.id];
      return {
        ...tab,
        originalTitle: tab.title,
        currentTitle: saved?.customTitle || tab.title,
        isModified: !!saved?.customTitle,
        isEditing: false
      };
    });
    
    renderTabs();
    cleanupOldEntries();
  } catch (error) {
    tabsList.innerHTML = '<div class="error">Failed to load tabs: ' + error.message + '</div>';
    console.error('Error loading tabs:', error);
  }
};

const renderTabs = () => {
  tabsList.innerHTML = '';
  
  if (tabs.length === 0) {
    tabsList.innerHTML = '<div class="error">No tabs found</div>';
    return;
  }
  
  tabs.forEach(tab => {
    const tabItem = document.createElement('div');
    tabItem.className = 'tab-item';
    tabItem.dataset.tabId = tab.id;
    
    updateTabUI(tabItem, tab);
    tabsList.appendChild(tabItem);
  });
};

const updateTabUI = (tabItem, tab) => {
  const icon = getTabIcon(tab);
  
  if (!tab.isEditing) {
    tabItem.classList.remove('tab-editing');
    
    const showReset = tab.currentTitle !== tab.originalTitle;
    const resetTooltip = showReset ? `Original: ${escapeHtml(tab.originalTitle)}` : 'Reset to original';
    
    tabItem.innerHTML = `
      ${icon}
      <div class="tab-display">
        <div class="tab-title-container">
          <span class="tab-title-text" title="${escapeHtml(tab.originalTitle)}">${escapeHtml(tab.currentTitle)}</span>
          <button class="tab-action-btn ${showReset ? 'reset' : 'edit'}" 
                  data-tab-id="${tab.id}" 
                  title="${resetTooltip}">
            ${showReset 
              ? '<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/><path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/></svg>'
              : '<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg>'}
          </button>
        </div>
      </div>
    `;
    
    setupDisplayEvents(tabItem, tab);
  } else {
    tabItem.classList.add('tab-editing');
    
    tabItem.innerHTML = `
      ${icon}
      <div class="tab-content">
        <div class="tab-edit-container">
          <input type="text" class="tab-edit-input" data-tab-id="${tab.id}" value="${escapeHtml(tab.currentTitle)}" title="Original: ${escapeHtml(tab.originalTitle)}">
          <button class="tab-apply-btn" data-tab-id="${tab.id}" title="Apply (Enter)">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>
          </button>
        </div>
      </div>
    `;
    
    setupEditEvents(tabItem, tab);
  }
};

const toggleEditMode = (tabId) => {
  const tab = tabs.find(t => t.id === tabId);
  if (!tab) return;
  
  tab.isEditing = true;
  const tabItem = document.querySelector(`.tab-item[data-tab-id="${tabId}"]`);
  updateTabUI(tabItem, tab);
};

const cancelEdit = (tabId) => {
  const tab = tabs.find(t => t.id === tabId);
  if (!tab) return;
  
  tab.isEditing = false;
  const tabItem = document.querySelector(`.tab-item[data-tab-id="${tabId}"]`);
  updateTabUI(tabItem, tab);
};

const applyTabTitle = async (tabId) => {
  const tab = tabs.find(t => t.id === tabId);
  if (!tab) return;
  
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      func: (title) => { 
        document.title = title;
        return true;
      },
      args: [tab.currentTitle]
    });
    
    await saveCustomTitle(tabId, tab.currentTitle, tab.originalTitle);
    
    tab.isEditing = false;
    tab.isModified = true;
    
    const tabItem = document.querySelector(`.tab-item[data-tab-id="${tabId}"]`);
    updateTabUI(tabItem, tab);
    
    showToast('✓ Applied', 'success');
  } catch (error) {
    console.error('Error applying title:', error);
    
    let errorMessage = 'Failed to apply';
    if (error.message.includes('Cannot access')) {
      errorMessage = 'Protected page';
    } else if (error.message.includes('No tab with id')) {
      errorMessage = 'Tab closed';
    }
    
    showToast(`✗ ${errorMessage}`, 'error');
  }
};

const resetTabTitle = async (tabId) => {
  const tab = tabs.find(t => t.id === tabId);
  if (!tab) return;
  
  await removeCustomTitle(tabId);
  
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      func: (title) => { 
        document.title = title;
        return true;
      },
      args: [tab.originalTitle]
    });
  } catch (error) {
    console.warn('Could not apply original title (tab may be closed):', error);
  }
  
  tab.currentTitle = tab.originalTitle;
  tab.isModified = false;
  tab.isEditing = false;
  
  const tabItem = document.querySelector(`.tab-item[data-tab-id="${tabId}"]`);
  updateTabUI(tabItem, tab);
  
  showToast('Reset to original', 'success');
};

const resetAllTabs = async () => {
  await chrome.storage.local.remove(STORAGE_KEY);
  persistedTitles = {};
  
  tabs.forEach(tab => {
    tab.currentTitle = tab.originalTitle;
    tab.isModified = false;
    tab.isEditing = false;
  });
  
  renderTabs();
  showToast('Reset all to original', 'success');
};

const showToast = (message, type = 'success') => {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2000);
};

const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

resetAllBtn.addEventListener('click', resetAllTabs);

document.addEventListener('DOMContentLoaded', loadTabs);
