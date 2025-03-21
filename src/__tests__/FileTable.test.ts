import { MOCK_DATA_1 } from '../__mocks__/fileDirectoryMocks';
import { FOLDER_BUTTON_CSS_CLASS, TABLE_ROW_ITEM_CSS_CLASS } from '../consts';
import { createTableRow, handleFileTableItemClick } from '../FileTable';
import { folderExpansionStateMap } from '../FolderTree';
import * as FileTableModule from '../FileTable';
import {
    highlightItem,
    findFolderByName
  } from '../utils';
import { ITreeNode } from '../types';

jest.mock('../utils');
jest.mock('../FileTable', () => {
  const originalModule = jest.requireActual('../FileTable');
  return {
    ...originalModule,
    toggleFolderExpansionState: jest.fn(),
    showFolderContents: jest.fn(),
  };
});
jest.mock('../FolderTree')

describe('File Table', () => {
    beforeAll(() => {
        jest.spyOn(console, 'warn').mockImplementation(() => {});
      });
    describe('createTableRow', () => {
        test('should create a table row for a folder', () => {
            const fileNode = MOCK_DATA_1[0];
            const row = createTableRow(fileNode);
            expect(row).toBeInstanceOf(HTMLTableRowElement);
            expect((row.querySelector('.col__file-name') as HTMLElement).textContent).toContain('📂Files');
            expect((row.querySelector('.folder-icon') as HTMLElement).textContent).toBe('📂');
            expect((row.querySelector('td:nth-child(3)') as HTMLElement).textContent).toBe('');
        });

        test('should create a table row for a file', () => {
            const fileNode = MOCK_DATA_1[1];
            const row = createTableRow(fileNode);
            expect(row).toBeInstanceOf(HTMLTableRowElement);
            expect((row.querySelector('.col__file-name') as HTMLElement).textContent).toContain('📄RootFile.txt');
            expect((row.querySelector('.folder-icon') as HTMLElement).textContent).toBe('📄');
            expect((row.querySelector('td:nth-child(3)') as HTMLElement).textContent).toBe('5 KB');
        });
    });

    describe('toggleFolderExpansionState', () => {
        let folderMap;
      const mockFolder: ITreeNode = {
        type: 'folder',
        name: 'TestFolder',
        modified: new Date(),
        size: 0,
        children: []
      };

      beforeEach(() => {
        folderExpansionStateMap.clear();
      });

      test('should set expansion state to true if not previously set', () => {
        const fn = jest.requireActual('../FileTable').toggleFolderExpansionState;
        fn(mockFolder);
        expect(folderExpansionStateMap.get('TestFolder')).toBe(true);
      });

      test('should toggle expansion state from true to false', () => {
        folderExpansionStateMap.set('TestFolder', true);
        const fn = jest.requireActual('../FileTable').toggleFolderExpansionState;
        fn(mockFolder);
        expect(folderExpansionStateMap.get('TestFolder')).toBe(false);
      });

      test('should toggle expansion state from false to true', () => {
        folderExpansionStateMap.set('TestFolder', false);
        const fn = jest.requireActual('../FileTable').toggleFolderExpansionState;
        fn(mockFolder);
        expect(folderExpansionStateMap.get('TestFolder')).toBe(true);
      });
    });

    describe('handleFileTableItemClick', () => {
      const mockData: ITreeNode[] = [
        {
          type: 'folder',
          name: 'MyFolder',
          modified: new Date(),
          size: 0,
          children: []
        }
      ];

      beforeEach(() => {
        jest.clearAllMocks();
        document.body.innerHTML = `
          <table>
            <tbody>
              <tr class="${TABLE_ROW_ITEM_CSS_CLASS}">
                <td>
                  <button class="${FOLDER_BUTTON_CSS_CLASS}" data-name="MyFolder">
                    MyFolder
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        `;
      });

      test('should highlight the table row if clicked', () => {
        const event = {
          target: document.querySelector('tr') as HTMLElement
        } as unknown as Event;

        handleFileTableItemClick(event, mockData);
        expect(highlightItem).toHaveBeenCalledWith({
          item: event.target,
          className: TABLE_ROW_ITEM_CSS_CLASS
        });
      });

      test('should call toggle and update views for valid folder button click', () => {
        const button = document.querySelector(`.${FOLDER_BUTTON_CSS_CLASS}`)!;

        (findFolderByName as jest.Mock).mockReturnValue(mockData[0]);

        const event = {
          target: button
        } as unknown as Event;

        handleFileTableItemClick(event, mockData);

        expect(findFolderByName).toHaveBeenCalledWith({ name: 'MyFolder', data: mockData });
      });

      test('should not throw if clicked element is not inside tr or button', () => {
        const orphanDiv = document.createElement('div');
        const event = { target: orphanDiv } as unknown as Event;

        expect(() => handleFileTableItemClick(event, mockData)).not.toThrow();
        expect(highlightItem).not.toHaveBeenCalled();
        expect(FileTableModule.toggleFolderExpansionState).not.toHaveBeenCalled();
      });
    });
});