import { ITreeNode } from '../types';
import { findFolderByName, formatDate, highlightFileItem } from '../utils.js';
import { expandLeftPaneFolder } from './FolderTree.js';

function createTableRow(node: ITreeNode) {
  const tr = document.createElement('tr');
  tr.classList.add('file-item');

  const nameTd = document.createElement('td');
  nameTd.classList.add('col__file-name');

  const modifiedTd = document.createElement('td');
  modifiedTd.textContent = formatDate(node.modified);

  const sizeTd = document.createElement('td');
  if (node.type === 'file') {
    sizeTd.textContent = `${node.size} KB`;
  }

  const iconSpan = document.createElement('span');
  iconSpan.textContent = node.type === 'file' ? '📄' : '📂';
  iconSpan.classList.add('folder-icon')

  const nameSpan = document.createElement('span');
  nameSpan.textContent = node.name;
  nameSpan.classList.add('file-name');

  nameTd.appendChild(iconSpan);
  nameTd.appendChild(nameSpan);

  tr.appendChild(nameTd);
  tr.appendChild(modifiedTd);
  tr.appendChild(sizeTd);

  return tr
}

export function showFolderContents({folder, data}: {folder: ITreeNode, data: ITreeNode[]}): void {
  const fileTable = document.getElementById('file-table') as HTMLTableElement;
  if (!fileTable){
    console.warn('File Table is not found')
  }
  const tbody = fileTable.querySelector('tbody') as HTMLTableSectionElement;
  if (!tbody) {
    console.warn('Table Body is not found')
  }
  tbody.innerHTML = ''; // Clear the existing files

  folder.children?.forEach((child, index) => {
    const tr = createTableRow(child)

    tbody.appendChild(tr);
  });
}

export function handleFolderTableItemClick(event: Event, data: ITreeNode[]) {
  const target = event.target as HTMLElement;
  const tr = target.closest('tr');

  if (tr) {
    // Highlight that clicked item
    highlightFileItem(tr);
    const nameSpan = tr.querySelector('.file-name');
    const tableItemName = nameSpan?.textContent?.trim() || '';

    if (tableItemName) {
      const tableItem = findFolderByName(tableItemName, data);
      if (tableItem && tableItem.type === 'folder') {
        expandLeftPaneFolder(tableItem);
        showFolderContents({folder: tableItem, data});
      }
    }
  }
}

