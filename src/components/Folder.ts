import { ITreeNode } from "../types.js";
import {findFolderByName} from '../utils.js';
import { expandLeftPaneFolder } from "./FolderTree.js";
import { showFolderContents } from "./FolderTable.js";


export function handleFolderClick(event: Event, data: ITreeNode[]) {
    const target = event.target as HTMLElement;
    // Folder click in the left pane
    if (target && target.tagName === 'BUTTON' && target.dataset.type === 'folder') {
      const parentLi = target.closest('li');
      const nestedUl = parentLi?.querySelector('ul');
  
      if (nestedUl) {
        nestedUl.style.display = nestedUl.style.display === 'none' ? 'block' : 'none';
      }
  
      // Select the folder and display contents on the right pane
      const folderName = target.textContent || '';
      const folder = findFolderByName(folderName, data);
      if (folder) {
        showFolderContents(folder);
      }
    }
  
    // Folder click in the right pane (to expand the left pane folder)
    if (target && target.tagName === 'TD') {
      const folderName = target.textContent || '';
      const folder = findFolderByName(folderName, data);
      console.log(folder, folderName)
      if (folder) {
        // Find the folder in the left pane and expand it
        expandLeftPaneFolder(folder);
        showFolderContents(folder); // Display files in the right pane
      }
    }
  }
