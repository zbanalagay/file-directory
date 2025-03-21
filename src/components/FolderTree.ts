import { ITreeNode } from "../types";
import { findFolderButtonByName, findFolderByName, highlightFolder } from "../utils.js";
import { showFolderContents } from './FolderTable.js';

// Function to generate the left pane folder tree
export function generateLeftPaneFolderTree(data: ITreeNode[]) {
  const leftPane = document.getElementById('left-pane') as HTMLElement;
  const ul = document.createElement('ul');
  leftPane.appendChild(ul);
  createFolderExplorer({ data, parentElement: ul });
  return leftPane;
}

// Function to create the folder explorer (recursive)
export function createFolderExplorer({ data, parentElement }: { data: ITreeNode[], parentElement: HTMLElement }): void {
  data.forEach((node) => {
    if (node.type === 'folder') { // Only show folders
      const li = document.createElement('li');

      // Create the folder button
      const button = document.createElement('button');
      button.classList.add('folder-button');
      button.dataset.type = node.type;

      // Create the folder icon
      const iconSpan = document.createElement('span');
      iconSpan.textContent = '📂'; // Folder icon
      iconSpan.classList.add('folder-icon'); // Add a class for styling

      // Create the folder name text
      const nameSpan = document.createElement('span');
      nameSpan.textContent = node.name;

      // Append the icon and name to the button
      button.appendChild(iconSpan);
      button.appendChild(nameSpan);

      li.appendChild(button);

      // If the folder has children, create a nested list
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

// Function to expand a folder in the left pane (not collapsing for now)
export function expandLeftPaneFolder(folder: ITreeNode) {
  const leftPane = document.getElementById('left-pane') as HTMLElement;

  // Attempt to find the folder button by name
  const folderButton = findFolderButtonByName(folder.name, leftPane);

  if (folderButton) {
    // Find the parent <li> of the folder button
    const parentLi = folderButton.closest('li');

    // Find the nested <ul> inside the parent <li>
    const nestedUl = parentLi?.querySelector('ul');

    // Toggle the nested <ul> visibility
    if (nestedUl) {
      nestedUl.style.display = 'block'; // Ensure the folder's nested items are shown
    }
    highlightFolder(folderButton);
  }
}

// Function to handle folder clicks
export function handleFolderTreeItemClick(event: Event, data: ITreeNode[]) {
  const target = event.target as HTMLElement;
  
  // If the target is a span (either the icon or the name), find the button
  const button = target.closest('button');
  
  if (button && button.dataset.type === 'folder') {
    // Find the span that contains the folder name
    const nameSpan = button.querySelector('span:last-child');  // The last span is the folder name
    const folderName = nameSpan?.textContent?.trim() || '';

    if (folderName) {
      // Find the corresponding folder object from the data
      const folder = findFolderByName(folderName, data);
      if (folder) {
        // Show folder contents in the right pane
        showFolderContents(folder);
        highlightFolder(button);

        // Expand the folder by displaying its nested <ul> if it exists
        const parentLi = button.closest('li');
        const nestedUl = parentLi?.querySelector('ul');

        if (nestedUl) {
          nestedUl.style.display = nestedUl.style.display === 'none' ? 'block' : 'none';  // Toggle visibility // Show the nested <ul> for this folder
        }
      }
    }
  }
}
