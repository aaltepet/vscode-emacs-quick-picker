# Emacs-like Quick Picker

A VS Code extension that provides Emacs-like file navigation with a path-based search interface.
The search starts from the current file's directory instead of the workspace root.

## 🎯 Why This Extension?

VS Code's default Quick Open (`Ctrl+P`) always searches from the workspace root; this is hard to use in large codebases when you just want to open a file in the same directory, or when there are many files with the same name but different directories. This extension brings the intuitive file navigation experience from Emacs (`C-x C-f`) to VS Code.

## ✨ Features

- **Context-aware search**: Starts from the current file's directory
- **File filtering**: Type to filter files and directories in the current location
- **File creation**: Create new files directly from the search interface when no matches are found
- **Smart keyboard navigation**: select the desired file, drill down or up without leaving the keyboard
- **Open any file in the project**: does not respect vscode's ignorefile property, so it is easy to open
  files that cannot be opened with the quick picker (e.g. .env, or thirdparty packages in node_modules)

## 🚀 Usage

### Basic Navigation

1. **Open the extension**: `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. **Navigate directories**: Use arrow keys to move through files and folders, or ctrl+n/ctrl+p
3. **Open files**: Press Enter on a file to open it
4. **Create files**: Type a filename that doesn't exist to see a "📄 Create 'filename'" option

# 🔧 Configuration

### Keyboard Shortcuts

The default shortcut is `Ctrl+Shift+P`, but you can customize it in VS Code's keybindings:

```json
{
  "key": "ctrl+shift+p",
  "command": "ido-file-explorer.open",
  "when": "!inQuickOpen"
}
```

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

## 🐛 Limitations

- Performance may vary with very large directories
- Limited to single workspace folder support

## 📈 Roadmap

- [ ] Add file type icons
- [ ] Switch to standard quickpick for advanced searching
- [ ] Support for multiple workspace folders

---

**Made with ❤️ for VS Code users who miss Emacs-style file navigation**
