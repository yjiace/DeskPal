// src-tauri/src/main.rs

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// 1. 导入所有需要的模块
use tauri::{
    menu::{Menu, MenuEvent, MenuItem, PredefinedMenuItem},
    tray::{MouseButton, TrayIcon, TrayIconBuilder, TrayIconEvent},
    AppHandle, Manager, Wry,
};
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;


// 配置文件结构
#[derive(Debug, Clone, Deserialize, Serialize)]
struct AppConfig {
    todo_visible: Option<bool>,
    markdown_visible: Option<bool>
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            todo_visible: Option::from(true),
            markdown_visible: Option::from(true)
        }
    }
}

// 窗口状态结构
#[derive(Debug, Deserialize, Serialize, Default)]
struct WindowState {
    x: Option<i32>,
    y: Option<i32>,
    width: Option<f64>,
    height: Option<f64>,
    maximized: Option<bool>,
    fullscreen: Option<bool>,
}


// 修正后的配置文件读取函数
fn load_config() -> AppConfig {
    let config_paths = get_possible_config_paths();

    for config_path in config_paths {
        println!("尝试读取配置文件: {:?}", config_path);

        match fs::read_to_string(&config_path) {
            Ok(content) => {
                match serde_json::from_str(&content) {
                    Ok(config) => {
                        println!("成功读取配置文件: {:?}", config);
                        return config;
                    }
                    Err(e) => {
                        println!("配置文件解析失败: {}", e);
                        continue;
                    }
                }
            }
            Err(e) => {
                println!("读取配置文件失败: {} - {}", config_path.display(), e);
                continue;
            }
        }
    }

    println!("未找到配置文件，使用默认配置");
    AppConfig::default()
}

// 简化的路径获取函数（移除了 Tauri API 依赖）
fn get_possible_config_paths() -> Vec<PathBuf> {
    let mut paths = Vec::new();

    // 1. 可执行文件同目录
    if let Ok(exe_path) = std::env::current_exe() {
        if let Some(exe_dir) = exe_path.parent() {
            paths.push(exe_dir.join("config.json"));
        }
    }

    // 2. 当前工作目录
    if let Ok(current_dir) = std::env::current_dir() {
        paths.push(current_dir.join("config.json"));
    }

    // 3. 开发环境特定路径
    if let Ok(current_dir) = std::env::current_dir() {
        // 如果在 target/debug 目录，尝试上级目录
        if current_dir.ends_with("target/debug") || current_dir.ends_with("target\\debug") {
            if let Some(parent) = current_dir.parent() {
                if let Some(grandparent) = parent.parent() {
                    paths.push(grandparent.join("config.json"));
                }
            }
        }
    }

    // 4. 相对路径
    paths.push(PathBuf::from("config.json"));
    paths.push(PathBuf::from("../config.json"));
    paths.push(PathBuf::from("../../config.json"));

    paths
}
// 读取窗口状态
fn load_window_state(app_handle: &AppHandle, window_label: &str) -> WindowState {
    // 获取应用数据目录
    let app_data_dir = app_handle.path().app_data_dir().unwrap_or_else(|_| {
        // 如果获取失败，使用当前目录
        std::env::current_dir().unwrap_or_else(|_| PathBuf::from("."))
    });

    let state_file = app_data_dir.join(format!("{}-window-state.json", window_label));

    match fs::read_to_string(&state_file) {
        Ok(content) => {
            serde_json::from_str(&content).unwrap_or_default()
        }
        Err(_) => WindowState::default(),
    }
}

// 创建窗口的通用函数
fn create_window_with_state(
    app: &AppHandle,
    label: &str,
    url: &str,
    default_size: (f64, f64),
    visible: bool,
) -> tauri::Result<tauri::WebviewWindow> {
    let saved_state = load_window_state(app, label);

    let mut builder = tauri::WebviewWindowBuilder::new(
        app,
        label,
        tauri::WebviewUrl::App(url.into()),
    ).visible(visible);

    // 应用保存的状态或使用默认值
    let width = saved_state.width.unwrap_or(default_size.0);
    let height = saved_state.height.unwrap_or(default_size.1);
    builder = builder.inner_size(width, height);

    if let (Some(x), Some(y)) = (saved_state.x, saved_state.y) {
        builder = builder.position(x as f64, y as f64);
    }

    if let Some(maximized) = saved_state.maximized {
        builder = builder.maximized(maximized);
    }

    if let Some(fullscreen) = saved_state.fullscreen {
        builder = builder.fullscreen(fullscreen);
    }

    builder.build()
}


// `create_tray_menu` 函数是正确的，无需修改
fn create_tray_menu(app_handle: &AppHandle) -> tauri::Result<Menu<Wry>> {
    let show = MenuItem::with_id(app_handle, "show", "显示窗口", true, None::<&str>)?;
    let hide = MenuItem::with_id(app_handle, "hide", "隐藏窗口", true, None::<&str>)?;
    let quit = MenuItem::with_id(app_handle, "quit", "退出", true, None::<&str>)?;
    let separator = PredefinedMenuItem::separator(app_handle)?;

    Menu::with_items(app_handle, &[&show, &hide, &separator, &quit])
}

// 2. 创建一个专门处理【菜单项点击】的处理器
fn menu_event_handler(app: &AppHandle, event: MenuEvent) {
    let main_window = app.get_webview_window("main").unwrap();
    match event.id().as_ref() {
        "show" => {
            main_window.show().unwrap();
            main_window.set_focus().unwrap();
        }
        "hide" => {
            main_window.hide().unwrap();
        }
        "quit" => {
            app.exit(0);
        }
        _ => {}
    }
}

// 3. 创建一个专门处理【托盘图标点击】的处理器
fn tray_icon_event_handler(tray: &TrayIcon, event: TrayIconEvent) {
    // 只处理点击事件
    if let TrayIconEvent::Click { button, .. } = event {
        let app = tray.app_handle();
        let main_window = app.get_webview_window("main").unwrap();

        if button == MouseButton::Left {
            println!("托盘图标被左键点击");
            if main_window.is_visible().unwrap() {
                main_window.hide().unwrap();
            } else {
                main_window.show().unwrap();
                main_window.set_focus().unwrap();
            }
        }
    }
}

fn main() {
    // 在应用启动前读取配置
    let config = load_config();

    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
            println!("{}, {:?}, {}", argv.join(" "), cwd, app.package_info().name);
            // 显示主窗口
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.set_focus();
                let _ = window.unminimize();
            }
        }))
        .plugin(tauri_plugin_fs::init())
        .setup(move |app| {
            // 在 setup 钩子中创建托盘
            TrayIconBuilder::with_id("main-tray")
                .menu(&create_tray_menu(&app.handle())?)
                .tooltip("我的 Tauri 应用")
                // 4. 分别注册两个事件处理器
                .on_menu_event(menu_event_handler) // 用于处理菜单项点击
                .on_tray_icon_event(tray_icon_event_handler) // 用于处理托盘图标点击
                .build(app)?;

            // 创建Todo窗口
            let todo_visible = config.todo_visible.unwrap();
            if todo_visible {
                let _todo = create_window_with_state(
                    app.handle(),
                    "todo",
                    "todo", // 你需要创建这个HTML文件
                    (600.0, 400.0), // 默认大小
                    todo_visible,
                );
            }

            // 创建markdown窗口
            let markdown_visible = config.markdown_visible.unwrap();
            if markdown_visible {
                let _markdown = create_window_with_state(
                    app.handle(),
                    "markdown",
                    "markdown", // 你需要创建这个HTML文件
                    (600.0, 400.0), // 默认大小
                    markdown_visible,
                );
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
