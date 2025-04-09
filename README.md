# Employee Organization App

This is a React + TypeScript application that displays an interactive **Employee Organizational Chart** with support for drag-and-drop functionality. You can restructure the organization by dragging employees to new managers, and the hierarchy updates accordingly.

---

## 🚀 Live Demo

The demo application is live and accessible at:  
🔗 [https://naveenprasad59.github.io/Employee-organization-app/](https://naveenprasad59.github.io/Employee-organization-app/)

## 🚀 Features

- 👥 **Tree view of employee hierarchy**
- 🎯 **Drag & Drop** employees to assign new managers
- 🔍 **Search and Filter** employees (if applicable)
- ♻️ Reset and clear filters to return to full view
- 🧪 MirageJS mock server for realistic API calls
- ⚡ Built with React, TypeScript, Chakra UI, and `@dnd-kit`

---

## 📦 Tech Stack

- **React**
- **TypeScript**
- **Chakra UI** – component styling
- **@dnd-kit** – drag and drop
- **MirageJS** – mocking backend APIs
- **Immer / `produce`** – immutable tree state updates

---

## 🛠️ Installation

```bash
git clone https://github.com/your-username/org-chart-dragdrop.git
cd org-chart-dragdrop
npm install
npm start