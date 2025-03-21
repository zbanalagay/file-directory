import { FOLDER_BUTTON_CSS_CLASS } from './consts.js';
import { ITreeNode } from './types';

/* ---------------------------- DOM Element Utilities---------------------------- */
                                        
//Finds a folder button in the DOM by matching the folder name text content.
export function findFolderButtonByName(folderName: string, parentElement: HTMLElement): HTMLElement | null {
  const buttonsNodes = parentElement.querySelectorAll(`.${FOLDER_BUTTON_CSS_CLASS}`) as NodeListOf<HTMLElement>;
  const buttons = Array.from(buttonsNodes);

  for (const button of buttons) {
    const nameSpan = button.querySelector('span:last-child'); // Folder name is in the last <span>
    if (nameSpan && nameSpan.textContent?.trim() === folderName.trim()) {
      return button;
    }
  }
  return null;
}

//Gets the folder name inside a folder button.
export function getFolderNameFromButton(button: HTMLElement): string | null {
    const name = button.dataset.name?.trim();
    if (name) return name;
  
    const spanText = button.querySelector('span:last-child')?.textContent?.trim();
    return spanText ? spanText : null;
  }


//Checks whether the clicked event target is a folder button.
export function getClickedFolderButton(event: Event): HTMLElement | null {
  const target = event.target as HTMLElement;
  const button = target?.closest('button');
  return button?.dataset.type === 'folder' ? button : null;
}

// Highlights the given element by adding a `.selected` class and removing it from any previously selected element.
export function highlightItem({ item, className }: { item: HTMLTableRowElement | HTMLElement, className: string }) {
  const previouslySelected = document.querySelector(`.${className}.selected`);
  if (previouslySelected) {
    previouslySelected.classList.remove('selected');
  }
  item.classList.add('selected');
}


/* ----------------------------Folder Tree Utilities----------------------------*/

// Recursively searches through the tree data to find a folder node by name.
export function findFolderByName({ name, data }: { name: string, data: ITreeNode[] }): ITreeNode | undefined {
  for (const node of data) {
    if (node.name === name) {
      return node;
    }
    if (node.type === 'folder' && node.children) {
      const found = findFolderByName({ name, data: node.children });
      if (found) return found;
    }
  }
  return undefined;
}

// Recursively searches the tree to find the parent folder of a given folder node.
export function findParentFolder(folder: ITreeNode, data: ITreeNode[]): ITreeNode | null {
  for (const node of data) {
    if (node.children?.includes(folder)) {
      return node; // Direct parent found
    }

    const parent = findParentFolder(folder, node.children ?? []);
    if (parent) return parent;
  }

  return null;
}

//Checks if a folder node has children that are also folders.
export function doesNodeHaveFolderChildren(node: ITreeNode): boolean {
  return (node.children ?? []).some(child => child.type === 'folder');
}

/*----------------------------Formatting Utils----------------------------*/

//Formats a JavaScript `Date` object to MM/DD/YY format.
export function formatDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);

  return `${month}/${day}/${year}`;
}
