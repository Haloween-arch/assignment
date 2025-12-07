// src/App.jsx
import Home from "./pages/Home";
import Sidebar from "./components/Sidebar";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      <div className="max-w-7xl mx-auto flex gap-4">
        <Sidebar />
        <div className="flex-1 bg-white shadow-lg rounded-2xl p-6">
          <Home />
        </div>
      </div>
    </div>
  );
}
