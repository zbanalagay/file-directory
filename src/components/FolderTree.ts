import { ITreeNode } from "../types";
import { findFolderButtonByName } from "../utils.js";

export function generateLeftPaneFolderTree(data: ITreeNode[]) {
    const leftPane = document.createElement('div');
    leftPane.classList.add('left-pane');
    const ul = document.createElement('ul');
    leftPane.appendChild(ul);
    createFolderExplorer({data, parentElement: ul});
    return leftPane;
}

export function createFolderExplorer({ data, parentElement }: { data: ITreeNode[], parentElement: HTMLElement }): void {
  data.forEach((node) => {
    if (node.type === 'folder') { // Only process folders
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
    const leftPane = document.querySelector('.left-pane') as HTMLElement;
    const folderButton = findFolderButtonByName(folder.name, leftPane);
    const nestedUl = folderButton?.closest('li')?.querySelector('ul');
    console.log(folderButton, nestedUl)
    if (nestedUl) {
      nestedUl.style.display = 'block';
    }
}