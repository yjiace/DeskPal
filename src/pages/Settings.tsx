import React, { useState, useEffect } from "react";
import { invoke } from '@tauri-apps/api/core';

const menuItems = [
  { label: "3D 模型", icon: "fa-cube", color: "text-blue-500", target: "model-settings" },
  { label: "默认动作", icon: "fa-running", color: "text-green-500", target: "action-settings" },
  { label: "静止播放时间", icon: "fa-hourglass-half", color: "text-yellow-500", target: "idle-time-settings" },
  { label: "舞台设置", icon: "fa-theater-masks", color: "text-purple-500", target: "stage-settings" },
  { label: "场景设置", icon: "fa-mountain", color: "text-indigo-500", target: "scene-settings" },
  { label: "语言设置", icon: "fa-language", color: "text-pink-500", target: "language-settings" },
  { label: "触碰提示", icon: "fa-hand-pointer", color: "text-red-500", target: "touch-prompt-settings" },
];

const Settings: React.FC = () => {
  useEffect(() => { invoke('show_window', { label: 'settings' }); }, []);
  const [activeSection, setActiveSection] = useState("model-settings");
  // 3D模型设置
  const [model, setModel] = useState("model1");
  const [modelScale, setModelScale] = useState(1.0);
  // 默认动作设置
  const [defaultAction, setDefaultAction] = useState("dance1");
  const [actionSpeed, setActionSpeed] = useState(1.0);
  // 静止播放时间
  const [idleDuration, setIdleDuration] = useState(30);
  // 舞台设置
  const [stageLighting, setStageLighting] = useState("bright");
  const [stageBackground, setStageBackground] = useState("plain");
  // 场景设置
  const [sceneEnv, setSceneEnv] = useState("forest");
  const [sceneWeather, setSceneWeather] = useState("none");
  // 语言设置
  const [appLanguage, setAppLanguage] = useState("zh-CN");
  // 触碰提示
  const [touchPromptText, setTouchPromptText] = useState("");
  const [promptDisplayDuration, setPromptDisplayDuration] = useState(3);
  const [enableTouchPrompt, setEnableTouchPrompt] = useState(false);

  // 重置按钮
  const handleReset = () => {
    setModel("model1");
    setModelScale(1.0);
    setDefaultAction("dance1");
    setActionSpeed(1.0);
    setIdleDuration(30);
    setStageLighting("bright");
    setStageBackground("plain");
    setSceneEnv("forest");
    setSceneWeather("none");
    setAppLanguage("zh-CN");
    setTouchPromptText("");
    setPromptDisplayDuration(3);
    setEnableTouchPrompt(false);
    alert("所有设置已重置为默认值！(此为演示功能)");
  };
  // 保存按钮
  const handleSave = () => {
    alert("设置已保存！(此为演示功能)");
  };
  // 关闭按钮
  const handleClose = () => {
    window.close();
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900 font-sans antialiased">
      {/* 侧边菜单栏 */}
      <aside className="w-64 bg-white p-6 flex flex-col shadow-lg">
        <h1 className="text-2xl font-bold mb-8 text-blue-600">设置</h1>
        <nav className="flex-grow">
          <ul className="space-y-4">
            {menuItems.map((item) => (
              <li key={item.target}>
                <button
                  className={`menu-item flex items-center p-3 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-all duration-300 transform hover:scale-105 ${activeSection === item.target ? "bg-blue-100 text-blue-700" : ""}`}
                  onClick={() => setActiveSection(item.target)}
                >
                  <i className={`fas ${item.icon} mr-3 text-lg ${item.color}`}></i>
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-8 space-y-4">
          <button className="w-full flex items-center justify-center p-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-300 shadow-md transform hover:scale-105 active:scale-95" onClick={handleReset}>
            <i className="fas fa-undo mr-2"></i>重置
          </button>
          <button className="w-full flex items-center justify-center p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 shadow-md transform hover:scale-105 active:scale-95" onClick={handleSave}>
            <i className="fas fa-save mr-2"></i>保存
          </button>
        </div>
      </aside>
      {/* 主内容区域 */}
      <main className="flex-grow p-8 overflow-y-auto bg-gray-50">
        <div className="flex justify-end mb-4">
          <button className="text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-200" onClick={handleClose}>
            <i className="fas fa-times text-2xl"></i>
          </button>
        </div>
        {/* 3D 模型设置 */}
        {activeSection === "model-settings" && (
          <section className="settings-section active-section bg-white p-8 rounded-lg shadow-xl mb-8">
            <h2 className="text-3xl font-bold mb-6 text-blue-600 border-b border-gray-200 pb-4">3D 模型设置</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-gray-700 text-lg font-medium mb-2" htmlFor="model-selection">选择模型:</label>
                <select className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200" id="model-selection" value={model} onChange={e => setModel(e.target.value)}>
                  <option value="model1">模型 A</option>
                  <option value="model2">模型 B</option>
                  <option value="model3">模型 C</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-lg font-medium mb-2" htmlFor="model-scale">模型缩放:</label>
                <input className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500" id="model-scale" type="range" min="0.5" max="2.0" step="0.1" value={modelScale} onChange={e => setModelScale(Number(e.target.value))} />
                <span className="block text-right text-gray-600 mt-1">{modelScale.toFixed(1)}x</span>
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-lg font-medium mb-2">模型预览:</label>
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                  <img alt="3D Model Preview" className="w-full h-full object-contain" src="https://design.gemcoder.com/staticResource/echoAiSystemImages/fcd4806a917be856dae4848d0fbe2666.png" />
                </div>
              </div>
            </div>
          </section>
        )}
        {/* 默认动作设置 */}
        {activeSection === "action-settings" && (
          <section className="settings-section bg-white p-8 rounded-lg shadow-xl mb-8">
            <h2 className="text-3xl font-bold mb-6 text-blue-600 border-b border-gray-200 pb-4">默认动作设置</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-gray-700 text-lg font-medium mb-2" htmlFor="default-action">选择默认动作:</label>
                <select className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200" id="default-action" value={defaultAction} onChange={e => setDefaultAction(e.target.value)}>
                  <option value="dance1">舞蹈 A</option>
                  <option value="dance2">舞蹈 B</option>
                  <option value="idle">静止</option>
                  <option value="wave">挥手</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-lg font-medium mb-2" htmlFor="action-speed">动作速度:</label>
                <input className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500" id="action-speed" type="range" min="0.5" max="2.0" step="0.1" value={actionSpeed} onChange={e => setActionSpeed(Number(e.target.value))} />
                <span className="block text-right text-gray-600 mt-1">{actionSpeed.toFixed(1)}x</span>
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-lg font-medium mb-2">动作预览:</label>
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                  <img alt="Action Preview" className="w-full h-full object-contain" src="https://design.gemcoder.com/staticResource/echoAiSystemImages/57a5c1ae7d9394ee4a4a1dfdc820dbaf.png" />
                </div>
              </div>
            </div>
          </section>
        )}
        {/* 静止播放时间设置 */}
        {activeSection === "idle-time-settings" && (
          <section className="settings-section bg-white p-8 rounded-lg shadow-xl mb-8">
            <h2 className="text-3xl font-bold mb-6 text-blue-600 border-b border-gray-200 pb-4">静止播放时间设置</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-gray-700 text-lg font-medium mb-2" htmlFor="idle-duration">静止多久后开始播放动作 (秒):</label>
                <input className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200" id="idle-duration" type="number" min={0} max={300} value={idleDuration} onChange={e => setIdleDuration(Number(e.target.value))} />
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-600 text-sm">此设置决定了当模型静止不动时，经过多长时间后会自动播放预设的默认动作。</p>
              </div>
            </div>
          </section>
        )}
        {/* 舞台设置 */}
        {activeSection === "stage-settings" && (
          <section className="settings-section bg-white p-8 rounded-lg shadow-xl mb-8">
            <h2 className="text-3xl font-bold mb-6 text-blue-600 border-b border-gray-200 pb-4">舞台设置</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-gray-700 text-lg font-medium mb-2" htmlFor="stage-lighting">舞台灯光:</label>
                <select className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200" id="stage-lighting" value={stageLighting} onChange={e => setStageLighting(e.target.value)}>
                  <option value="bright">明亮</option>
                  <option value="dim">昏暗</option>
                  <option value="spotlight">聚光灯</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-lg font-medium mb-2" htmlFor="stage-background">舞台背景:</label>
                <select className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200" id="stage-background" value={stageBackground} onChange={e => setStageBackground(e.target.value)}>
                  <option value="plain">纯色</option>
                  <option value="gradient">渐变</option>
                  <option value="pattern">图案</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-lg font-medium mb-2">舞台预览:</label>
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                  <img alt="Stage Preview" className="w-full h-full object-cover" src="https://design.gemcoder.com/staticResource/echoAiSystemImages/c045c6c46262de2029cae904dfbafe66.png" />
                </div>
              </div>
            </div>
          </section>
        )}
        {/* 场景设置 */}
        {activeSection === "scene-settings" && (
          <section className="settings-section bg-white p-8 rounded-lg shadow-xl mb-8">
            <h2 className="text-3xl font-bold mb-6 text-blue-600 border-b border-gray-200 pb-4">场景设置</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-gray-700 text-lg font-medium mb-2" htmlFor="scene-environment">选择场景环境:</label>
                <select className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200" id="scene-environment" value={sceneEnv} onChange={e => setSceneEnv(e.target.value)}>
                  <option value="forest">森林</option>
                  <option value="city">城市</option>
                  <option value="space">太空</option>
                  <option value="desert">沙漠</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-lg font-medium mb-2" htmlFor="scene-weather">天气效果:</label>
                <select className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200" id="scene-weather" value={sceneWeather} onChange={e => setSceneWeather(e.target.value)}>
                  <option value="none">无</option>
                  <option value="rain">下雨</option>
                  <option value="snow">下雪</option>
                  <option value="fog">雾</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-lg font-medium mb-2">场景预览:</label>
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                  <img alt="Scene Preview" className="w-full h-full object-cover" src="https://design.gemcoder.com/staticResource/echoAiSystemImages/a27bafcb4dd202a094bfac973154e07f.png" />
                </div>
              </div>
            </div>
          </section>
        )}
        {/* 语言设置 */}
        {activeSection === "language-settings" && (
          <section className="settings-section bg-white p-8 rounded-lg shadow-xl mb-8">
            <h2 className="text-3xl font-bold mb-6 text-blue-600 border-b border-gray-200 pb-4">语言设置</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-gray-700 text-lg font-medium mb-2" htmlFor="app-language">应用程序语言:</label>
                <select className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200" id="app-language" value={appLanguage} onChange={e => setAppLanguage(e.target.value)}>
                  <option value="zh-CN">简体中文</option>
                  <option value="en-US">English (US)</option>
                  <option value="ja-JP">日本語</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-600 text-sm">更改应用程序的显示语言。</p>
              </div>
            </div>
          </section>
        )}
        {/* 触碰自定义提示设置 */}
        {activeSection === "touch-prompt-settings" && (
          <section className="settings-section bg-white p-8 rounded-lg shadow-xl mb-8">
            <h2 className="text-3xl font-bold mb-6 text-blue-600 border-b border-gray-200 pb-4">触碰自定义提示设置</h2>
            <div className="grid grid-cols-1 gap-8">
              <div>
                <label className="block text-gray-700 text-lg font-medium mb-2" htmlFor="touch-prompt-text">自定义提示文本:</label>
                <textarea className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200" id="touch-prompt-text" placeholder="输入当用户触碰模型时显示的提示信息..." rows={4} value={touchPromptText} onChange={e => setTouchPromptText(e.target.value)} />
              </div>
              <div>
                <label className="block text-gray-700 text-lg font-medium mb-2" htmlFor="prompt-display-duration">提示显示时长 (秒):</label>
                <input className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200" id="prompt-display-duration" type="number" min={1} max={10} value={promptDisplayDuration} onChange={e => setPromptDisplayDuration(Number(e.target.value))} />
              </div>
              <div className="flex items-center">
                <input className="h-5 w-5 text-blue-600 bg-gray-200 border-gray-300 rounded focus:ring-blue-500 transition-colors duration-200" id="enable-touch-prompt" type="checkbox" checked={enableTouchPrompt} onChange={e => setEnableTouchPrompt(e.target.checked)} />
                <label className="ml-2 text-gray-700 text-lg" htmlFor="enable-touch-prompt">启用触碰提示</label>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Settings; 