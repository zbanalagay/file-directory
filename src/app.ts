import { ITreeNode } from "./types";
import { MOCK_DATA_1 } from "./__mocks__/fileDirectoryMocks.js";
import {generateLeftPaneFolderTree, handleFolderTreeItemClick} from './components/FolderTree.js'
import {handleFolderTableItemClick} from './components/FolderTable.js'

  // Function to generate the full layout
  function generateFileDirectoryLayout(data: ITreeNode[]) {
    const leftPane = generateLeftPaneFolderTree(data)
    const rightPane = document.getElementById('right-pane') as HTMLElement

    // Event delegation to handle folder clicks
    leftPane.addEventListener('click', (e) => handleFolderTreeItemClick(e, data));
    rightPane.addEventListener('click', (e) => handleFolderTableItemClick(e, data));
    rightPane.querySelector('tbody')?.addEventListener('click', (e) => handleFolderTableItemClick(e, data));
  } 
  
  // Initializes the file explorer on page load
  document.addEventListener('DOMContentLoaded', () => generateFileDirectoryLayout(MOCK_DATA_1));