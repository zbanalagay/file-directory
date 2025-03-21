import { ITreeNode } from "../types";
import { findFolderButtonByName, findFolderByName, highlightFolder } from "../utils.js";
import { showFolderContents } from "./FolderTable.js";

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

      // Create the arrow (always add it for alignment)
      const arrowSpan = document.createElement("span");
      arrowSpan.textContent = node.children && node.children.length ? "▶" : " ";
      arrowSpan.classList.add("folder-arrow");
      button.appendChild(arrowSpan);
      
      // Create the folder icon
      const iconSpan = document.createElement('span');
      iconSpan.textContent = '📂'; // Folder icon
      iconSpan.classList.add('folder-icon');

      // Create the folder name text
      const nameSpan = document.createElement('span');
      nameSpan.textContent = node.name;

      // Append everything to the button
      button.appendChild(iconSpan);
      button.appendChild(nameSpan);
      li.appendChild(button);

      // If the folder has children, create a nested list
      let nestedUl: HTMLUListElement | null = null;
      if (node.children && node.children.length) {
        nestedUl = document.createElement('ul');
        nestedUl.style.display = 'none'; // Hide initially
        createFolderExplorer({ data: node.children, parentElement: nestedUl });
        li.appendChild(nestedUl);
      }

      // Handle click to expand/collapse
      button.addEventListener('click', () => {
        if (nestedUl) {
          const isCollapsed = nestedUl.style.display === "none";
          nestedUl.style.display = isCollapsed ? "block" : "none";
          arrowSpan.textContent = isCollapsed ? "▼" : "▶"; // Down or right arrow
        }
      });

      parentElement.appendChild(li);
    }
  });
}

// Function to expand a folder in the left pane
export function expandLeftPaneFolder(folder: ITreeNode) {
  const leftPane = document.getElementById('left-pane') as HTMLElement;

  // Attempt to find the folder button by name
  const folderButton = findFolderButtonByName(folder.name, leftPane);

  if (folderButton) {
    // Find the parent <li> of the folder button
    const parentLi = folderButton.closest('li');

    // Find the nested <ul> inside the parent <li>
    const nestedUl = parentLi?.querySelector('ul');
    const arrowSpan = folderButton.querySelector('.folder-arrow');

    if (nestedUl) {
      nestedUl.style.display = 'block'; // Ensure the folder's nested items are shown
      if (arrowSpan) {
        arrowSpan.textContent = "▼"; // Ensure the arrow points down
      }
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
    const nameSpan = button.querySelector('span:last-child');  // The last span is the folder name
    const folderName = nameSpan?.textContent?.trim() || '';

    if (folderName) {
      const folder = findFolderByName(folderName, data);
      if (folder) {
        showFolderContents(folder, data);
        expandLeftPaneFolder(folder); // Expands the folder when clicked from the right
      }
    }
  }
}
