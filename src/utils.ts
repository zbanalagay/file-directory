import { ITreeNode } from "./types";

export function findFolderButtonByName(folderName: string, parentElement: HTMLElement): HTMLElement | null {
    const buttonsNodes = parentElement.querySelectorAll('.folder-button') as NodeListOf<HTMLElement>;
    const buttons = Array.from(buttonsNodes);
    for (const button of buttons) {
      if (button.textContent === folderName) {
        return button as HTMLElement;
      }
    }
    return null;
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