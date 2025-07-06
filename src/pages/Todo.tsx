import React, { useEffect } from "react";
import { invoke } from '@tauri-apps/api/core';
const Todo: React.FC = () => {
  useEffect(() => { invoke('show_window', { label: 'todo' }); }, []);
  return <div className="p-8">TODO 页面内容</div>;
};
export default Todo; 