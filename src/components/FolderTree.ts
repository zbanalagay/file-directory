import { ITreeNode } from '../types';
import { findFolderButtonByName, findFolderByName, highlightFolder, doesNodeHaveFolderChildren } from '../utils.js';
import { showFolderContents } from './FolderTable.js';

/* Presentational */
export function generateLeftPaneFolderTree(data: ITreeNode[]) {
  const leftPane = document.getElementById('left-pane') as HTMLElement;
  if (leftPane) {
    const ul = document.createElement('ul');
    leftPane.appendChild(ul);
    createFolderExplorer({ data, parentElement: ul });
  }
  return leftPane;
}

export function createFolderExplorer({ data, parentElement }: { data: ITreeNode[], parentElement: HTMLElement }): void {
  data.forEach((node) => {
    if (node.type === 'folder') {
      const li = document.createElement('li');
      const button = createFolderButton(node);
      li.appendChild(button);

      if (doesNodeHaveFolderChildren(node)) {
        const nestedUl = document.createElement('ul');
        nestedUl.classList.add('collapsed');
        createFolderExplorer({ data: node.children ?? [], parentElement: nestedUl });
        li.appendChild(nestedUl);
      }

      parentElement.appendChild(li);
    }
  });
}

function createFolderButton(node: ITreeNode) {
  const button = document.createElement('button');
  button.classList.add('folder-button');
  button.dataset.type = node.type;

  const arrowSpan = document.createElement('span');
  arrowSpan.textContent = doesNodeHaveFolderChildren(node) ? '▶' : ' ';
  arrowSpan.classList.add('folder-arrow');
  button.appendChild(arrowSpan);

  const iconSpan = document.createElement('span');
  iconSpan.textContent = '📂';
  iconSpan.classList.add('folder-icon');

  const nameSpan = document.createElement('span');
  nameSpan.textContent = node.name;

  button.append(iconSpan, nameSpan);
  return button;
}

/* Actions */
export function expandLeftPaneFolder(folder: ITreeNode) {
  const leftPane = document.getElementById('left-pane') as HTMLElement;
  if (!leftPane) return;

  const folderButton = findFolderButtonByName(folder.name, leftPane);
  if (folderButton) {
    const parentLi = folderButton.closest('li');
    const nestedUl = parentLi?.querySelector('ul');
    const arrowSpan = folderButton.querySelector('.folder-arrow');
    
    if (nestedUl && arrowSpan) {
      nestedUl.style.display = 'block';
      arrowSpan.textContent = '▼';
    }

    highlightFolder(folderButton);
  }
}

export function collapseParentFolderAndChildren(button: HTMLElement, data: ITreeNode[]) {
  const parentLi = button.closest('li');
  if (parentLi) {
    const nestedUl = parentLi.querySelector('ul');
    const arrowSpan = button.querySelector('.folder-arrow');

    if (nestedUl) {
      nestedUl.classList.add('collapsed');
      nestedUl.style.display = 'none';
      if (arrowSpan) arrowSpan.textContent = '▶';
    }

    collapseAllChildFolders(parentLi, data);
  }
}

export function collapseAllChildFolders(parentLi: HTMLElement, data: ITreeNode[]) {
  const childFolders = parentLi.querySelectorAll('ul');
  childFolders.forEach((childUl) => {
    childUl.classList.add('collapsed');
    childUl.style.display = 'none';

    const folderButtons = childUl.querySelectorAll('button.folder-button');
    folderButtons.forEach((button) => {
      const folderName = button.querySelector('span:last-child')?.textContent?.trim();
      const folder = findFolderByName(folderName || '', data);
      const arrowSpan = button.querySelector('.folder-arrow');
      
      if (arrowSpan && folder && doesNodeHaveFolderChildren(folder)) {
        arrowSpan.textContent = '▶';
      }
    });
  });
}

export function handleFolderTreeItemClick(event: Event, data: ITreeNode[]) {
  const target = event.target as HTMLElement;
  if (target) {
    const button = target.closest('button');
    
    if (button && button.dataset.type === 'folder') {
      const nameSpan = button.querySelector('span:last-child');
      const folderName = nameSpan?.textContent?.trim() || '';

      if (folderName) {
        const folder = findFolderByName(folderName, data);
        if (folder) {
          showFolderContents({ folder, data });
          expandLeftPaneFolder(folder);
        }
      }

      const nestedUl = button.closest('li')?.querySelector('ul');
      const arrowSpan = button.querySelector('.folder-arrow');

      if (nestedUl) {
        if (!nestedUl.classList.contains('collapsed')) {
          collapseParentFolderAndChildren(button, data);
        } else {
          nestedUl.classList.remove('collapsed');
          nestedUl.style.display = 'block';
          if (arrowSpan) arrowSpan.textContent = '▼';
        }
      }
    }
  }
}
