import { ITreeNode } from "../types";

export function generateRightPaneFolderTable(data: ITreeNode[]){
    const rightPane = document.createElement('div');
    rightPane.classList.add('right-pane');
  
    const table = document.createElement('table');
    table.id = 'file-table';
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    
    thead.innerHTML = `
      <tr>
        <th>File Name</th>
        <th>Last Modified</th>
        <th>Size</th>
      </tr>
    `;
    
    table.appendChild(thead);
    table.appendChild(tbody);
    rightPane.appendChild(table);
    return rightPane
}

export function showFolderContents(folder: ITreeNode): void {
    const fileTable = document.getElementById('file-table') as HTMLTableElement;
    const tbody = fileTable.querySelector('tbody') as HTMLTableSectionElement;
    tbody.innerHTML = ''; // Clear the existing files
  
    folder.children?.forEach((child) => {
      const tr = document.createElement('tr');
      const nameTd = document.createElement('td');
      const modifiedTd = document.createElement('td');
      const sizeTd = document.createElement('td');
  
      nameTd.textContent = child.name;
      modifiedTd.textContent = child.modified.toLocaleString();
      sizeTd.textContent = `${child.size} KB`;
  
      tr.appendChild(nameTd);
      tr.appendChild(modifiedTd);
      tr.appendChild(sizeTd);
      tbody.appendChild(tr);
    });
}