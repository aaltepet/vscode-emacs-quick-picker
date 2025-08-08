import * as fs from "node:fs";
import path from "node:path";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand(
		"ido-file-explorer.open",
		() => {
			show();
		},
	);

	context.subscriptions.push(disposable);
}

interface FileItem extends vscode.QuickPickItem {
	uri: vscode.Uri;
	isDirectory: boolean;
	isFile: boolean;
	isCreateFile?: boolean;
}

let currentPath: string = "";

export function getRelativePath(fullPath: string): string {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (workspaceFolders && workspaceFolders.length > 0) {
		const workspaceRoot = workspaceFolders[0].uri.fsPath;
		if (fullPath.startsWith(workspaceRoot)) {
			const relativePath = fullPath.substring(workspaceRoot.length);
			// Remove leading slash if present (handle both / and \)
			let result = relativePath;
			if (relativePath.startsWith(path.sep) || relativePath.startsWith("\\")) {
				result = relativePath.substring(1);
			}
			// Add trailing slash for directories (except workspace root)
			if (result !== "" && !result.endsWith("/")) {
				result += "/";
			}
			return result;
		}
	}
	return fullPath;
}

export function getFullPath(relativePath: string): string {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (workspaceFolders && workspaceFolders.length > 0) {
		const workspaceRoot = workspaceFolders[0].uri.fsPath;
		return path.join(workspaceRoot, relativePath);
	}
	return relativePath;
}

async function show() {
	// Get current file's directory
	const activeEditor = vscode.window.activeTextEditor;
	if (activeEditor) {
		currentPath = path.dirname(activeEditor.document.uri.fsPath);
	} else {
		// Fallback to workspace root
		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (workspaceFolders && workspaceFolders.length > 0) {
			currentPath = workspaceFolders[0].uri.fsPath;
		} else {
			vscode.window.showErrorMessage("No workspace or active file found");
			return;
		}
	}

	showQuickPick();
}

async function showQuickPick() {
	const quickPick = vscode.window.createQuickPick<FileItem>();
	quickPick.title = `>>> ${getRelativePath(currentPath)}`;
	quickPick.placeholder = "Type to filter files, backspace to go up";

	// Initialize items
	await (async () => {
		const items = await getDirectoryItems();
		quickPick.items = items;
	})();

	// Handle Enter key for selection
	quickPick.onDidAccept(async () => {
		const selected = quickPick.selectedItems[0];
		if (selected) {
			if (selected.label === "..") {
				// Go up one directory
				await navigateToPathAndUpdateQuickPick(
					quickPick,
					path.dirname(currentPath),
				);
			} else if (selected.isCreateFile) {
				// Create new file
				try {
					// Create the file with empty content
					await fs.promises.writeFile(selected.uri.fsPath, "");

					// Open the newly created file
					const document = await vscode.workspace.openTextDocument(
						selected.uri,
					);
					await vscode.window.showTextDocument(document);
					quickPick.hide();
				} catch (error) {
					vscode.window.showErrorMessage(`Failed to create file: ${error}`);
				}
			} else if (selected.isDirectory) {
				// Navigate into directory
				await navigateToPathAndUpdateQuickPick(quickPick, selected.uri.fsPath);
			} else {
				// Open file
				const document = await vscode.workspace.openTextDocument(selected.uri);
				await vscode.window.showTextDocument(document);
				quickPick.hide();
			}
		}
	});

	// Handle typing and deletion for path navigation
	quickPick.onDidChangeValue(async (value: string) => {
		// Get current items from QuickPick (these are the actual current items)
		const currentItems = quickPick.items.filter((item) => !item.isCreateFile);

		// If search is empty, show all items from current directory
		if (value === "") {
			quickPick.items = currentItems;
			return;
		}

		// Check if any current items match the search
		const hasMatchingItems = currentItems.some((item: FileItem) => {
			const itemName = item.label.toLowerCase();
			const searchTerm = value.toLowerCase();
			return itemName.includes(searchTerm);
		});

		// If no items match and search is not empty, add create file item
		if (!hasMatchingItems && value.trim() !== "") {
			const createFileItem: FileItem = {
				label: `📄 Create "${value}"`,
				description: "Create new file",
				uri: vscode.Uri.file(path.join(currentPath, value)),
				isDirectory: false,
				isFile: true,
				isCreateFile: true,
			};

			// Add create file item to the current items list
			// This will be filtered naturally by QuickPick
			quickPick.items = [...currentItems, createFileItem];
		} else {
			// do nothing, no reason to update the items
			// Show current items - QuickPick will handle filtering automatically
			//quickPick.items = currentItems;
		}
	});

	// Add "Go Up" button
	quickPick.buttons = [
		{
			iconPath: new vscode.ThemeIcon("arrow-up"),
			tooltip: "Go Up",
		},
	];

	// Handle button clicks
	quickPick.onDidTriggerButton(async (button: vscode.QuickInputButton) => {
		if (button.tooltip === "Go Up") {
			await navigateToPathAndUpdateQuickPick(
				quickPick,
				path.dirname(currentPath),
			);
		}
	});

	quickPick.show();
}

