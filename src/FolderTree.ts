import { ITreeNode } from './types.js';
import {
  findFolderButtonByName,
  findFolderByName,
  highlightItem,
  doesNodeHaveFolderChildren,
  getClickedFolderButton,
  getFolderNameFromButton
} from './utils.js';
import { showFolderContents } from './FileTable.js';
import {
  COLLAPSED_CSS_CLASS,
  LEFT_PANE_CSS_ID,
  FOLDER_BUTTON_CSS_CLASS,
  FOLDER_ARROW_CSS_CLASS,
  FOLDER_ICON_CSS_CLASS,
  COLLAPSED_ARROW,
  EXPANDED_ARROW,
  FOLDER_ICON
} from './consts.js';

// Tracks whether folders are expanded or collapsed
// If I could modify the data noes or requirements were explicit in keeping things in sync, id render the dom more on this
export const folderExpansionStateMap = new Map<string, boolean>();


/* --------------------------- Tree Rendering --------------------------- */
// This function sets up the left pane with the folder tree structure
export function generateLeftPaneFolderTree(data: ITreeNode[]) {
  const leftPane = document.getElementById(LEFT_PANE_CSS_ID) as HTMLElement;
  if (leftPane) {
    const ul = document.createElement('ul');
    leftPane.appendChild(ul);
    createFolderExplorer({ data, parentElement: ul });
  }
  return leftPane;
}

// Recursively creates the nested folder UI
export function createFolderExplorer({ data, parentElement }: { data: ITreeNode[], parentElement: HTMLElement }) {
  data.forEach((node) => {
    if (node.type === 'folder') { // only show folders in the explorer
      const li = document.createElement('li');
      const button = createFolderButton(node);
      li.appendChild(button);

       // If the folder has children, recursively create subfolders
      if (doesNodeHaveFolderChildren(node)) {
        const nestedUl = document.createElement('ul');
        nestedUl.classList.add(COLLAPSED_CSS_CLASS);
        createFolderExplorer({ data: node.children ?? [], parentElement: nestedUl });
        li.appendChild(nestedUl);
      }

      parentElement.appendChild(li);
    }
  });
}

// Creates a folder button element with arrow, icon, and name
export function createFolderButton(node: ITreeNode) {
  const button = document.createElement('button');
  button.classList.add(FOLDER_BUTTON_CSS_CLASS);
  button.dataset.type = node.type;

  const arrowSpan = document.createElement('span');
  const hasChildren = doesNodeHaveFolderChildren(node);

  // Show arrow if folder has children, otherwise keep space for alignment
  arrowSpan.textContent = hasChildren ? COLLAPSED_ARROW : '\u00A0';
  arrowSpan.classList.add(FOLDER_ARROW_CSS_CLASS);
  button.appendChild(arrowSpan);

  const iconSpan = document.createElement('span');
  iconSpan.textContent = FOLDER_ICON;
  iconSpan.classList.add(FOLDER_ICON_CSS_CLASS);

  const nameSpan = document.createElement('span');
  button.dataset.name = node.name;
  nameSpan.textContent = node.name;

  button.append(iconSpan, nameSpan);
  return button;
}

/* ---------------------------- Expand Logic ---------------------------- */

// Searches the left pane DOM for the button matching the folder name
export function findFolderButtonInLeftPane(folderName: string): HTMLElement | null {
  const leftPane = document.getElementById(LEFT_PANE_CSS_ID);
  return leftPane ? findFolderButtonByName(folderName, leftPane) : null;
}

// Expands the immediate folder's nested list
export function expandFolderElement({folderButton, data}: {folderButton: HTMLElement, data: ITreeNode[]}): void {
  const li = folderButton.closest('li');
  if (!li) return;

  const nestedUl = Array.from(li.children).find(child => child.tagName === 'UL');
  const arrowSpan = folderButton.querySelector(`.${FOLDER_ARROW_CSS_CLASS}`);

  if (nestedUl && nestedUl instanceof HTMLElement) {
    nestedUl.classList.remove(COLLAPSED_CSS_CLASS);
  }

  // Lookup the real folder node from the data using its name
  const folderName = getFolderNameFromButton(folderButton);
  const folder = folderName ? findFolderByName({ name: folderName, data }) : undefined;

  // Only update the arrow if the folder truly has folder children
  if (arrowSpan) {
    const hasFolderChildren = folder ? doesNodeHaveFolderChildren(folder) : false;
    arrowSpan.textContent = hasFolderChildren ? EXPANDED_ARROW : '\u00A0';
  }
}

// Recursively expands all ancestor folders so the target folder becomes visible
export function expandAncestorFolders({folderButton, data}:{folderButton: HTMLElement, data: ITreeNode[]}): void {
  let li = folderButton.closest('li');

  while (li) {
    const parentUl = li.parentElement;
    if (parentUl?.tagName === 'UL') {
      parentUl.classList.remove(COLLAPSED_CSS_CLASS);

      const parentLi = parentUl.closest('li');
      const parentButton = parentLi?.querySelector(`button.${FOLDER_BUTTON_CSS_CLASS}`) as HTMLElement | null;
      const parentArrow = parentButton?.querySelector(`.${FOLDER_ARROW_CSS_CLASS}`);

      if (parentArrow && parentButton) {
        const parentName = getFolderNameFromButton(parentButton);
        const parentNode = parentName ? findFolderByName({ name: parentName, data }) : undefined;
        const hasFolderChildren = parentNode ? doesNodeHaveFolderChildren(parentNode) : false;
        parentArrow.textContent = hasFolderChildren ? EXPANDED_ARROW : '\u00A0';
      }

      li = parentLi;
    } else {
      break;
    }
  }
}

