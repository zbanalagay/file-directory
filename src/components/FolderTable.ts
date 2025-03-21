import { ITreeNode } from "../types";
import { findFolderByName, formatDate, highlightFileItem } from "../utils.js";
import { expandLeftPaneFolder } from "./FolderTree.js";

export function showFolderContents(folder: ITreeNode, data: ITreeNode[]): void {
  const fileTable = document.getElementById("file-table") as HTMLTableElement;
  const tbody = fileTable.querySelector("tbody") as HTMLTableSectionElement;
  tbody.innerHTML = ""; // Clear the existing files

  folder.children?.forEach((child, index) => {
    const tr = document.createElement("tr");
    tr.classList.add("file-item");

    const nameTd = document.createElement("td");
    nameTd.classList.add("col__file-name");

    const modifiedTd = document.createElement("td");
    const sizeTd = document.createElement("td");

    // Create the icon
    const iconSpan = document.createElement("span");
    iconSpan.textContent = child.type === "file" ? "📄" : "📂";
    iconSpan.classList.add('folder-icon')

    // Create the name span
    const nameSpan = document.createElement("span");
    nameSpan.textContent = child.name;
    nameSpan.classList.add("file-name");

    // Append icon and name to the name cell
    nameTd.appendChild(iconSpan);
    nameTd.appendChild(nameSpan);

    modifiedTd.textContent = formatDate(child.modified);

    if (child.type === "file") {
      sizeTd.textContent = `${child.size} KB`;
    }

    tr.appendChild(nameTd);
    tr.appendChild(modifiedTd);
    tr.appendChild(sizeTd);

    // Attach click event for highlighting and expanding folders
    tr.addEventListener("click", () => {
      highlightFileItem(tr);

      if (child.type === "folder") {
        const foundFolder = findFolderByName(child.name, data);
        if (foundFolder) {
          expandLeftPaneFolder(foundFolder);
          showFolderContents(foundFolder, data);
        }
      }
    });

    tbody.appendChild(tr);

    // Highlight the first item by default
    if (index === 0) {
      highlightFileItem(tr);
    }
  });
}

export function handleFolderTableItemClick(event: Event, data: ITreeNode[]) {
  const target = event.target as HTMLElement;
  const td = target.closest("td");

  if (td) {
    const nameSpan = td.querySelector(".file-name");
    const tableItemName = nameSpan?.textContent?.trim() || "";

    if (tableItemName) {
      const tableItem = findFolderByName(tableItemName, data);
      if (tableItem && tableItem.type === "folder") {
        expandLeftPaneFolder(tableItem);
        showFolderContents(tableItem, data);
      }
    }
  }
}