async function getDirectoryItems(): Promise<FileItem[]> {
	try {
		const files = await fs.promises.readdir(currentPath);
		const items: FileItem[] = [];

		// Add "Go Up" item if not at workspace root
		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (workspaceFolders && workspaceFolders.length > 0) {
			const workspaceRoot = workspaceFolders[0].uri.fsPath;
			if (currentPath !== workspaceRoot) {
				items.push({
					label: "..",
					description: "Go up one directory",
					uri: vscode.Uri.file(path.dirname(currentPath)),
					isDirectory: true,
					isFile: false,
				});
			}
		}

		// Add regular files and directories
		for (const file of files) {
			const fullPath = path.join(currentPath, file);
			const stat = await fs.promises.stat(fullPath);
			const uri = vscode.Uri.file(fullPath);

			items.push({
				label: `${file}${stat.isDirectory() ? "/" : ""}`,
				//description: stat.isDirectory() ? "📁 Directory" : "📄 File",
				uri: uri,
				isDirectory: stat.isDirectory(),
				isFile: stat.isFile(),
			});
		}

		// Sort: "Go Up" first, then directories, then files, all alphabetically
		return items.sort((a, b) => {
			// "Go Up" item always comes first
			if (a.label === "..") return -1;
			if (b.label === "..") return 1;

			// Then directories before files
			if (a.isDirectory && !b.isDirectory) return -1;
			if (!a.isDirectory && b.isDirectory) return 1;

			// Finally alphabetically
			return a.label.localeCompare(b.label);
		});
	} catch (error) {
		vscode.window.showErrorMessage(`Error reading directory: ${error}`);
		return [];
	}
}

async function navigateToPathAndUpdateQuickPick(
	quickPick: vscode.QuickPick<FileItem>,
	newPath: string,
) {
	// Check if we're trying to go above workspace root
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (workspaceFolders && workspaceFolders.length > 0) {
		const workspaceRoot = workspaceFolders[0].uri.fsPath;
		if (
			newPath.length < workspaceRoot.length ||
			!newPath.startsWith(workspaceRoot)
		) {
			// Don't allow navigation above workspace root
			console.log("Prevented navigation above workspace root");
			return;
		}
	}

	// Navigate to the new path
	currentPath = newPath;

	// Get new items for the updated path
	const newItems = await getDirectoryItems();

	// Update the existing QuickPick instead of creating a new one
	quickPick.items = newItems;
	quickPick.title = `>>> ${getRelativePath(currentPath)}`;
	quickPick.value = ""; // Clear the search input
}

// This method is called when your extension is deactivated
export function deactivate() {
	currentPath = "";
}
