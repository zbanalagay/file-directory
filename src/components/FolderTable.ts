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
  sizeTd.textContent = node.type === 'file' ? `${node.size} KB` : '';

  const iconSpan = document.createElement('span');
  iconSpan.textContent = node.type === 'file' ? '📄' : '📂';
  iconSpan.classList.add('folder-icon');

  const nameSpan = document.createElement('span');
  nameSpan.textContent = node.name;
  nameSpan.classList.add('file-name');

  nameTd.append(iconSpan, nameSpan);
  tr.append(nameTd, modifiedTd, sizeTd);

  return tr;
}

export function showFolderContents({ folder, data }: { folder: ITreeNode, data: ITreeNode[] }): void {
  const fileTable = document.getElementById('file-table') as HTMLTableElement;
  if (!fileTable) {
    console.warn('File Table is not found');
    return;
  }

  const tbody = fileTable.querySelector('tbody') as HTMLTableSectionElement;
  if (!tbody) {
    console.warn('Table Body is not found');
    return;
  }

  tbody.innerHTML = ''; // Clear existing files

  folder.children?.forEach((child) => {
    tbody.appendChild(createTableRow(child));
  });
}

export function handleFolderTableItemClick(event: Event, data: ITreeNode[]) {
  const target = event.target as HTMLElement;
  const tr = target.closest('tr');

  if (tr) {
    highlightFileItem(tr);

    const nameSpan = tr.querySelector('.file-name');
    const tableItemName = nameSpan?.textContent?.trim() || '';

    if (tableItemName) {
      const tableItem = findFolderByName(tableItemName, data);
      if (tableItem?.type === 'folder') {
        expandLeftPaneFolder(tableItem);
        showFolderContents({ folder: tableItem, data });
      }
    }
  }
}
