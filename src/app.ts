import { ITreeNode } from "./types";
import { MOCK_DATA_1 } from "./__mocks__/fileDirectoryMocks.js";
import {handleFolderClick} from './components/Folder.js'
import {generateLeftPaneFolderTree} from './components/FolderTree.js'
import {generateRightPaneFolderTable } from "./components/FolderTable.js";

  // Function to generate the full layout
  function generateFileDirectoryLayout(data: ITreeNode[]) {
    // Create the main container
    const container = document.createElement('div');
    container.classList.add('file-explorer');
  
    const leftPane = generateLeftPaneFolderTree(data)
    const rightPane = generateRightPaneFolderTable(data)
  
    container.appendChild(leftPane);
    container.appendChild(rightPane);
  
    document.body.appendChild(container);
  
    // Event delegation to handle folder clicks
    leftPane.addEventListener('click', (e) => handleFolderClick(e, data));
    rightPane.addEventListener('click', (e) => handleFolderClick(e, data));
  }
  
  // Initializes the file explorer on page load
  document.addEventListener('DOMContentLoaded', () => generateFileDirectoryLayout(MOCK_DATA_1));