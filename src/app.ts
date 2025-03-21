import { ITreeNode } from "./types";
import { MOCK_DATA_1 } from "./__mocks__/fileDirectoryMocks.js";
import {generateLeftPaneFolderTree, handleFolderTreeItemClick} from './FolderTree.js'
import {handleFileTableItemClick} from './FileTable.js'

  // Function to generate the full layout
  function generateFileDirectoryLayout(data: ITreeNode[]) {
    const leftPane = generateLeftPaneFolderTree(data)
    const rightPane = document.getElementById('right-pane') as HTMLElement

    if (!leftPane) {
        console.warn('Left Pane not found')
    }
    if (!rightPane) {
        console.warn('Right Pane not found')
    }
    // Event delegation to handle folder clicks
    leftPane.addEventListener('click', (e) => handleFolderTreeItemClick(e, data));
    rightPane.addEventListener('click', (e) => handleFileTableItemClick(e, data));
  } 
  
  // Initializes the file explorer on page load
  document.addEventListener('DOMContentLoaded', () => generateFileDirectoryLayout(MOCK_DATA_1));