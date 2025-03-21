import { ITreeNode } from "./types";

export function findFolderButtonByName(folderName: string, parentElement: HTMLElement): HTMLElement | null {
    const buttons = parentElement.querySelectorAll('.folder-button');
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
      if (node.children?.includes(folder)) {
        return node; // Found the parent
      }
      // Recursively search in the children
      const parent = findParentFolder(folder, node.children || []);
      if (parent) return parent;
    }
    return null; // No parent found
  }