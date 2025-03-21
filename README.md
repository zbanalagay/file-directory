# File Explorer

A basic file explorer implemented with vanilla JavaScript/TypeScript. This project provides a user interface for exploring a file system, displaying a directory tree in a left pane and a file list in a right pane. The system allows users to expand and collapse folders and view files within them.

## Features

- A sidebar (left pane) displaying the folder tree.
- A table (right pane) showing files and folders within the selected directory.
- Expandable and collapsible folders in the folder tree.
- Basic unit tests using Jest to demonstrate the ability to test the application.

## Installation

To get started with this project, follow these steps:

Install the dependencies:

```bash
npm install
```

Start the application:

```bash
npm start
```

This will launch the file explorer UI in your browser at `http://localhost:8080/`

## Running Tests

To run the unit tests, use the following command:

```bash
npm test
```

The tests are written using Jest and ensure basic functionality for the file explorer.

## Data Format

The data used to represent the node structure is in the following format:

```typescript
interface ITreeNode {
  type: "file" | "folder";
  name: string;
  modified: Date;
  size: number;
  children?: ITreeNode[];
}
```

## Approach

### Storing state in HTML/CSS

In this project, I chose to manage expansion state in HTML/CSS than JavaScript
While there is an alternative approach of storing the state of expansion/collapse and parent node references on the data itself (or a copy of the data), the way I interpreted the requirements is that we wanted the TreeNodes to be a specific data structure (see Data Format's ITreeNode structure) and so I chose to approach it with HTML CSS.
