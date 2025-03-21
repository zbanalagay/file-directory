import { ITreeNode } from "./types";

export function findFolderButtonByName(folderName: string, parentElement: HTMLElement): HTMLElement | null {
    const buttonsNodes = parentElement.querySelectorAll('.folder-button') as NodeListOf<HTMLElement>;
    const buttons = Array.from(buttonsNodes);
  
    console.log('Buttons:', buttons, 'Searching for folder name:', folderName);
  
    for (const button of buttons) {
      // Get the folder name from the button's second span (the one with the folder name)
      const nameSpan = button.querySelector('span:last-child');
      if (nameSpan && nameSpan.textContent?.trim() === folderName.trim()) {
        return button; // Return the button if the folder name matches
      }
    }
    return null; // Return null if no match is found
  }

export function findFolderByName(name: string, data: ITreeNode[]): ITreeNode | undefined {
    for (const node of data) {
      if (node.name === name) {
        return node;
      }
      if (node.type === 'folder' && node.children) {
        const found = findFolderByName(name, node.children);
        if (found) return found;
      }
    }
    return undefined;
}

export function findParentFolder(folder: ITreeNode, data: ITreeNode[]): ITreeNode | null {
    for (const node of data) {
      if (node.children?.indexOf(folder) !== -1) {
        return node; // Found the parent
      }
      // Recursively search in the children
      const parent = findParentFolder(folder, node.children || []);
      if (parent) return parent;
    }
    return null; // No parent found
}

export function formatDate(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
    const year = String(date.getFullYear()).slice(-2); // Get the last two digits of the year
  
    return `${month}/${day}/${year}`;
}

export function highlightFolder(folderButton: HTMLElement) {
    // Remove the 'selected-folder' class from any previously selected button
    const previouslySelected = document.querySelector('.folder-button.selected-folder');
    if (previouslySelected) {
        previouslySelected.classList.remove('selected-folder');
    }

    // Add the 'selected-folder' class to the clicked folder
    folderButton.classList.add('selected-folder');
}

export function highlightFileItem(fileRow: HTMLTableRowElement) {
    // Remove 'selected' class from any previously selected row
    const previouslySelected = document.querySelector('.file-item.selected');
    if (previouslySelected) {
        previouslySelected.classList.remove('selected');
    }

    // Add 'selected' class to the clicked row
    fileRow.classList.add('selected');
}