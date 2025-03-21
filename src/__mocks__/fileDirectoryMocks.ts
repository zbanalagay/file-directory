import { ITreeNode } from '../types';

export const MOCK_DATA_1:ITreeNode[] = [
    {
        type: 'folder',
        name: 'Files',
        modified: new Date('2025-03-21T12:00:00Z'),
        size: 0,
        children: [
            {
                type: 'folder',
                name: 'Documents',
                modified: new Date('2020-07-06T12:00:00Z'),
                size: 0,
                children: [
                    {
                        type: 'folder',
                        name: 'Documents_subfolder1',
                        modified: new Date('2025-02-28T12:00:00Z'),
                        size: 0,
                        children: [
                            {
                                type: 'file',
                                name: 'Documents_subfolder1_file1.txt',
                                modified: new Date('2025-02-28T12:00:00Z'),
                                size: 20
                            },
                            {
                                type: 'file',
                                name: 'Documents_subfolder1_file2.txt',
                                modified: new Date('2020-02-23T12:00:00Z'),
                                size: 30
                            },
                            {
                                type: 'file',
                                name: 'Documents_subfolder1_file3.txt',
                                modified: new Date('2020-02-23T12:00:00Z'),
                                size: 10
                            }
                        ]
                    },
                    {
                        type: 'folder',
                        name: 'Documents_subfolder2',
                        modified: new Date('2025-02-28T12:00:00Z'),
                        size: 0,
                        children: []
                    },
                    {
                        type: 'file',
                        name: 'Documents_file1.ts',
                        modified: new Date('2025-02-28T12:00:00Z'),
                        size: 10
                    },
                    {
                        type: 'file',
                        name: 'Documents_file2.md',
                        modified: new Date('2020-02-28T12:00:00Z'),
                        size: 15
                    },
                ]
            }, {
                type: 'folder',
                name: 'Images',
                modified: new Date('2025-02-28T12:00:00Z'),
                size: 0,
                children: [
                    {
                        type: 'file',
                        name: 'Images_file1.png',
                        modified: new Date('2025-02-28T12:00:00Z'),
                        size: 40
                    },
                    {
                        type: 'file',
                        name: 'Images_file2.png',
                        modified: new Date('2020-02-28T12:00:00Z'),
                        size: 20
                    },
                ]
            }, {
                type: 'folder',
                name: 'System',
                modified:  new Date('2023-04-28T12:00:00Z'),
                size: 0,
                children: [
                    {
                        type: 'file',
                        name: 'System_file1.txt',
                        modified: new Date('2025-02-28T12:00:00Z'),
                        size: 40
                    },
                    {
                        type: 'folder',
                        name: 'System_subfolder1',
                        modified: new Date('2025-02-28T12:00:00Z'),
                        size: 40
                    },
                    {
                        type: 'folder',
                        name: 'System_subfolder2',
                        modified: new Date('2025-02-28T12:00:00Z'),
                        size: 40,
                        children: [
                            {
                                type: 'file',
                                name: 'System_subfolder2_file1.txt',
                                modified: new Date('2023-02-28T12:00:00Z'),
                                size: 20
                            }
                        ]
                    },
                ]
            }, {
                type: 'file',
                name: 'Description.rtf',
                modified: new Date('2020-07-06T12:00:00Z'),
                size: 1,
            },
            {
                type: 'file',
                name: 'Description.txt',
                modified: new Date('2020-07-06T12:00:00Z'),
                size: 1,
            }
        ]
    }, {
        type: 'file',
        name: 'RootFile.txt',
        modified: new Date('2020-07-06T12:00:00Z'),
        size: 5
    },
    {
        type: 'folder',
        name: 'Applications',
        modified: new Date('2020-08-09T12:00:00Z'),
        size: 0,
        children: [
            {
                type: 'file',
                name: 'Applications_file1.txt',
                modified: new Date('2020-07-06T12:00:00Z'),
                size: 5
            },
            {
                type: 'folder',
                name: 'Applications_subfolder1',
                modified: new Date('2020-07-06T12:00:00Z'),
                size: 5,
                children: [
                    {
                        type: 'file',
                        name: 'Applications_subfolder1_file1.rtf',
                        modified: new Date('2020-07-06T12:00:00Z'),
                        size: 10
                    },
                ]
            }
        ]
    }
]