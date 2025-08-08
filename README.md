# Ido File Explorer

A VS Code extension that provides Emacs-style file navigation with a path-based search interface. The search input follows specific rules for parsing and filtering files, starting from the current file's directory instead of the workspace root.

## 🎯 Why This Extension?

VS Code's default Quick Open (`Ctrl+P`) always searches from the workspace root, which can be frustrating when you know the general location of a file but not its exact name. This extension brings the intuitive file navigation experience from Emacs (`C-x C-f`) to VS Code.

## ✨ Features

- **Context-aware search**: Starts from the current file's directory
- **Smart navigation**: Use "Go Up" button or ".." item to navigate up directories
- **File filtering**: Type to filter files and directories in the current location
- **File creation**: Create new files directly from the search interface when no matches are found
- **Keyboard shortcuts**: Quick access with `Ctrl+Shift+P`
- **Path-based interface**: Shows current directory path in the title

## 🚀 Usage

### Basic Navigation

1. **Open the extension**: `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. **Navigate directories**: Use arrow keys to move through files and folders
3. **Enter directories**: Press Enter on a folder to drill down
4. **Go up**: Use the "Go Up" button or select ".." item to navigate up one level
5. **Open files**: Press Enter on a file to open it
6. **Create files**: Type a filename that doesn't exist to see a "📄 Create 'filename'" option

### Search Features

- **Smart filtering**: Type to filter files and directories in the current location
- **Case-insensitive**: Works regardless of capitalization
- **File creation**: When no matches are found, a "📄 Create 'filename'" item appears
- **Path display**: Current directory path is shown in the title

## 🛠️ Development

### Prerequisites

- Node.js >= 18.0.0
- Yarn 4.x
- VS Code

### Setup

1. **Install dependencies**:

   ```bash
   yarn install
   ```

2. **Build the extension**:

   ```bash
   yarn build
   ```

3. **Development mode**:

   ```bash
   yarn dev
   ```

4. **Package for distribution**:
   ```bash
   yarn package
   ```

### Project Structure

```
ido-file-explorer/
├── src/
│   ├── extension.ts              # Main extension logic
│   └── test/                     # Unit and integration tests
├── out/                          # Compiled JavaScript
├── package.json                  # Extension manifest
├── tsconfig.json                 # TypeScript configuration
├── biome.json                    # Linting configuration
└── README.md                     # This file
```

## 🎨 How It Works

### QuickPick Interface

The extension uses VS Code's QuickPick API to create a file browser that:

- Shows the contents of the directory of the file in the active editor
- Allows navigation with arrow keys, ctrl+[n|p], and enter key
- filter directory contents
- allows for creating a new file in the active directory (just type the filename in the picker)

## 🔧 Configuration

### Keyboard Shortcuts

The default shortcut is `Ctrl+Shift+P`, but you can customize it in VS Code's keybindings:

```json
{
  "key": "ctrl+shift+p",
  "command": "ido-file-explorer.open",
  "when": "!inQuickOpen"
}
```

### Settings

The extension respects VS Code's file exclusion settings:

- `files.exclude`: Files/folders to hide from search
- `search.exclude`: Files/folders to exclude from search

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Emacs' intuitive file navigation (`C-x C-f`) and "ido" enhancements
- Uses TypeScript for type safety and better development experience

## 🐛 Limitations

- Performance may vary with very large directories
- Limited to single workspace folder support

## 📈 Roadmap

- [ ] Add file type icons
- [ ] Switch to standard quickpick for advanced searching
- [ ] Support for multiple workspace folders

---

**Made with ❤️ for VS Code users who miss Emacs-style file navigation**
