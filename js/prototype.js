// 原型编辑器核心逻辑
class PrototypeEditor {
    constructor() {
        this.canvas = document.getElementById('mobileCanvas');
        this.components = [];
        this.selectedComponent = null;
        this.grayscaleSlider = document.getElementById('grayscaleSlider');
        this.grayscaleValue = document.getElementById('grayscaleValue');
        this.componentCount = document.getElementById('componentCount');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupComponentLibrary();
        this.updateComponentCount();
    }
    
    setupEventListeners() {
        // 灰度调节
        this.grayscaleSlider.addEventListener('input', (e) => {
            const value = e.target.value;
            this.grayscaleValue.textContent = `${value}%`;
            
            if (this.selectedComponent) {
                this.updateComponentGrayscale(this.selectedComponent, value);
            }
        });
        
        // 边框粗细控制
        document.querySelectorAll('.border-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const size = e.target.dataset.size;
                document.querySelectorAll('.border-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                if (this.selectedComponent) {
                    this.updateComponentBorder(this.selectedComponent, size);
                }
            });
        });
        
        // 圆角控制
        document.querySelectorAll('.radius-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const radius = e.target.dataset.radius;
                document.querySelectorAll('.radius-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                if (this.selectedComponent) {
                    this.updateComponentRadius(this.selectedComponent, radius);
                }
            });
        });
        
        // 组件库点击事件
        document.querySelectorAll('.component-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const type = e.currentTarget.dataset.type;
                this.addComponent(type);
            });
        });
        
        // 画布点击事件（用于取消选择）
        this.canvas.addEventListener('click', (e) => {
            if (e.target === this.canvas) {
                this.deselectComponent();
            }
        });
        
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (this.selectedComponent) {
                    this.removeComponent(this.selectedComponent);
                }
            }
            
            // 撤销/重做快捷键
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z' && !e.shiftKey) {
                    e.preventDefault();
                    // 撤销逻辑
                } else if (e.key === 'z' && e.shiftKey) {
                    e.preventDefault();
                    // 重做逻辑
                }
            }
        });
    }
    
    setupComponentLibrary() {
        // 为组件库添加拖拽功能
        document.querySelectorAll('.component-item').forEach(item => {
            item.setAttribute('draggable', 'true');
            
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', item.dataset.type);
                e.dataTransfer.effectAllowed = 'copy';
            });
        });
        
        // 画布接收拖拽
        this.canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        });
        
        this.canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            const type = e.dataTransfer.getData('text/plain');
            if (type) {
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                this.addComponentAtPosition(type, x, y);
            }
        });
    }
    
    addComponent(type) {
        const component = this.createComponent(type);
        this.components.push(component);
        this.canvas.appendChild(component.element);
        this.selectComponent(component);
        this.updateComponentCount();
    }
    
    addComponentAtPosition(type, x, y) {
        const component = this.createComponent(type);
        
        // 设置位置
        component.element.style.left = `${x - component.width / 2}px`;
        component.element.style.top = `${y - component.height / 2}px`;
        
        this.components.push(component);
        this.canvas.appendChild(component.element);
        this.selectComponent(component);
        this.updateComponentCount();
    }
    
    createComponent(type) {
        const id = `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const element = document.createElement('div');
        
        let component;
        
        switch(type) {
            case 'rectangle':
                component = this.createRectangle(id, element);
                break;
            case 'text':
                component = this.createText(id, element);
                break;
            case 'icon':
                component = this.createIcon(id, element);
                break;
            default:
                component = this.createRectangle(id, element);
        }
        
        // 添加事件监听
        this.setupComponentEvents(component);
        
        return component;
    }
    
    createRectangle(id, element) {
        element.className = 'canvas-component canvas-rectangle';
        element.id = id;
        element.style.width = '100px';
        element.style.height = '60px';
        element.style.left = '50px';
        element.style.top = '50px';
        
        return {
            id,
            element,
            type: 'rectangle',
            width: 100,
            height: 60,
            x: 50,
            y: 50,
            grayscale: 0,
            borderWidth: 2,
            borderRadius: 8
        };
    }
    
    createText(id, element) {
        element.className = 'canvas-component canvas-text';
        element.id = id;
        element.textContent = '文本内容';
        element.style.width = '80px';
        element.style.height = '40px';
        element.style.left = '100px';
        element.style.top = '100px';
        element.contentEditable = true;
        
        return {
            id,
            element,
            type: 'text',
            width: 80,
            height: 40,
            x: 100,
            y: 100,
            grayscale: 0,
            borderWidth: 1,
            borderRadius: 4,
            content: '文本内容'
        };
    }
    
    createIcon(id, element) {
        element.className = 'canvas-component canvas-icon';
        element.id = id;
        element.innerHTML = '<i class="fas fa-star"></i>';
        element.style.width = '40px';
        element.style.height = '40px';
        element.style.left = '150px';
        element.style.top = '150px';
        
        return {
            id,
            element,
            type: 'icon',
            width: 40,
            height: 40,
            x: 150,
            y: 150,
            grayscale: 0,
            borderWidth: 0,
            borderRadius: 0,
            icon: 'star'
        };
    }
    
    setupComponentEvents(component) {
        const element = component.element;
        
        // 点击选择
        element.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectComponent(component);
        });
        
        // 双击编辑文本
        if (component.type === 'text') {
            element.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                element.focus();
            });
            
            element.addEventListener('blur', () => {
                component.content = element.textContent;
            });
        }
        
        // 拖拽功能
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        
        element.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('resize-handle')) return;
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseInt(element.style.left) || 0;
            startTop = parseInt(element.style.top) || 0;
            
            this.selectComponent(component);
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            
            function onMouseMove(e) {
                if (!isDragging) return;
                
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                
                element.style.left = `${startLeft + dx}px`;
                element.style.top = `${startTop + dy}px`;
                
                component.x = startLeft + dx;
                component.y = startTop + dy;
            }
            
            function onMouseUp() {
                isDragging = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }
        });
        
        // 右键菜单
        element.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.selectComponent(component);
            // 这里可以添加右键菜单功能
        });
    }
    
    selectComponent(component) {
        // 取消之前的选择
        this.deselectComponent();
        
        // 设置新选择
        this.selectedComponent = component;
        component.element.classList.add('selected');
        
        // 更新属性面板
        this.updatePropertyPanel(component);
        
        // 添加调整手柄
        this.addResizeHandles(component);
    }
    
    deselectComponent() {
        if (this.selectedComponent) {
            this.selectedComponent.element.classList.remove('selected');
            this.removeResizeHandles();
            this.selectedComponent = null;
            
            // 重置属性面板
            this.grayscaleSlider.value = 0;
            this.grayscaleValue.textContent = '0%';
        }
    }
    
    updatePropertyPanel(component) {
        this.grayscaleSlider.value = component.grayscale;
        this.grayscaleValue.textContent = `${component.grayscale}%`;
        
        // 更新边框按钮
        document.querySelectorAll('.border-btn').forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.size) === component.borderWidth) {
                btn.classList.add('active');
            }
        });
        
        // 更新圆角按钮
        document.querySelectorAll('.radius-btn').forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.radius) === component.borderRadius) {
                btn.classList.add('active');
            }
        });
    }
    
    addResizeHandles(component) {
        const handles = ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'];
        
        handles.forEach(position => {
            const handle = document.createElement('div');
            handle.className = `resize-handle ${position}`;
            component.element.appendChild(handle);
            
            // 调整大小逻辑
            this.setupResizeHandle(handle, component, position);
        });
    }
    
    removeResizeHandles() {
        document.querySelectorAll('.resize-handle').forEach(handle => {
            handle.remove();
        });
    }
    
    setupResizeHandle(handle, component, position) {
        let isResizing = false;
        let startX, startY, startWidth, startHeight, startLeft, startTop;
        
        handle.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = component.width;
            startHeight = component.height;
            startLeft = component.x;
            startTop = component.y;
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            
            function onMouseMove(e) {
                if (!isResizing) return;
                
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                
                let newWidth = startWidth;
                let newHeight = startHeight;
                let newLeft = startLeft;
                let newTop = startTop;
                
                switch(position) {
                    case 'e':
                        newWidth = Math.max(20, startWidth + dx);
                        break;
                    case 'w':
                        newWidth = Math.max(20, startWidth - dx);
                        newLeft = startLeft + dx;
                        break;
                    case 's':
                        newHeight = Math.max(20, startHeight + dy);
                        break;
                    case 'n':
                        newHeight = Math.max(20, startHeight - dy);
                        newTop = startTop + dy;
                        break;
                    case 'se':
                        newWidth = Math.max(20, startWidth + dx);
                        newHeight = Math.max(20, startHeight + dy);
                        break;
                    case 'sw':
                        newWidth = Math.max(20, startWidth - dx);
                        newHeight = Math.max(20, startHeight + dy);
                        newLeft = startLeft + dx;
                        break;
                    case 'ne':
                        newWidth = Math.max(20, startWidth + dx);
                        newHeight = Math.max(20, startHeight - dy);
                        newTop = startTop + dy;
                        break;
                    case 'nw':
                        newWidth = Math.max(20, startWidth - dx);
                        newHeight = Math.max(20, startHeight - dy);
                        newLeft = startLeft + dx;
                        newTop = startTop + dy;
                        break;
                }
                
                // 更新组件
                component.element.style.width = `${newWidth}px`;
                component.element.style.height = `${newHeight}px`;
                component.element.style.left = `${newLeft}px`;
                component.element.style.top = `${newTop}px`;
                
                component.width = newWidth;
                component.height = newHeight;
                component.x = newLeft;
                component.y = newTop;
            }
            
            function onMouseUp() {
                isResizing = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }
        });
    }
    
    updateComponentGrayscale(component, grayscale) {
        component.grayscale = parseInt(grayscale);
        
        if (component.type === 'icon') {
            const icon = component.element.querySelector('i');
            if (icon) {
                icon.style.filter = `grayscale(${grayscale}%)`;
            }
        } else {
            component.element.style.filter = `grayscale(${grayscale}%)`;
        }
    }
    
    updateComponentBorder(component, width) {
        component.borderWidth = parseInt(width);
        component.element.style.borderWidth = `${width}px`;
    }
    
    updateComponentRadius(component, radius) {
        component.borderRadius = parseInt(radius);
        component.element.style.borderRadius = `${radius}px`;
    }
    
    removeComponent(component) {
        const index = this.components.indexOf(component);
        if (index > -1) {
            this.components.splice(index, 1);
            component.element.remove();
            this.selectedComponent = null;
            this.updateComponentCount();
        }
    }
    
    updateComponentCount() {
        this.componentCount.textContent = this.components.length;
    }
    
    // 保存和加载功能占位
    save() {
        const data = {
            components: this.components.map(comp => ({
                type: comp.type,
                x: comp.x,
                y: comp.y,
                width: comp.width,
                height: comp.height,
                grayscale: comp.grayscale,
                borderWidth: comp.borderWidth,
                borderRadius: comp.borderRadius,
                content: comp.content,
                icon: comp.icon
            }))
        };
        
        localStorage.setItem('prototype-data', JSON.stringify(data));
        console.log('原型已保存');
    }
    
    load() {
        const data = localStorage.getItem('prototype-data');
        if (data) {
            const parsed = JSON.parse(data);
            // 加载逻辑
            console.log('原型已加载');
        }
    }
}

// 初始化编辑器
document.addEventListener('DOMContentLoaded', () => {
    const editor = new PrototypeEditor();
    
    // 保存按钮
    document.querySelector('.header-btn:nth-child(1)').addEventListener('click', () => {
        editor.save();
        alert('原型已保存到本地存储');
    });
    
    // 预览按钮
    document.querySelector('.header-btn.primary').addEventListener('click', () => {
        alert('预览功能将在后续版本中实现');
    });
    
    // 撤销按钮
    document.querySelector('.action-btn:nth-child(1)').addEventListener('click', () => {
        alert('撤销功能将在后续版本中实现');
    });
    
    // 重做按钮
    document.querySelector('.action-btn:nth-child(2)').addEventListener('click', () => {
        alert('重做功能将在后续版本中实现');
    });
    
    // 清空按钮
    document.querySelector('.action-btn:nth-child(3)').addEventListener('click', () => {
        if (confirm('确定要清空画布吗？')) {
            editor.components.forEach(comp => comp.element.remove());
            editor.components = [];
            editor.updateComponentCount();
            editor.deselectComponent();
        }
    });
    
    // 最大化按钮
    document.querySelectorAll('.action-btn')[3].addEventListener('click', () => {
        alert('最大化功能将在后续版本中实现');
    });
    
    // 导出按钮
    document.querySelectorAll('.action-btn')[4].addEventListener('click', () => {
        alert('导出功能将在后续版本中实现');
    });
    
    // 侧边栏交互
    document.querySelectorAll('.demand-header').forEach(header => {
        header.addEventListener('click', () => {
            const icon = header.querySelector('i');
            const pageList = header.nextElementSibling;
            
            if (pageList.style.display === 'none') {
                pageList.style.display = 'block';
                icon.style.transform = 'rotate(90deg)';
            } else {
                pageList.style.display = 'none';
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });
    
    // 页面点击
    document.querySelectorAll('.page-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.page-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // 这里可以加载对应页面的