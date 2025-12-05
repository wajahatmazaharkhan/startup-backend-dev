🧭 **Contribution Guidelines**

Thank you for contributing to this project!  
To maintain clarity, code quality, and structural consistency, please read and follow the guidelines below before making any changes.

---

## 📌 1. Workflow & Branching Rules

### **Branch Naming Convention**

All development work must be done on a dedicated branch using the following format:

**For new features:**
```
feature/<PascalCaseFeatureName>
```
Example:
```
feature/UserAuthentication
```

**For bug fixes:**
```
fix/<PascalCaseIssueName>
```
Example:
```
fix/NavbarAlignment
```

**For enhancements:**
```
enhancement/<PascalCaseImprovement>
```
Example:
```
enhancement/ImproveRoutingFlow
```

### **General Workflow**
- ❌ Never push directly to `main` or `master`.
- ✔️ Create a feature branch before starting work.
- ✔️ Commit frequently with meaningful messages.
- ✔️ Open a Pull Request (PR) only when your work is complete and tested.
- ✔️ PRs must undergo review before merging.

Any discrepancy from these guidelines may lead to required rework or PR rejection.

---

## 📁 2. Folder & File Structure Norms

### **Components Structure (`src/components/`)**

```
components/
  Navbar/
    Navbar.jsx
    Navbar.css
    index.js
  Button/
    Button.jsx
    Button.css
    index.js
  index.js
```

### **Required Component Rules**
- Each component must reside in its own folder.
- File names must follow **PascalCase**.
- Each folder must include an `index.js` for exporting.
- All components must also be exported through `src/components/index.js`.

### ❌ What NOT to do
- Never place **business logic** inside UI components.
- UI components must remain **purely visual** and state-light.
- Business logic, API calls, and heavy state must be handled via services, hooks, or context.

---

## 📄 3. Pages Structure (`src/pages/`)

```
pages/
  Home/
    Home.jsx
    index.js
  Dashboard/
    Dashboard.jsx
    index.js
  index.js
```

### **Page Rules**
- Pages represent top-level routes.
- Pages should delegate rendering to components.
- Avoid adding unnecessary logic in pages.
- Pages must be exported through `src/pages/index.js`.

---

## 🛣️ 4. Routing Guidelines

`App.jsx` is considered a **core protected file** and contains:

- global routing  
- top-level layout  
- shared wrappers & providers  

⚠️ **Do NOT modify routing in App.jsx unless explicitly assigned.**  
Unauthorized edits will require fixes or lead to PR rejection.

---

## 🧱 5. Import & Export Norms

### **Use Barrel Files**

Instead of:

```js
import Navbar from "../../components/Navbar/Navbar";
```

Use:

```js
import { Navbar } from "@/components";
```

Rules:
- Never import directly from deep component paths.
- Always ensure new components/pages are added to their respective barrel exports.

---

## ✨ 6. Coding Style & Quality Standards

### **Naming Conventions**
- **PascalCase** → Components, Pages, Folders  
- **camelCase** → Variables, functions, hooks, utilities  

Avoid uppercase filenames, special characters, or irrelevant suffixes.

### **Component Rules**
- Use **functional components** only.
- Avoid side effects inside render logic.
- Keep components UI-focused.
- Extract repeated logic into hooks or utilities.

### **Commit Messages**
Use clear, conventional messages:

```
feat: add user profile page
fix: correct navbar alignment
refactor: extract table logic into hook
```

---

## ⚠️ 7. Code Review Expectations

Your PR may be rejected if:

- File structure conventions aren't followed.
- Barrel exports are missing or incorrect.
- Business logic appears inside UI components.
- Naming conventions are ignored.
- Wrong branch usage.
- Routing modified without approval.

Code reviews aim to ensure:

- Long-term maintainability  
- Consistency  
- Reduced code debt  
- Clear separation of concerns  

Repeated violations may result in stricter requirements.

---

## 🚀 8. Before Submitting a PR

Ensure you have:

✔ Followed branch naming rules  
✔ Structured components/pages correctly  
✔ Added all necessary barrel exports  
✔ Formatted your code  
✔ Tested changes locally  
✔ Written meaningful commit messages  
✔ Avoided unnecessary file changes  

---

## 🙌 Thank You for Contributing

Following these guidelines helps keep the project **clean, scalable, and maintainable**.  
Your efforts are truly appreciated!

If you need clarification on any guideline, feel free to ask.