// Called when a folder is selected from the File Table to highlight and expand it in the tree
export function highlightAndRevealFolder({folder, data}:{folder: ITreeNode, data: ITreeNode[]}): void {
  const folderButton = findFolderButtonInLeftPane(folder.name);
  if (!folderButton) return;

  expandFolderElement({folderButton, data});
  expandAncestorFolders({folderButton, data});
  highlightItem({ item: folderButton, className: FOLDER_BUTTON_CSS_CLASS });
}

/* --------------------------- Collapse Logic --------------------------- */

// Collapses the current folder's nested list and updates the arrow
export function collapseFolderElement({folderButton, data}:{folderButton: HTMLElement, data: ITreeNode[]}) {
  const li = folderButton.closest('li');
  if (!li) return;

  const nestedUl = li.querySelector('ul');
  const arrowSpan = folderButton.querySelector(`.${FOLDER_ARROW_CSS_CLASS}`);

  if (nestedUl) {
    nestedUl.classList.add(COLLAPSED_CSS_CLASS);
  }

  const folderName = folderButton.querySelector('span:last-child')?.textContent?.trim();
  const folder = folderName ? findFolderByName({ name: folderName, data }) : undefined;
  const hasFolderChildren = folder ? doesNodeHaveFolderChildren(folder) : false;

  if (arrowSpan) {
    arrowSpan.textContent = hasFolderChildren ? COLLAPSED_ARROW : '\u00A0';
  }
}

// Recursively collapse all nested folder <ul>s under the given parent <li>
export function collapseDescendantFolders(parentLi: HTMLElement) {
  const childFolders = parentLi.querySelectorAll('ul');
  childFolders.forEach((childUl) => {
    childUl.classList.add(COLLAPSED_CSS_CLASS);
  });
}

// Resets all arrows under a parent <li> to the collapsed state
export function resetFolderArrowsWithin({ parentLi, data }: { parentLi: HTMLElement, data: ITreeNode[] }) {
  const folderButtons = parentLi.querySelectorAll(`button.${FOLDER_BUTTON_CSS_CLASS}`);
  folderButtons.forEach((button) => {
    const folderName = button.querySelector('span:last-child')?.textContent?.trim();
    const folder = findFolderByName({ name: folderName || '', data });
    const arrowSpan = button.querySelector(`.${FOLDER_ARROW_CSS_CLASS}`);

    if (arrowSpan && folder && doesNodeHaveFolderChildren(folder)) {
      arrowSpan.textContent = COLLAPSED_ARROW;
    }
  });
}

// Ensures the table view shows the content of the selected folder
export function showSelectedFolderContents(data: ITreeNode[]) {
  const selectedButton = document.querySelector(`.${FOLDER_BUTTON_CSS_CLASS}.selected`) as HTMLElement;
  const selectedName = selectedButton?.querySelector('span:last-child')?.textContent?.trim();

  if (!selectedName) return;

  const selectedFolder = findFolderByName({ name: selectedName, data });
  if (selectedFolder) showFolderContents(selectedFolder);
}

// Collapses all child folders and keeps selected folder contents visible in table
export function collapseAllChildFolders({ parentLi, data }: { parentLi: HTMLElement, data: ITreeNode[] }) {
  collapseDescendantFolders(parentLi);
  showSelectedFolderContents(data);
  resetFolderArrowsWithin({ parentLi, data });
}

// Combines logic to collapse current folder and all its descendants
export function collapseParentFolderAndChildren({ button, data }: { button: HTMLElement, data: ITreeNode[] }) {
  const parentLi = button.closest('li');
  if (!parentLi) return;

  collapseFolderElement({folderButton: button, data});
  showSelectedFolderContents(data);
  collapseAllChildFolders({ parentLi, data });
}

/* --------------------------- Interaction Logic --------------------------- */

// Toggles open/close state for a folder when its button is clicked
export function toggleFolderOpenState({ button, data }: { button: HTMLElement, data: ITreeNode[] }) {
  const nestedUl = button.closest('li')?.querySelector('ul');
  const arrowSpan = button.querySelector(`.${FOLDER_ARROW_CSS_CLASS}`);

  if (nestedUl?.classList.contains(COLLAPSED_CSS_CLASS)) {
    nestedUl.classList.remove(COLLAPSED_CSS_CLASS);
    if (arrowSpan) arrowSpan.textContent = EXPANDED_ARROW;
  } else {
    collapseParentFolderAndChildren({ button, data });
  }
}

// Main click handler for folder tree UI
export function handleFolderTreeItemClick(event: Event, data: ITreeNode[]) {
  const button = event.target instanceof HTMLElement
    ? event.target.closest(`.${FOLDER_BUTTON_CSS_CLASS}`) as HTMLElement | null
    : null;

  if (!button) return;

  const folderName = getFolderNameFromButton(button);
  if (!folderName) return;

  const folder = findFolderByName({ name: folderName, data });
  if (!folder) return;

  showFolderContents(folder);
  highlightItem({ item: button, className: FOLDER_BUTTON_CSS_CLASS });
  toggleFolderOpenState({button, data});
}