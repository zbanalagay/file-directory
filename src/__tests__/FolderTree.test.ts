import { MOCK_DATA_1 } from '../__mocks__/fileDirectoryMocks';
import {
  createFolderButton,
  generateLeftPaneFolderTree,
  createFolderExplorer,
  findFolderButtonInLeftPane,
  expandFolderElement,
  expandAncestorFolders,
  collapseFolderElement,
  showSelectedFolderContents,
  collapseDescendantFolders,
  resetFolderArrowsWithin,
  toggleFolderOpenState
} from '../FolderTree';
import {
  doesNodeHaveFolderChildren,
  findFolderButtonByName,
  findFolderByName,
  getFolderNameFromButton
} from '../utils';
import {
  COLLAPSED_ARROW,
  COLLAPSED_CSS_CLASS,
  EXPANDED_ARROW,
  FOLDER_ARROW_CSS_CLASS,
  FOLDER_BUTTON_CSS_CLASS,
  FOLDER_ICON,
  FOLDER_ICON_CSS_CLASS
} from '../consts';
import { ITreeNode } from '../types';
import { showFolderContents } from '../FileTable';

jest.mock('../utils');
jest.mock('../FileTable');


describe('Folder Tree', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
        document.body.innerHTML = '';
    });
    describe('generateLeftPaneFolderTree', () => {

        test('should call createFolderExplorer if there is a left pane element found', async () => {
            const spy = jest.spyOn(require('../FolderTree'), 'createFolderExplorer').mockImplementation(() => {});
            document.body.innerHTML = `<div id="left-pane"></div>`;
        
            generateLeftPaneFolderTree(MOCK_DATA_1);
            // allows the JavaScript runtime to process the DOM updates and function calls in the event loop
            setTimeout(() => {
                expect(spy).toHaveBeenCalled();
                expect(spy).toHaveBeenCalledWith({
                    data: MOCK_DATA_1,
                    parentElement: expect.any(HTMLElement)
                });
            }, 0);
        });

        test('should return null if there is no left pane element found', () => {
            document.body.innerHTML = '';
            expect(generateLeftPaneFolderTree(MOCK_DATA_1)).toBeNull();
        });
    });
    describe('createFolderExplorer', () => {
       test('should not show and iterate through nodes of type file', () => {
            const testData: ITreeNode[] = [{type: 'file', name: 'Test File.txt', modified: new Date('2020-07-06T12:00:00Z'), size: 10}]
            const testParentElement = document.createElement('ul');
            document.body.appendChild(testParentElement)
            createFolderExplorer({data: testData, parentElement: testParentElement})
            expect(testParentElement.querySelector('li')).toBeFalsy();
            expect(doesNodeHaveFolderChildren).not.toHaveBeenCalled()

       });
        test('should create a folder button and li element and append the button to the li and the li to the parent Element', () => {
            const testData: ITreeNode[] = [{type: 'folder', name: 'Test Folder', modified: new Date('2020-07-06T12:00:00Z'), size: 10}]
            const testParentElement = document.createElement('ul');
            document.body.appendChild(testParentElement)
            createFolderExplorer({data: testData, parentElement: testParentElement})
            const resultLi = testParentElement.querySelector('li')
            expect(resultLi).toBeTruthy();
            expect(resultLi?.querySelector('button')).toBeTruthy();
            expect(doesNodeHaveFolderChildren).toHaveBeenCalled()
        });
        test('should render the folder structure recursively', () => {
        (doesNodeHaveFolderChildren as jest.Mock).mockImplementation((node: ITreeNode) => Array.isArray(node.children) && node.children.length > 0)
            const testData: ITreeNode[] = [
                {
                    type: 'folder',
                    name: 'Root',
                    modified: new Date('2020-07-06T12:00:00Z'),
                    size: 10,
                    children: [
                        {
                            type: 'folder',
                            name: 'Child',
                            modified: new Date('2020-07-06T12:00:00Z'),
                            size: 10,
                            children: [
                                {
                                    type: 'folder',
                                    name: 'Grandchild',
                                    modified: new Date('2020-07-06T12:00:00Z'),
                                    size: 10,
                                }
                            ]
                        }
                    ]
                }
            ]
            const testParentElement = document.createElement('ul');
            createFolderExplorer({ data: testData, parentElement: testParentElement });

            const rootLi = testParentElement.querySelector('li');
            expect(rootLi).toBeTruthy();
            expect(rootLi?.textContent).toContain('Root');

            const nestedUl = rootLi?.querySelector('ul');
            expect(nestedUl).toBeTruthy();
            expect(nestedUl?.classList.contains(COLLAPSED_CSS_CLASS)).toBe(true);
            const childButton = nestedUl?.querySelector(`.${FOLDER_BUTTON_CSS_CLASS}`);
            expect(childButton?.textContent).toContain('Child');

            const allButtons = testParentElement.querySelectorAll(`.${FOLDER_BUTTON_CSS_CLASS}`);
            const grandchildButton = Array.from(allButtons).find(btn =>
            btn.textContent?.includes('Grandchild')
            );

            expect(grandchildButton).toBeTruthy();
            expect(grandchildButton?.textContent).toContain('Grandchild');
        })
    });

    describe('createFolderButton', () => {
        test('should create a folder button', () => {
            (doesNodeHaveFolderChildren as jest.Mock).mockReturnValue(true);
            const testNode = MOCK_DATA_1[0];
            const button = createFolderButton(testNode);
            expect(button.classList.contains(FOLDER_BUTTON_CSS_CLASS)).toBe(true);
            expect((button.querySelector(`.${FOLDER_ARROW_CSS_CLASS}`) as HTMLElement).textContent).toBe(COLLAPSED_ARROW);
            expect((button.querySelector(`.${FOLDER_ICON_CSS_CLASS}`) as HTMLElement).textContent).toBe(FOLDER_ICON);
            const nameText = Array.from(button.childNodes).filter(n => n.nodeType === Node.ELEMENT_NODE && n.textContent === 'Files')[0];
            expect(nameText).toBeTruthy();
        })
        test('should not have an expand collapse arrow if there are no children with type folder', () => {
            (doesNodeHaveFolderChildren as jest.Mock).mockReturnValue(false);
            const testNode: ITreeNode = {type: 'folder', name: 'Documents', modified: new Date('2020-07-06T12:00:00Z'), size: 10, children: [{
                type: 'file',
                name: 'Documents_file1.png',
                modified: new Date('2025-02-28T12:00:00Z'),
                size: 40
            },
            {
                type: 'file',
                name: 'Documents_file2.png',
                modified: new Date('2020-02-28T12:00:00Z'),
                size: 20
            },]}
            const button = createFolderButton(testNode);
            expect((button.querySelector(`.${FOLDER_ARROW_CSS_CLASS}`) as HTMLElement).textContent).toBe('\u00A0');
        })
    });

    describe('findFolderButtonInLeftPane', () => {
        test('should return null if cannot find the left-pane element', () => {
            document.body.innerHTML = `<div id="left-pane"></div>`;
            findFolderButtonInLeftPane('ABCD')
            expect(findFolderButtonByName).toHaveBeenCalled();
        })
        test('should call findFolderButtonByName if left-pane is found', () => {
            document.body.innerHTML = '';
            expect(findFolderButtonInLeftPane('ABCD')).toBeNull();
        })
    });

    describe('expandFolderElement', () => {
        let folderButton: HTMLElement;

        const data: ITreeNode[] = [
            {
            type: 'folder',
            name: 'Folder',
            modified: new Date(),
            size: 0,
            children: [
                {
                type: 'folder',
                name: 'Child',
                modified: new Date(),
                size: 0,
                children: []
                }
            ]
            }
        ];

        beforeEach(() => {
            document.body.innerHTML = `
            <ul>
                <li>
                <button class="folder-button" data-name="Folder">
                    <span class="${FOLDER_ARROW_CSS_CLASS}">▶</span>
                    <span>📂</span>
                    <span>Folder</span>
                </button>
                <ul class="${COLLAPSED_CSS_CLASS}">
                    <li><button>Child</button></li>
                </ul>
                </li>
            </ul>
            `;

            folderButton = document.querySelector('.folder-button') as HTMLElement;

            // Ensure the folder lookup returns something valid
            jest.mocked(findFolderByName).mockReturnValue(data[0]);
            jest.mocked(doesNodeHaveFolderChildren).mockReturnValue(true);
            jest.mocked(getFolderNameFromButton).mockImplementation((button: HTMLElement) =>
            button.dataset.name ?? null
            );
        });

        afterEach(() => {
            document.body.innerHTML = '';
            jest.clearAllMocks();
        });
      
        test('should do nothing if folderButton is not inside an <li>', () => {
          const orphanButton = document.createElement('button');
          expect(() => expandFolderElement({ folderButton: orphanButton, data })).not.toThrow();
        });
      
        test('should do nothing if no nested <ul> exists', () => {
          const li = folderButton.closest('li');
          li?.querySelector('ul')?.remove(); // simulate no nested <ul>
      
          expect(() => expandFolderElement({ folderButton, data })).not.toThrow();
        });
      
        test('should remove collapsed class from nested <ul>', () => {
          const nestedUl = folderButton.closest('li')?.querySelector('ul');
          expect(nestedUl?.classList.contains(COLLAPSED_CSS_CLASS)).toBe(true);
      
          expandFolderElement({ folderButton, data });
      
          expect(nestedUl?.classList.contains(COLLAPSED_CSS_CLASS)).toBe(false);
        });
      
        test('should do nothing if arrow span is missing', () => {
          const arrow = folderButton.querySelector(`.${FOLDER_ARROW_CSS_CLASS}`);
          arrow?.remove(); // simulate no arrow span
      
          expect(() => expandFolderElement({ folderButton, data })).not.toThrow();
        });
      
        
        test('should set arrow span to expanded arrow if folder has folder children', () => {
            const arrowSpan = folderButton.querySelector(`.${FOLDER_ARROW_CSS_CLASS}`);
            expect(arrowSpan?.textContent).not.toBe(EXPANDED_ARROW);

            expandFolderElement({ folderButton, data: data });

            const updatedArrow = folderButton.querySelector(`.${FOLDER_ARROW_CSS_CLASS}`);
            expect(updatedArrow?.textContent).toBe(EXPANDED_ARROW);
        });
      
        test('should set arrow span to non-breaking space if no folder children', () => {
            (doesNodeHaveFolderChildren as jest.Mock).mockReturnValue(false);
            const noChildData: ITreeNode[] = [
              {
                type: 'folder',
                name: 'EmptyFolder',
                modified: new Date(),
                size: 0,
                children: []
              }
            ];
          
            document.body.innerHTML = `
              <ul>
                <li>
                  <button class="folder-button" data-name="EmptyFolder">
                    <span class="${FOLDER_ARROW_CSS_CLASS}">▶</span>
                    <span>📂</span>
                    <span>EmptyFolder</span>
                  </button>
                  <ul class="${COLLAPSED_CSS_CLASS}"></ul>
                </li>
              </ul>
            `;
          
            const button = document.querySelector('.folder-button') as HTMLElement;
            expandFolderElement({ folderButton: button, data: noChildData });
          
            const updatedArrow = button.querySelector(`.${FOLDER_ARROW_CSS_CLASS}`);
            expect(updatedArrow?.textContent).toBe('\u00A0');
          });
      });
    
    describe('expandAncestorFolders', () => {
        let grandchildButton: HTMLElement;
        const data: ITreeNode[] = [
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
                      type: 'folder',
                      name: 'Grandchild',
                      modified: new Date(),
                      size: 0,
                      children: [],
                    },
                  ],
                },
              ],
            },
          ];
          
        beforeEach(() => {
            document.body.innerHTML = `
            <ul class="${COLLAPSED_CSS_CLASS}">
              <li>
                <button class="${FOLDER_BUTTON_CSS_CLASS}" data-name="Root">
                  <span class="${FOLDER_ARROW_CSS_CLASS}">▶</span>
                  <span>📂</span>
                  <span>Root</span>
                </button>
                <ul class="${COLLAPSED_CSS_CLASS}">
                  <li>
                    <button class="${FOLDER_BUTTON_CSS_CLASS}" data-name="Child">
                      <span class="${FOLDER_ARROW_CSS_CLASS}">▶</span>
                      <span>📂</span>
                      <span>Child</span>
                    </button>
                    <ul class="${COLLAPSED_CSS_CLASS}">
                      <li>
                        <button class="${FOLDER_BUTTON_CSS_CLASS}" data-name="Grandchild">
                          <span class="${FOLDER_ARROW_CSS_CLASS}">▶</span>
                          <span>📂</span>
                          <span>Grandchild</span>
                        </button>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          `;

            grandchildButton = Array.from(document.querySelectorAll(`.${FOLDER_BUTTON_CSS_CLASS}`)).find(button =>
            button.textContent?.includes('Grandchild')
            ) as HTMLElement;
        });

        afterEach(() => {
            document.body.innerHTML = '';
        });
        test('should remove collapsed class from all ancestor <ul> elements', () => {
            const allAncestorUls = document.querySelectorAll('ul');
            allAncestorUls.forEach(ul =>
              expect(ul.classList.contains(COLLAPSED_CSS_CLASS)).toBe(true)
            );
        
            expandAncestorFolders({folderButton: grandchildButton, data});
            allAncestorUls.forEach(ul =>
              expect(ul.classList.contains(COLLAPSED_CSS_CLASS)).toBe(false)
            );
          });
        
          test('should update all ancestor folder arrow spans to expanded', () => {
            jest.mocked(findFolderByName).mockImplementation(({ name, data }: { name: string, data: ITreeNode[] }) => {
                for (const node of data) {
                  if (node.name === name) return node;
                  if (node.children) {
                    const found = findFolderByName({ name, data: node.children });
                    if (found) return found;
                  }
                }
                return undefined;
              });
              
            jest.mocked(doesNodeHaveFolderChildren).mockImplementation((node) => {
            return node.children?.some(child => child.type === 'folder') ?? false;
            });
            expandAncestorFolders({folderButton: grandchildButton, data});
          
            // Expect Root and Child arrows to be expanded
            const rootButton = Array.from(document.querySelectorAll(`.${FOLDER_BUTTON_CSS_CLASS}`)).find(btn =>
              btn.textContent?.includes('Root')
            ) as HTMLElement;
            const childButton = Array.from(document.querySelectorAll(`.${FOLDER_BUTTON_CSS_CLASS}`)).find(btn =>
              btn.textContent?.includes('Child')
            ) as HTMLElement;
            const grandchildArrow = grandchildButton.querySelector(`.${FOLDER_ARROW_CSS_CLASS}`);
            const rootArrow = rootButton.querySelector(`.${FOLDER_ARROW_CSS_CLASS}`);
            const childArrow = childButton.querySelector(`.${FOLDER_ARROW_CSS_CLASS}`);
          
            expect(rootArrow?.textContent).toBe(EXPANDED_ARROW);
            expect(childArrow?.textContent).toBe(EXPANDED_ARROW);
          
            // The grandchild's arrow should remain unchanged
            expect(grandchildArrow?.textContent).toBe(COLLAPSED_ARROW);
          });
        
          test('should do nothing if folderButton is not in a <li>', () => {
            const orphanButton = document.createElement('button');
            expect(() => expandAncestorFolders({folderButton: orphanButton, data})).not.toThrow();
          });
        
          test('should do nothing if a parent <ul> is missing', () => {
            const childLi = grandchildButton.closest('li')!;
            const parentUl = childLi.parentElement!;
            parentUl.remove(); // simulate corrupt DOM/ missing UL
        
            expect(() => expandAncestorFolders({folderButton: grandchildButton, data})).not.toThrow();
          });
    })

    describe('collapseFolderElement', () => {
        let folderButton: HTMLElement;
        
        const data: ITreeNode[] = [
            {
              type: 'folder',
              name: 'Folder',
              modified: new Date(),
              size: 0,
              children: [
                {
                  type: 'folder',
                  name: 'Nested',
                  modified: new Date(),
                  size: 0,
                  children: [],
                },
              ],
            },
          ];
        beforeEach(() => {
            document.body.innerHTML = `
                <ul>
                <li>
                    <button class="${FOLDER_BUTTON_CSS_CLASS}" data-name="Folder">
                    <span class="${FOLDER_ARROW_CSS_CLASS}">▼</span>
                    <span>📂</span>
                    <span>Folder</span>
                    </button>
                    <ul>
                    <li><button>Nested</button></li>
                    </ul>
                </li>
                </ul>
            `;
          folderButton = document.querySelector(`.${FOLDER_BUTTON_CSS_CLASS}`)!;
        });
    
      
        afterEach(() => {
          document.body.innerHTML = '';
        });
        test('should do nothing if button is not in an <li>', () => {
            const orphanButton = document.createElement('button');
            expect(() => collapseFolderElement({folderButton: orphanButton, data})).not.toThrow();
        });

        test('should do nothing if no <ul> exists', () => {
            const li = folderButton.closest('li')!;
            li.querySelector('ul')?.remove(); // simulate no nested <ul>
        
            expect(() => collapseFolderElement({folderButton, data})).not.toThrow();
        });

        test('should add collapsed class to nested <ul>', () => {
          const nestedUl = folderButton.closest('li')?.querySelector('ul')!;
          expect(nestedUl.classList.contains(COLLAPSED_CSS_CLASS)).toBe(false);
      
          collapseFolderElement({folderButton, data});
      
          expect(nestedUl.classList.contains(COLLAPSED_CSS_CLASS)).toBe(true);
        });
        test('should do nothing if arrow span is missing', () => {
            const arrow = folderButton.querySelector(`.${FOLDER_ARROW_CSS_CLASS}`);
            arrow?.remove();    // simulate no arrow
        
            expect(() => collapseFolderElement({folderButton, data})).not.toThrow();
          });
        test('should update arrow span to collapsed arrow', () => {
          const arrowSpan = folderButton.querySelector(`.${FOLDER_ARROW_CSS_CLASS}`)!;
          expect(arrowSpan.textContent).not.toBe(COLLAPSED_ARROW);
      
          collapseFolderElement({folderButton, data});
      
          expect(arrowSpan.textContent).toBe(COLLAPSED_ARROW);
        });
        
      });

    describe('showSelectedFolderContents', () => {
        const testData: ITreeNode = {
            type: 'folder',
            name: 'Documents',
            modified: new Date('2020-01-01'),
            size: 100,
            children: []
          };
        
          beforeEach(() => {
            jest.clearAllMocks();
            document.body.innerHTML = '';
          });
          test('should do nothing if no selected button exists', () => {
            showSelectedFolderContents([testData]);
        
            expect(findFolderByName).not.toHaveBeenCalled();
            expect(showFolderContents).not.toHaveBeenCalled();
          });
        
          test('should call showFolderContents with selected folder if found', () => {
            document.body.innerHTML = `
              <button class="${FOLDER_BUTTON_CSS_CLASS} selected">
                <span>📂</span>
                <span>Documents</span>
              </button>
            `;
        
            (findFolderByName as jest.Mock).mockReturnValue(testData);
        
            showSelectedFolderContents([testData]);
        
            expect(findFolderByName).toHaveBeenCalledWith({ name: 'Documents', data: [testData] });
            expect(showFolderContents).toHaveBeenCalledWith(testData);
          });

          test('should do nothing if selected button has no valid name', () => {
            document.body.innerHTML = `
              <button class="${FOLDER_BUTTON_CSS_CLASS} selected">
                <span>📂</span>
                <span></span>
              </button>
            `;
        
            showSelectedFolderContents([testData]);
        
            expect(findFolderByName).not.toHaveBeenCalled();
            expect(showFolderContents).not.toHaveBeenCalled();
          });
        
          test('should do nothing if folder is not found in tree', () => {
            document.body.innerHTML = `
              <button class="${FOLDER_BUTTON_CSS_CLASS} selected">
                <span>📂</span>
                <span>Documents</span>
              </button>
            `;
        
            (findFolderByName as jest.Mock).mockReturnValue(undefined);
        
            showSelectedFolderContents([testData]);
        
            expect(findFolderByName).toHaveBeenCalled();
            expect(showFolderContents).not.toHaveBeenCalled();
          });
    });

    describe('collapseDescendantFolders', () => {
        let parentLi: HTMLElement;

        beforeEach(() => {
            document.body.innerHTML = `
                <ul>
                    <li id="target">
                    <ul><li><button>Nested 1</button></li></ul>
                    <ul><li><button>Nested 2</button></li></ul>
                    </li>
                </ul>
            `;
            parentLi = document.getElementById('target')!;
        });

        afterEach(() => {
            document.body.innerHTML = '';
        });

        test('should add collapsed class to all descendant <ul> elements', () => {
            const nestedUls = parentLi.querySelectorAll('ul');
            nestedUls.forEach(ul => {
            expect(ul.classList.contains(COLLAPSED_CSS_CLASS)).toBe(false);
            });

            collapseDescendantFolders(parentLi);

            nestedUls.forEach(ul => {
            expect(ul.classList.contains(COLLAPSED_CSS_CLASS)).toBe(true);
            });
        });

        test('should do nothing if no nested <ul> elements exist', () => {
            const emptyLi = document.createElement('li');
            expect(() => collapseDescendantFolders(emptyLi)).not.toThrow();
            expect(emptyLi.querySelector('ul')).toBeNull();
        });
    })

    
    describe('resetFolderArrowsWithin', () => {
        const mockData: ITreeNode[] = [
        {
            type: 'folder',
            name: 'Parent',
            modified: new Date(),
            size: 0,
            children: [{ type: 'folder', name: 'Child', modified: new Date(), size: 0 }]
        },
        {
            type: 'folder',
            name: 'EmptyFolder',
            modified: new Date(),
            size: 0,
            children: []
        }
        ];
    
        beforeEach(() => {
        jest.clearAllMocks();
        document.body.innerHTML = `
            <ul>
            <li id="test-folder">
                <button class="${FOLDER_BUTTON_CSS_CLASS}">
                <span class="${FOLDER_ARROW_CSS_CLASS}">▼</span>
                <span>Parent</span>
                </button>
                <button class="${FOLDER_BUTTON_CSS_CLASS}">
                <span class="${FOLDER_ARROW_CSS_CLASS}">▼</span>
                <span>EmptyFolder</span>
                </button>
            </li>
            </ul>
        `;
        });
    
        afterEach(() => {
        document.body.innerHTML = '';
        });
    
        test('should set arrow to COLLAPSED_ARROW if folder has children', () => {
            (findFolderByName as jest.Mock).mockImplementation(({ name }) => mockData.find(f => f.name === name));
            (doesNodeHaveFolderChildren as jest.Mock).mockImplementation(folder => folder.name === 'Parent');
        
            const parentLi = document.getElementById('test-folder')!;
            resetFolderArrowsWithin({parentLi, data: mockData});
        
            const parentArrow = parentLi.querySelector(`.${FOLDER_ARROW_CSS_CLASS}`)!;
            expect(parentArrow.textContent).toBe(COLLAPSED_ARROW);
        });
    
        test('should not change arrow if folder has no children', () => {
            (findFolderByName as jest.Mock).mockImplementation(({ name }) => mockData.find(f => f.name === name));
            (doesNodeHaveFolderChildren as jest.Mock).mockReturnValue(false);
        
            const parentLi = document.getElementById('test-folder')!;
            resetFolderArrowsWithin({parentLi, data: mockData});
        
            const arrows = parentLi.querySelectorAll(`.${FOLDER_ARROW_CSS_CLASS}`);
            arrows.forEach(arrow => {
                expect(arrow.textContent).not.toBe(COLLAPSED_ARROW);
            });
        });
    
        test('should do nothing if folder not found in tree data', () => {
            (findFolderByName as jest.Mock).mockReturnValue(undefined);
        
            const parentLi = document.getElementById('test-folder')!;
            expect(() => resetFolderArrowsWithin({parentLi, data: mockData})).not.toThrow();
        });
    
        test('should do nothing if arrow span is missing', () => {
            const arrowSpan = document.querySelector(`.${FOLDER_ARROW_CSS_CLASS}`);
            arrowSpan?.remove(); // simulate missing arrow
        
            (findFolderByName as jest.Mock).mockReturnValue(mockData[0]);
            (doesNodeHaveFolderChildren as jest.Mock).mockReturnValue(true);
        
            const parentLi = document.getElementById('test-folder')!;
            expect(() => resetFolderArrowsWithin({parentLi, data: mockData})).not.toThrow();
        });
    });
    describe('toggleFolderOpenState', () => {
        const mockData: ITreeNode[] = [];
      
        beforeEach(() => {
          document.body.innerHTML = `
            <ul>
              <li>
                <button class="${FOLDER_BUTTON_CSS_CLASS}">
                  <span class="${FOLDER_ARROW_CSS_CLASS}">▶</span>
                  <span>📂</span>
                  <span>Folder</span>
                </button>
                <ul class="${COLLAPSED_CSS_CLASS}">
                  <li><button>Nested</button></li>
                </ul>
              </li>
            </ul>
          `;
    
        });
      
        afterEach(() => {
          document.body.innerHTML = '';
        });
      
        test('should expand collapsed folder: removes class and updates arrow', () => {
            const button = document.querySelector(`.${FOLDER_BUTTON_CSS_CLASS}`) as HTMLButtonElement;
            const nestedUl = button.closest('li')?.querySelector('ul') as HTMLUListElement;
            const arrowSpan = button.querySelector(`.${FOLDER_ARROW_CSS_CLASS}`) as HTMLElement;
        
            expect(nestedUl.classList.contains(COLLAPSED_CSS_CLASS)).toBe(true);
        
            toggleFolderOpenState({button, data: mockData});
        
            expect(nestedUl.classList.contains(COLLAPSED_CSS_CLASS)).toBe(false);
            expect(arrowSpan.textContent).toBe(EXPANDED_ARROW);
          });;
        
          test('should handle missing arrow span gracefully', () => {
            const button = document.querySelector(`.${FOLDER_BUTTON_CSS_CLASS}`) as HTMLButtonElement;
            const arrow = button.querySelector(`.${FOLDER_ARROW_CSS_CLASS}`);
            arrow?.remove(); // simulate no arrow span
        
            expect(() => toggleFolderOpenState({button, data: mockData})).not.toThrow();
          });
        
          test('should handle missing nestedUl gracefully', () => {
            const button = document.querySelector(`.${FOLDER_BUTTON_CSS_CLASS}`) as HTMLButtonElement;
            const li = button.closest('li')!;
            const nestedUl = li.querySelector('ul');
            nestedUl?.remove(); // simulate no nested folder
        
            expect(() => toggleFolderOpenState({button, data: mockData})).not.toThrow();
          });
        
      });
})
