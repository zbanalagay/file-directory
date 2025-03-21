import { ITreeNode } from '../types';
import { findFolderButtonByName, findFolderByName, highlightFolder } from '../utils.js';
import { showFolderContents } from './FolderTable.js';

// Function to generate the left pane folder tree
export function generateLeftPaneFolderTree(data: ITreeNode[]) {
  const leftPane = document.getElementById('left-pane') as HTMLElement;
  if (leftPane) {
    const ul = document.createElement('ul');
    leftPane.appendChild(ul);
    createFolderExplorer({ data, parentElement: ul });
  }
  return leftPane;
}

// Function to create the folder explorer (recursive)
export function createFolderExplorer({ data, parentElement }: { data: ITreeNode[], parentElement: HTMLElement }): void {
  data.forEach((node) => {
    // Only show folders
    if (node.type === 'folder') { 
      const li = document.createElement('li');
      const button = createFolderButton(node);
      li.appendChild(button);

      // If there are children, create a nested list
      let nestedUl: HTMLUListElement | null = null;
      if (node.children && node.children.length) {
        nestedUl = document.createElement('ul');
        nestedUl.classList.add('collapsed'); // Add the collapsed class initially
        createFolderExplorer({ data: node.children, parentElement: nestedUl });
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
    // always add it for alignment
  arrowSpan.textContent = node.children && node.children.length ? '▶' : ' ';
  arrowSpan.classList.add('folder-arrow');
  button.appendChild(arrowSpan);

  const iconSpan = document.createElement('span');
  iconSpan.textContent = '📂'; // Folder icon
  iconSpan.classList.add('folder-icon');

  const nameSpan = document.createElement('span');
  nameSpan.textContent = node.name;

  button.appendChild(iconSpan);
  button.appendChild(nameSpan);
  // return arrow span as well so that click handler has it
  return button
}

export function expandLeftPaneFolder(folder: ITreeNode) {
  const leftPane = document.getElementById('left-pane') as HTMLElement;
  if (!leftPane) {
    console.warn('Left Pane not found')
  }

  const folderButton = findFolderButtonByName(folder.name, leftPane);

  if (folderButton) {
    // Find the parent <li> of the folder button (basically its container li)
    const parentLi = folderButton.closest('li');

    const nestedUl = parentLi?.querySelector('ul');
    const arrowSpan = folderButton.querySelector('.folder-arrow');
    // This means there are nested items inside to display
    if (nestedUl && arrowSpan) {
      nestedUl.style.display = 'block';
      arrowSpan.textContent = '▼';
    }
    highlightFolder(folderButton);
  }
}

export function handleFolderTreeItemClick(event: Event, data: ITreeNode[]) {
  const target = event.target as HTMLElement;
  if (target){
    // find the nearest ancestor (including the target itself) that matches
    const button = target.closest('button');
    
    if (button && button.dataset.type === 'folder') {
      const nameSpan = button.querySelector('span:last-child');  // The last span is the folder name
      const folderName = nameSpan?.textContent?.trim() || '';

      if (folderName) {
        const folder = findFolderByName(folderName, data);
        if (folder) {
          showFolderContents({folder, data});
          expandLeftPaneFolder(folder); // Expands the folder when clicked from the right
        }
      }

      // Handle expand/collapse for folders
      // find any nested ul inside the li
      const nestedUl = button.closest('li')?.querySelector('ul');
      if (nestedUl) {
        // Toggle the collapsed class
        nestedUl.classList.toggle('collapsed');
        
        // Update the arrow direction based on visibility
        const arrowSpan = button.querySelector('.folder-arrow');
        if (arrowSpan) {
          arrowSpan.textContent = nestedUl.classList.contains('collapsed') ? '▶' : '▼';
        }
      }
    }
  }
}
