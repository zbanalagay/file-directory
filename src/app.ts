import { ITreeNode } from "./types";
import { MOCK_DATA_1 } from "./__mocks__/fileDirectoryMocks.js";

export function createFileTree(data: ITreeNode[]) {
    // Create the unordered list parent - To be returned at the end of func.
    const ul = document.createElement("ul");

    for (const node of data) {
        const li = document.createElement("li");

        if (node.type === 'folder') {
            // Use a button for folders since they are clickable
            const button = document.createElement("button");
            button.textContent = node.name;
            button.dataset.type = "folder";
            // button.classList.add("folder-button"); // Add a class for styling or targeting

            li.appendChild(button);

            // Recursively handle children (folders)
            if (node.children && node.children.length) {
                const nestedUl = createFileTree(node.children);
                nestedUl.style.display = "none"; // Initially hide the nested children
                li.appendChild(nestedUl); // Append the nested list
            }

        } else if (node.type === 'file') {
            // Handle file items (no buttons for files)
            li.textContent = node.name;
        }

        ul.appendChild(li);
    }

    return ul;
}

document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("file-system");
    if (root) {
        root.appendChild(createFileTree(MOCK_DATA_1));

        // Event delegation on root to handle clicks on folder buttons
        root.addEventListener("click", (event) => {
            const target = event.target as HTMLElement;
            if (target && target.tagName === "BUTTON" && target.dataset.type === "folder") {
                const nestedUl = target.nextElementSibling as HTMLElement; // Get the next <ul> element

                if (nestedUl) {
                    // Toggle the display of the nested <ul> (expand/collapse)
                    nestedUl.style.display = nestedUl.style.display === "none" ? "block" : "none";
                }
            }
        });
    }
});
