import { ITreeNode } from './types.js';
import { findFolderByName, formatDate, highlightItem } from './utils.js';
import { highlightAndRevealFolder, folderExpansionStateMap } from './FolderTree.js';
import {
  FOLDER_BUTTON_CSS_CLASS,
  FILE_TABLE_CSS_ID,
  FILE_NAME_CSS_CLASS,
  TABLE_ROW_ITEM_CSS_CLASS,
  FOLDER_ICON_CSS_CLASS,
  TABLE_COL_FILE_NAME_CSS_CLASS,
  FILE_ICON,
  FOLDER_ICON
} from './consts.js';

/* ---------------------------- DOM Helpers ---------------------------- */

// Creates a table row element (<tr>) for a given file or folder node
export function createTableRow(node: ITreeNode) {
  const tr = document.createElement('tr');
  tr.classList.add(TABLE_ROW_ITEM_CSS_CLASS);
  tr.tabIndex = 0; // Makes row focusable with keyboard

  const nameTd = document.createElement('td');
  nameTd.classList.add(TABLE_COL_FILE_NAME_CSS_CLASS);

  const modifiedTd = document.createElement('td');
  modifiedTd.textContent = formatDate(node.modified); // Formats date for display

  const sizeTd = document.createElement('td');
  sizeTd.textContent = node.type === 'file' ? `${node.size} KB` : ''; // Only files have size

  const iconSpan = document.createElement('span');
  iconSpan.textContent = node.type === 'file' ? FILE_ICON : FOLDER_ICON;
  iconSpan.classList.add(FOLDER_ICON_CSS_CLASS); // Uses same class for layout consistency

  if (node.type === 'folder') {
    // Folders are clickable buttons
    const button = document.createElement('button');
    button.classList.add(FOLDER_BUTTON_CSS_CLASS);
    button.textContent = node.name;
    button.dataset.name = node.name; // Used for identifying clicked folder later
    button.setAttribute('aria-label', `Open folder ${node.name}`);
    nameTd.append(iconSpan, button);
  } else {
    // Files are plain spans
    const nameSpan = document.createElement('span');
    nameSpan.textContent = node.name;
    nameSpan.classList.add(FILE_NAME_CSS_CLASS);
    nameTd.append(iconSpan, nameSpan);
  }

  tr.append(nameTd, modifiedTd, sizeTd);
  return tr;
}

// Renders the contents of a folder into the file table UI
export function showFolderContents(folder: ITreeNode) {
  const fileTable = document.getElementById(FILE_TABLE_CSS_ID) as HTMLTableElement;
  if (!fileTable) return console.warn('File Table is not found');

  const tbody = fileTable.querySelector('tbody') as HTMLTableSectionElement;
  if (!tbody) return console.warn('Table Body is not found');

  // Clear existing rows before adding new ones
  tbody.innerHTML = '';

  // Render each child node into a row
  folder.children?.forEach((child) => {
    tbody.appendChild(createTableRow(child));
  });
}

/* ----------------------------- State Logic ---------------------------- */

// Toggles the expansion state (open/closed) of a folder by name
export function toggleFolderExpansionState(folder: ITreeNode) {
  const current = folderExpansionStateMap.get(folder.name) ?? false;
  folderExpansionStateMap.set(folder.name, !current);
}

// Updates the file table and highlights the selected folder in the tree
export function updateFolderViews(folder: ITreeNode, data: ITreeNode[]) {
  showFolderContents(folder);
  highlightAndRevealFolder({folder, data});
}

/* ------------------------- Event Handlers ------------------------- */

// Handles click events in the file table
export function handleFileTableItemClick(event: Event, data: ITreeNode[]) {
  const target = event.target as HTMLElement;

  // Highlight the row the user clicked on
  const tr = target.closest('tr');
  if (tr) {
    highlightItem({ item: tr, className: TABLE_ROW_ITEM_CSS_CLASS });
  }

  // If the clicked element was a folder button, expand and show its contents
  const button = target.closest(`.${FOLDER_BUTTON_CSS_CLASS}`) as HTMLElement | null;
  if (button?.dataset.name) {
    const tableItemName = button.dataset.name.trim();
    const folder = findFolderByName({ name: tableItemName, data });
    if (folder?.type === 'folder') {
      toggleFolderExpansionState(folder); // Toggle open/closed
      updateFolderViews(folder, data); // Show contents + highlight folder
    }
  }
}
