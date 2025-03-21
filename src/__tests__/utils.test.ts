import { ITreeNode } from "../types";
import {doesNodeHaveFolderChildren, findFolderButtonByName, findFolderByName, findParentFolder, formatDate, getClickedFolderButton, getFolderNameFromButton, highlightItem} from '../utils';
import { MOCK_DATA_1 } from "../__mocks__/fileDirectoryMocks";
import { FOLDER_BUTTON_CSS_CLASS } from "../consts";

describe('utils', () => {
    describe('findFolderButtonByName', () => {
        beforeEach(() => {
          document.body.innerHTML = '';
        });
      
        test('should return the button if folder name matches', () => {
          document.body.innerHTML = `
            <div>
              <button class="${FOLDER_BUTTON_CSS_CLASS}">
                <span>▶</span>
                <span>📂</span>
                <span>Documents</span>
              </button>
              <button class="${FOLDER_BUTTON_CSS_CLASS}">
                <span>▶</span>
                <span>📂</span>
                <span>Pictures</span>
              </button>
            </div>
          `;
          const parent = document.body;
          const result = findFolderButtonByName('Documents', parent);
          expect(result).not.toBeNull();
          expect(result?.textContent).toContain('Documents');
        });
      
        test('should return null if no button matches the folder name', () => {
          document.body.innerHTML = `
            <div>
              <button class="${FOLDER_BUTTON_CSS_CLASS}">
                <span>▶</span>
                <span>📂</span>
                <span>Pictures</span>
              </button>
            </div>
          `;
          const result = findFolderButtonByName('Downloads', document.body);
          expect(result).toBeNull();
        });
      
        test('should trim whitespace before comparing folder names', () => {
          document.body.innerHTML = `
            <div>
              <button class="${FOLDER_BUTTON_CSS_CLASS}">
                <span>▶</span>
                <span>📂</span>
                <span>  Notes </span>
              </button>
            </div>
          `;
          const result = findFolderButtonByName('Notes', document.body);
          expect(result).not.toBeNull();
          expect(result?.textContent).toContain('Notes');
        });
      
        test('should return null if no span is found', () => {
          document.body.innerHTML = `
            <div>
              <button class="${FOLDER_BUTTON_CSS_CLASS}">
                <span>Just one span</span>
              </button>
            </div>
          `;
          const result = findFolderButtonByName('Anything', document.body);
          expect(result).toBeNull();
        });
      });
    describe('findFolderByName', () => {
        test('should return the folder node if there is a name match', () => {
            const result = findFolderByName({name: 'Files', data: MOCK_DATA_1})
            expect(result).toBeDefined();
            expect(result).toBe(MOCK_DATA_1[0])
        })

        test('should return a deeply nested folder node if there is a name match', () => {
            const result = findFolderByName({name: 'Documents_subfolder1', data: MOCK_DATA_1})
            expect(result).toBeDefined();
            expect(result).toStrictEqual(expect.objectContaining({name: 'Documents_subfolder1'}))
        })

        test('should return undefined if there is no name match', () => {
            expect(findFolderByName({name: 'ABCDE', data: MOCK_DATA_1})).toBeUndefined()
        })

        test('should return undefined if dataset is empty', () => {
            expect(findFolderByName({name: 'ABCDE', data: []})).toBeUndefined()
        })
    });
    describe('findParentFolder', () => {
        const tree: ITreeNode[] = [
          {
            type: 'folder',
            name: 'Root',
            modified: new Date(),
            size: 0,
            children: [
              {
                type: 'folder',
                name: 'Child',
                modified: new Date(),
                size: 0,
                children: [
                  {
                    type: 'file',
                    name: 'NestedFile.txt',
                    modified: new Date(),
                    size: 10
                  }
                ]
              }
            ]
          }
        ];
      
        test('should return parent folder when direct child is passed', () => {
          const child = tree[0].children?.[0];
          expect(child).toBeDefined();
      
          const result = findParentFolder(child as ITreeNode, tree);
          expect(result).not.toBeNull();
          expect(result?.name).toBe('Root');
        });
      
        test('should return parent folder for deeply nested child', () => {
          const nested = tree[0].children?.[0]?.children?.[0];
          expect(nested).toBeDefined();
      
          const result = findParentFolder(nested as ITreeNode, tree);
          expect(result).not.toBeNull();
          expect(result?.name).toBe('Child');
        });
      
        test('should return null if folder is not in the tree', () => {
          const externalNode: ITreeNode = {
            type: 'folder',
            name: 'External',
            modified: new Date(),
            size: 0,
            children: []
          };
      
          const result = findParentFolder(externalNode, tree);
          expect(result).toBeNull();
        });
      });
    describe('formatDate', () => {
        test('should return the date in MM/DD/YY format', () => {
            expect(formatDate(new Date('2020-08-09T12:00:00Z'))).toBe('08/09/20')
        })
    });
    describe('highlightItem', () => {
        let container: HTMLElement;
        let item1: HTMLElement;
        let item2: HTMLElement;

        beforeEach(() => {
            // Create a container div to act as mock document
            container = document.createElement('div');
            document.body.appendChild(container);

            item1 = document.createElement('div');
            item1.classList.add('folder-button');
            container.appendChild(item1);

            item2 = document.createElement('div');
            item2.classList.add('folder-button');
            container.appendChild(item2);
        });

        afterEach(() => {
            document.body.removeChild(container); // Clean up after each test
        });

        test('should add "selected" class to the given item', () => {
            highlightItem({ item: item1, className: 'folder-button' });
            expect(item1.classList.contains('selected')).toBe(true);
        });

        test('should remove "selected" class from previously selected item', () => {
            item1.classList.add('selected'); // Mock an already selected item
        
            highlightItem({ item: item2, className: 'folder-button' });
        
            expect(item1.classList.contains('selected')).toBe(false);
            expect(item2.classList.contains('selected')).toBe(true);
        });

        test('should only remove "selected" class from elements with the specified class', () => {
            const unrelatedItem = document.createElement('div');
            unrelatedItem.classList.add('mock-other-abc', 'selected'); // Unrelated element with "selected" class
            container.appendChild(unrelatedItem);
        
            highlightItem({ item: item1, className: 'folder-button' });
        
            expect(unrelatedItem.classList.contains('selected')).toBe(true);
            expect(item1.classList.contains('selected')).toBe(true);
          });
    });
    describe('doesNodeHaveFolderChildren', () => {
        test('should return false if the node does not have a children property', () => {
            const testNode: ITreeNode = {
                type: 'folder',
                name: 'Documents',
                modified: new Date('2020-08-09T12:00:00Z'),
                size: 0,
            }
            expect(doesNodeHaveFolderChildren(testNode)).toBe(false);
        });

        test('should return false if children is empty', () => {
            const testNode: ITreeNode = {
                type: 'folder',
                name: 'Documents',
                modified: new Date('2020-08-09T12:00:00Z'),
                size: 0,
                children: []
            }
            expect(doesNodeHaveFolderChildren(testNode)).toBe(false);
        });

        test('should return true if some of the children are of type folder', () => {
            const testNode: ITreeNode = {
                type: 'folder',
                name: 'Documents',
                modified: new Date('2020-08-09T12:00:00Z'),
                size: 0,
                children: [
                    {
                        type: 'file',
                        name: 'file1.txt',
                        modified: new Date('2020-07-06T12:00:00Z'),
                        size: 5
                    },
                    {
                        type: 'folder',
                        name: 'Applications',
                        modified: new Date('2020-07-06T12:00:00Z'),
                        size: 5
                    },
                    {
                        type: 'file',
                        name: 'file3.txt',
                        modified: new Date('2020-07-06T12:00:00Z'),
                        size: 5
                    }
                ]
            }
            expect(doesNodeHaveFolderChildren(testNode)).toBe(true);
        });

        test('should return false if all the children are files', () => {
            const testNode: ITreeNode = {
                type: 'folder',
                name: 'Documents',
                modified: new Date('2020-08-09T12:00:00Z'),
                size: 0,
                children: [
                    {
                        type: 'file',
                        name: 'file1.txt',
                        modified: new Date('2020-07-06T12:00:00Z'),
                        size: 5
                    },
                    {
                        type: 'file',
                        name: 'file2.txt',
                        modified: new Date('2020-07-06T12:00:00Z'),
                        size: 5
                    },
                    {
                        type: 'file',
                        name: 'file3.txt',
                        modified: new Date('2020-07-06T12:00:00Z'),
                        size: 5
                    }
                ]
            }
            expect(doesNodeHaveFolderChildren(testNode)).toBe(false);
        })
    });
    describe('getClickedFolderButton', () => {
        beforeEach(() => {
          document.body.innerHTML = '';
        });
      
        test('should return the folder button when clicked', () => {
          document.body.innerHTML = `
            <button data-type="folder">Folder</button>
          `;
          const button = document.querySelector('button')!;
          const event = { target: button } as unknown as Event;
      
          const result = getClickedFolderButton(event);
          expect(result).toBe(button);
        });
      
        test('should return null if clicked element is not a folder button', () => {
          document.body.innerHTML = `
            <button data-type="file">File</button>
          `;
          const button = document.querySelector('button')!;
          const event = { target: button } as unknown as Event;
      
          const result = getClickedFolderButton(event);
          expect(result).toBeNull();
        });
      
        test('should return null if target is not a button or lacks dataset.type', () => {
          const div = document.createElement('div');
          const event = { target: div } as unknown as Event;
      
          const result = getClickedFolderButton(event);
          expect(result).toBeNull();
        });
      
        test('should work even if target is a child of the button', () => {
          document.body.innerHTML = `
            <button data-type="folder"><span class="inner">Click Me</span></button>
          `;
          const span = document.querySelector('.inner')!;
          const button = document.querySelector('button')!;
          const event = { target: span } as unknown as Event;
      
          const result = getClickedFolderButton(event);
          expect(result).toBe(button);
        });
      });
      describe('getFolderNameFromButton', () => {
        test('should return folder name from data-name attribute if available', () => {
          const button = document.createElement('button');
          button.dataset.name = 'Folder A';
          button.innerHTML = `
            <span>📂</span>
            <span>Wrong Text</span>
          `;
      
          const result = getFolderNameFromButton(button);
          expect(result).toBe('Folder A');
        });
      
        test('should fall back to last span if data-name is not set', () => {
          const button = document.createElement('button');
          button.innerHTML = `
            <span>📂</span>
            <span>   My Folder   </span>
          `;
      
          const result = getFolderNameFromButton(button);
          expect(result).toBe('My Folder');
        });
      
        test('should return null if no span or data-name is found', () => {
          const button = document.createElement('button'); // no spans, no data-name
          const result = getFolderNameFromButton(button);
          expect(result).toBeNull();
        });
      
        test('should return null if last span has no text content', () => {
          const button = document.createElement('button');
          button.innerHTML = `<span></span><span>   </span>`;
          const result = getFolderNameFromButton(button);
          expect(result).toBeNull();
        });
      
        test('should return last span text if multiple spans and no data-name', () => {
          const button = document.createElement('button');
          button.innerHTML = `
            <span>First</span>
            <span>Second</span>
            <span>Target Name</span>
          `;
          const result = getFolderNameFromButton(button);
          expect(result).toBe('Target Name');
        });
      });
})