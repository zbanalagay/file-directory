import { ITreeNode } from "../types";
import { findFolderByName, formatDate } from "../utils.js";
import { expandLeftPaneFolder } from "./FolderTree.js";

export function showFolderContents(folder: ITreeNode): void {
  const fileTable = document.getElementById('file-table') as HTMLTableElement;
  const tbody = fileTable.querySelector('tbody') as HTMLTableSectionElement;
  tbody.innerHTML = ''; // Clear the existing files

  folder.children?.forEach((child) => {
      const tr = document.createElement('tr');
      const nameTd = document.createElement('td');
      const modifiedTd = document.createElement('td');
      const sizeTd = document.createElement('td');

      // Create the icon element
      const iconSpan = document.createElement('span');
      iconSpan.textContent = child.type === 'file' ? '📄 ' : '📂 ';
      iconSpan.classList.add('file-icon'); 

      // Create the name element
      const nameSpan = document.createElement('span');
      nameSpan.textContent = child.name;
      nameSpan.classList.add('file-name'); 

      // Append the icon and name to the same td
      nameTd.appendChild(iconSpan);
      nameTd.appendChild(nameSpan);
      nameTd.classList.add('col__file-name'); 

      // Format the date and size for files
      modifiedTd.textContent = formatDate(child.modified);
      if (child.type === 'file') {
          sizeTd.textContent = `${child.size} KB`;
      }

      // Append the td elements to the row
      tr.appendChild(nameTd);
      tr.appendChild(modifiedTd);
      tr.appendChild(sizeTd);
      tbody.appendChild(tr);
  });
}


export function handleFolderTableItemClick(event: Event, data: ITreeNode[]) {
  const target = event.target as HTMLElement;

  // Ensure the click is inside a <td>
  const td = target.closest('td');

  if (td) {
    // Get the folder name from the name span (ignores the icon)
    const nameSpan = td.querySelector('.file-name');
    const folderName = nameSpan?.textContent?.trim() || '';  // Get the folder name text

    if (folderName) {
      // Find the folder from the data
      const folder = findFolderByName(folderName, data);
      console.log(folder, folderName);

      if (folder) {
        // Find the folder in the left pane and expand it
        expandLeftPaneFolder(folder);
        showFolderContents(folder);  // Display files in the right pane
      }
    }
  }
}
