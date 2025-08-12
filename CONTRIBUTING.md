# 🤝 Contributing to BATOS

Thank you for your interest in contributing to BATOS! This document provides guidelines for contributing to the project.

## 🚀 Quick Start

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a feature branch
4. **Make** your changes
5. **Test** thoroughly
6. **Add** preview (screenshot/video)
7. **Submit** a pull request

## 📋 Contribution Guidelines

### Before You Start

- **Check existing issues**: Look for similar requests or bugs
- **Discuss major changes**: Open an issue first for significant features
- **Follow the code style**: Use TypeScript and existing patterns
- **Test your changes**: Ensure everything works as expected

### Required for All Contributions

#### 📸 Preview Requirement
**All contributions must include a visual preview:**

- **Screenshots**: For UI changes, new components, or bug fixes
- **Videos**: For interactive features, animations, or complex changes
- **Before/After**: Show the difference your changes make

**Preview Guidelines:**
- High quality and clear
- Show the relevant area of the interface
- Include context (what was changed)
- For videos, keep them under 30 seconds
- Upload to GitHub or include in PR description

#### Code Quality
- **TypeScript**: All new code must be properly typed
- **ESLint**: Pass all linting checks
- **Performance**: No significant performance regressions
- **Accessibility**: Follow WCAG guidelines where applicable

## 🎯 Contribution Areas

### 🎨 UI/UX Improvements
- **Visual enhancements**: Better styling, animations, effects
- **User experience**: Improved interactions, workflows
- **Responsive design**: Better mobile/tablet support
- **Accessibility**: Screen reader support, keyboard navigation

### 🚀 New Applications
- **Desktop apps**: New applications for the desktop environment
- **Integration**: Connect with external APIs or services
- **Games**: Simple games or interactive experiences
- **Tools**: Utility applications for productivity

### 📊 Widgets
- **Data widgets**: Display real-time information
- **Interactive widgets**: User-configurable components
- **System widgets**: Hardware monitoring, system stats
- **Media widgets**: Music controls, video players

### 🔧 System Features
- **Window management**: Improved dragging, resizing, snapping
- **File system**: Enhanced file operations
- **Settings**: Configuration options and preferences
- **Performance**: Optimizations and speed improvements

### 🎵 Media & Content
- **Music**: Add tracks to the Batplayer playlist
- **Themes**: New visual themes or color schemes
- **Icons**: Custom icons for applications or widgets
- **Sounds**: System sounds and audio feedback

### 📚 Documentation
- **README updates**: Keep documentation current
- **Code comments**: Improve code documentation
- **Tutorials**: How-to guides for features
- **API documentation**: Document new APIs or components

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Local Development
```bash
# Clone your fork
git clone https://github.com/yourusername/batos.git
cd batos

# Install dependencies
npm install

# Start development server
npm run dev

# Run linting
npm run lint

# Build for production
npm run build
```

### Code Style
- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings
- **Semicolons**: Yes
- **Trailing commas**: Yes
- **Line length**: 80 characters max
- **File naming**: kebab-case for files, PascalCase for components

## 📝 Pull Request Process

### 1. Create Your Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Your Changes
- Write clear, descriptive commit messages
- Make small, focused commits
- Test your changes thoroughly
- Update documentation if needed

### 3. Add Preview
- Take screenshots or record videos
- Show before/after if applicable
- Include in PR description or upload to GitHub

### 4. Submit PR
- **Title**: Clear, descriptive title
- **Description**: Explain what and why (not how)
- **Preview**: Screenshot/video of changes
- **Testing**: What you tested and how
- **Breaking changes**: Note any breaking changes

### PR Template
```markdown
## Description
Brief description of changes

## Preview
[Screenshot/Video here]

## Testing
- [ ] Tested on desktop
- [ ] Tested on mobile (if applicable)
- [ ] All existing features still work
- [ ] No console errors

## Breaking Changes
None (or describe if any)

## Additional Notes
Any additional context or notes
```

## 🐛 Bug Reports

### Before Reporting
- **Search existing issues**: Check if already reported
- **Reproduce consistently**: Ensure the bug is reproducible
- **Test in different browsers**: Check if browser-specific

### Bug Report Template
```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to...
2. Click on...
3. See error...

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., Windows 11, macOS 14]
- Browser: [e.g., Chrome 120, Firefox 121]
- BATOS Version: [e.g., 0.1.0]

## Screenshots/Videos
[If applicable]
```

## 💡 Feature Requests

### Before Requesting
- **Check existing features**: Make sure it's not already implemented
- **Think through use case**: How would this benefit users?
- **Consider complexity**: Is this feasible to implement?

### Feature Request Template
```markdown
## Feature Description
Clear description of the feature

## Use Case
Why this feature would be useful

## Proposed Implementation
How you think it could be implemented

## Mockups/Sketches
[If you have any]
```

## 🏆 Recognition

Contributors will be recognized in:
- **README.md**: Contributors section
- **Release notes**: For significant contributions
- **GitHub**: Contributor graph and profile

## 📞 Getting Help

- **Issues**: Use GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Code review**: Ask for help with code reviews

## 📄 License

By contributing to BATOS, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to BATOS!** 🦇💻

Your contributions help make the Batcomputer even more awesome for the Dark Knight and users worldwide.
