# Contributing to IT Asset Management System

Thank you for your interest in contributing to the IT Asset Management System! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### 1. Fork the Repository
- Fork the repository on GitHub
- Clone your fork locally
- Add the original repository as upstream

```bash
git clone https://github.com/your-username/it-asset-management.git
cd it-asset-management
git remote add upstream https://github.com/your-organization/it-asset-management.git
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 3. Make Your Changes
- Follow the coding standards outlined below
- Write clear, concise commit messages
- Test your changes thoroughly

### 4. Submit a Pull Request
- Push your changes to your fork
- Create a pull request with a clear description
- Reference any related issues

## 🎯 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Use meaningful variable and function names
- Add comments for complex logic

### Component Structure
```typescript
// Use functional components with hooks
import React, { useState, useEffect } from 'react';

interface ComponentProps {
  // Define prop types
}

export default function Component({ prop }: ComponentProps) {
  // Component logic
  return (
    // JSX
  );
}
```

### API Routes
- Follow RESTful conventions
- Use proper HTTP status codes
- Include error handling
- Validate input data

### Database Changes
- Use Prisma migrations for schema changes
- Update seed data if necessary
- Test migrations thoroughly

## 🧪 Testing

### Before Submitting
- Test all functionality manually
- Ensure no console errors
- Verify responsive design
- Check accessibility

### Running Tests
```bash
npm run test
npm run lint
npm run type-check
```

## 📝 Commit Message Format

Use conventional commits:
```
type(scope): description

feat(assets): add bulk import functionality
fix(auth): resolve login redirect issue
docs(readme): update installation instructions
style(ui): improve button styling
refactor(api): optimize database queries
```

## 🐛 Bug Reports

When reporting bugs, include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser/environment details
- Screenshots if applicable

## 💡 Feature Requests

For new features:
- Describe the use case
- Explain the expected behavior
- Consider implementation complexity
- Discuss with maintainers first

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to the IT Asset Management System! 🚀
