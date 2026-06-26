```markdown
# akabane_diagnostic Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill provides guidance on contributing to the `akabane_diagnostic` JavaScript codebase. The repository implements logic for diagnostic classification, likely in a medical or assessment context, and includes both shared logic and frontend views for patients and doctors. This document covers coding conventions, workflow steps for updating diagnostic logic, testing patterns, and available development commands.

## Coding Conventions

### File Naming
- Use **camelCase** for file names.
  - Example: `akabaneRules.js`, `patientIndex.html`

### Import Style
- Use **relative imports** for modules.
  ```javascript
  import { classifyScore } from './akabaneRules.js';
  ```

### Export Style
- Use **named exports**.
  ```javascript
  // In shared/akabane-rules.js
  export function classifyScore(score) {
    // classification logic
  }
  ```

### Commit Messages
- Freeform, no strict prefix required.
- Typical length: ~63 characters.

## Workflows

### Update Diagnostic Classification Logic
**Trigger:** When diagnostic classification rules or scales change and need to be reflected in both backend logic and frontend displays.  
**Command:** `/update-diagnostic-classification`

1. **Update Shared Logic**  
   Edit `shared/akabane-rules.js` (or equivalent) to adjust classification thresholds or logic.
   ```javascript
   // Example: Update threshold
   export function classifyScore(score) {
     if (score >= 80) return 'High';
     if (score >= 50) return 'Medium';
     return 'Low';
   }
   ```
2. **Update Frontend Views**  
   Synchronize the display logic in `patient/index.html` and `doctor/index.html` to match the updated classification.
   ```html
   <!-- Example: Display badge based on classification -->
   <span class="badge" data-class="{{ classifyScore(score) }}">
     {{ classifyScore(score) }}
   </span>
   ```
3. **Update Exports and Protocols**  
   Ensure exports (such as protocol generation or markdown exports) use the new logic.
4. **Test in UI**  
   Run through diagnostic scenarios in the user interface to confirm correct behavior and display.

## Testing Patterns

- **Test File Naming:** Files follow the `*.test.*` pattern (e.g., `akabaneRules.test.js`).
- **Testing Framework:** Not explicitly detected; use standard JavaScript testing approaches.
  ```javascript
  // Example test
  import { classifyScore } from './akabaneRules.js';

  test('classifies high score', () => {
    expect(classifyScore(85)).toBe('High');
  });
  ```

## Commands

| Command                         | Purpose                                                                 |
|----------------------------------|-------------------------------------------------------------------------|
| /update-diagnostic-classification| Synchronize and update diagnostic classification logic across the codebase |

```