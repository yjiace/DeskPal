import { BrowserRouter, Routes, Route } from "react-router-dom";
import Settings from "./pages/Settings";
import Todo from "./pages/Todo";
import Markdown from "./pages/Markdown";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { useRef } from "react";

function Home() {
    const menuRef = useRef<HTMLDivElement>(null);

    // 右键弹出菜单
    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        if (menuRef.current) {
            menuRef.current.style.left = `${e.clientX}px`;
            menuRef.current.style.top = `${e.clientY}px`;
            menuRef.current.style.display = "block";
        }
    };
    // 点击其它地方关闭菜单
    const handleCloseMenu = () => {
        if (menuRef.current) menuRef.current.style.display = "none";
    };
    // 点击设置
    const handleShowSettings = async () => {
        const { Window } = await import("@tauri-apps/api/window");
        const settingsWin = await Window.getByLabel("settings");
        if (settingsWin) {
            await settingsWin.show();
            await settingsWin.setFocus();
        }
        if (menuRef.current) menuRef.current.style.display = "none";
    };

    return (
        <main
            className="container"
            onContextMenu={handleContextMenu}
            onClick={handleCloseMenu}
            style={{ width: "100vw", height: "100vh", position: "relative" }}
        >
            <h1>Welcome to Tauri + React</h1>
            <div className="row">
                <a href="https://vitejs.dev" target="_blank">
                    <img src="/vite.svg" className="logo vite" alt="Vite logo" />
                </a>
                <a href="https://tauri.app" target="_blank">
                    <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
                </a>
                <a href="https://reactjs.org" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <p>Click on the Tauri, Vite, and React logos to learn more.</p>
            {/* 右键菜单 */}
            <div
                ref={menuRef}
                style={{
                    position: "absolute",
                    display: "none",
                    background: "#fff",
                    border: "1px solid #ccc",
                    zIndex: 1000,
                }}
            >
                <div style={{ padding: 8, cursor: "pointer" }} onClick={handleShowSettings}>
                    设置
                </div>
            </div>
        </main>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/todo" element={<Todo />} />
                <Route path="/markdown" element={<Markdown />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
