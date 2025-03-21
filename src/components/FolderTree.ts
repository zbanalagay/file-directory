import { ITreeNode } from "../types";
import { findFolderButtonByName, findFolderByName, } from "../utils.js";
import {showFolderContents} from './FolderTable.js'

export function generateLeftPaneFolderTree(data: ITreeNode[]) {
    const leftPane = document.getElementById('left-pane') as HTMLElement;
    const ul = document.createElement('ul');
    leftPane.appendChild(ul);
    createFolderExplorer({data, parentElement: ul});
    return leftPane;
}

export function createFolderExplorer({ data, parentElement }: { data: ITreeNode[], parentElement: HTMLElement }): void {
  data.forEach((node) => {
    if (node.type === 'folder') { // Only show folders
      const li = document.createElement('li');
      const button = document.createElement('button');
      button.textContent = node.name;
      button.classList.add('folder-button');
      button.dataset.type = node.type;
      li.appendChild(button);

      if (node.children && node.children.length) {
        const nestedUl = document.createElement('ul');
        nestedUl.style.display = 'none'; // Hide initially
        createFolderExplorer({ data: node.children, parentElement: nestedUl });
        li.appendChild(nestedUl);
      }

      parentElement.appendChild(li);
    }
  });
}

export function expandLeftPaneFolder(folder: ITreeNode) {
    const leftPane = document.getElementById('left-pane') as HTMLElement;
    const folderButton = findFolderButtonByName(folder.name, leftPane);
    const nestedUl = folderButton?.closest('li')?.querySelector('ul');
    if (nestedUl) {
      nestedUl.style.display = 'block';
    }
}

export function handleFolderTreeItemClick(event: Event, data: ITreeNode[]) {
  const target = event.target as HTMLElement;
  if (target && target.tagName === 'BUTTON' && target.dataset.type === 'folder') {
    const parentLi = target.closest('li');
    const nestedUl = parentLi?.querySelector('ul');

    if (nestedUl) {
      nestedUl.style.display = nestedUl.style.display === 'none' ? 'block' : 'none';
    }

    // Select the folder and display contents on the right pane
    const folderName = target.textContent || '';
    const folder = findFolderByName(folderName, data);
    if (folder) {
      showFolderContents(folder);
    }
  }
}