import { ITreeNode } from '../types';
import { findFolderByName, formatDate,highlightItem } from '../utils.js';
import { expandLeftPaneFolder } from './FolderTree.js';

function createTableRow(node: ITreeNode) {
  const tr = document.createElement('tr');
  tr.classList.add('table-row-item');
  tr.tabIndex = 0; // Makes row focusable

  const nameTd = document.createElement('td');
  nameTd.classList.add('col__file-name');

  const modifiedTd = document.createElement('td');
  modifiedTd.textContent = formatDate(node.modified);

  const sizeTd = document.createElement('td');
  sizeTd.textContent = node.type === 'file' ? `${node.size} KB` : '';

  const iconSpan = document.createElement('span');
  iconSpan.textContent = node.type === 'file' ? '📄' : '📂';
  iconSpan.classList.add('folder-icon');

  if (node.type === 'folder') {
    const button = document.createElement('button');
    button.classList.add('folder-button');
    button.textContent = node.name;
    button.dataset.name = node.name;
    button.setAttribute('aria-label', `Open folder ${node.name}`);
    nameTd.append(iconSpan, button);
  } else {
    const nameSpan = document.createElement('span');
    nameSpan.textContent = node.name;
    nameSpan.classList.add('file-name');
    nameTd.append(iconSpan, nameSpan);
  }

  tr.append(nameTd, modifiedTd, sizeTd);
  return tr;
}

export function showFolderContents({ folder, data }: { folder: ITreeNode; data: ITreeNode[] }): void {
  const fileTable = document.getElementById('file-table') as HTMLTableElement;
  if (!fileTable) return console.warn('File Table is not found');

  const tbody = fileTable.querySelector('tbody') as HTMLTableSectionElement;
  if (!tbody) return console.warn('Table Body is not found');

  // Clear any previous content in the table
  tbody.innerHTML = '';

  // Only show the contents of the selected folder (whether collapsed or expanded)
  folder.children?.forEach((child) => {
    // Append the current folder's children to the table
    tbody.appendChild(createTableRow(child));
  });
}
const folderExpansionState = new Map<string, boolean>(); 


export function handleFolderTableItemClick(event: Event, data: ITreeNode[]) {
  const target = event.target as HTMLElement;
  const tr = target.closest('tr');
  const button = target.closest('.folder-button') as HTMLElement | null;
  if (tr) highlightItem({ item: tr, className: 'table-row-item' });

  if (button && button.dataset.name) {
    const tableItemName = button.dataset.name.trim();
    const tableItem = findFolderByName(tableItemName, data);

    if (tableItem?.type === 'folder') {
      // Toggle the expanded/collapsed state of the folder
      const currentState = folderExpansionState.get(tableItemName) ?? false;
      folderExpansionState.set(tableItemName, !currentState); // Toggle state

      // Show folder contents based on the expanded/collapsed state
      showFolderContents({
        folder: tableItem,
        data,
      });
      expandLeftPaneFolder(tableItem)
    }
  }
}
