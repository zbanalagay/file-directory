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
      const hasFolderChildren = (node.children ?? []).some(child => child.type === 'folder');

      if (hasFolderChildren) {
        nestedUl = document.createElement('ul');
        nestedUl.classList.add('collapsed'); // Add the collapsed class initially
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
  const hasFolderChildren = (node.children ?? []).some(child => child.type === 'folder');

  // Only show arrow if the folder has child folders
  arrowSpan.textContent = hasFolderChildren ? '▶' : ' ';
  arrowSpan.classList.add('folder-arrow');
  button.appendChild(arrowSpan);

  const iconSpan = document.createElement('span');
  iconSpan.textContent = '📂'; // Folder icon
  iconSpan.classList.add('folder-icon');

  const nameSpan = document.createElement('span');
  nameSpan.textContent = node.name;

  button.appendChild(iconSpan);
  button.appendChild(nameSpan);
  return button;
}

export function expandLeftPaneFolder(folder: ITreeNode) {
  const leftPane = document.getElementById('left-pane') as HTMLElement;
  if (!leftPane) {
    console.warn('Left Pane not found');
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

export function collapseAllChildFolders(button: HTMLElement) {
  const nestedUl = button.closest('li')?.querySelector('ul');
  if (nestedUl) {
    // Find all nested folders (descendants) and collapse them
    const childFolders = nestedUl.querySelectorAll('ul');
    childFolders.forEach((childUl) => {
      childUl.classList.add('collapsed');
      childUl.style.display = 'none';
      // Update the arrow direction for the child folder
      const arrowSpan = button.querySelector('.folder-arrow');
      if (arrowSpan) {
        arrowSpan.textContent = '▶'; // Reset to the right arrow for collapsed state
      }
    });
  }
}

export function collapseParentFolderAndChildren(button: HTMLElement) {
  const parentLi = button.closest('li');
  if (parentLi) {
    // Collapse the parent folder first
    const nestedUl = parentLi.querySelector('ul');
    const arrowSpan = button.querySelector('.folder-arrow');

    if (nestedUl) {
      nestedUl.classList.add('collapsed');
      nestedUl.style.display = 'none';
      if (arrowSpan) {
        arrowSpan.textContent = '▶';
      }
    }

    // Now collapse all child folders within this parent
    collapseAllChildFolders(button);
  }
}

export function handleFolderTreeItemClick(event: Event, data: ITreeNode[]) {
  const target = event.target as HTMLElement;
  if (target) {
    // Find the nearest ancestor (including the target itself) that matches
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
      const nestedUl = button.closest('li')?.querySelector('ul');
      if (nestedUl) {
        const arrowSpan = button.querySelector('.folder-arrow');
        
        // If the folder is already expanded, collapse it and all its children
        if (!nestedUl.classList.contains('collapsed')) {
          // Collapse the parent folder and all its children
          collapseParentFolderAndChildren(button);
        } else {
          // Otherwise, expand it
          nestedUl.classList.remove('collapsed');
          nestedUl.style.display = 'block';
          if (arrowSpan) {
            arrowSpan.textContent = '▼'; // Show down arrow for expanded state
          }
        }
      }
    }
  }
}
