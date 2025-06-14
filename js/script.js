// 页面加载完成后延迟1秒显示内容
window.addEventListener('load', function() {
    const loader = document.getElementById('loader');
    const content = document.getElementById('content');
    
    // 等待1秒后隐藏加载动画
    setTimeout(function() {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        
        // 显示内容
        setTimeout(function() {
            content.style.opacity = '1';
        }, 300);
        
        // 页面加载后显示一个公告
        setTimeout(function() {
            showNotification('服务器预计7月1日开服，敬请期待！', 'announcement');
        }, 1500);
        
        // 再显示一个公告
        setTimeout(function() {
            showNotification('整合包已更新至v1.0.0版本，请及时下载更新！', 'announcement');
        }, 4000);
        
    }, 1000);
});

// 导航栏滚动动画
let lastScrollTop = 0;
const header = document.getElementById('main-header');
const logo = document.querySelector('.logo');

window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // 向下滚动时隐藏导航栏
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        header.classList.add('hidden');
    } else {
        header.classList.remove('hidden');
    }
    
    // 滚动时改变导航栏样式
    if (scrollTop > 50) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        logo.classList.add('scrolled');
        document.querySelector('.navbar').style.padding = '0.8rem 2rem';
    } else {
        header.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
        logo.classList.remove('scrolled');
        document.querySelector('.navbar').style.padding = '1.2rem 2rem';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// 平滑滚动 - 增强动画效果
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // 添加动画效果
            document.documentElement.style.scrollBehavior = 'smooth';
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // 移除滚动行为设置
            setTimeout(() => {
                document.documentElement.style.scrollBehavior = 'auto';
            }, 1000);
        }
    });
});

// 弹窗系统 - 修复间距问题
function showNotification(message, type, duration = 10000) {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // 根据类型设置图标
    let icon = '';
    if (type === 'announcement') {
        icon = '<i class="fas fa-info-circle notification-icon"></i>';
    } else if (type === 'error') {
        icon = '<i class="fas fa-exclamation-circle notification-icon"></i>';
    }
    
    notification.innerHTML = `
        <div class="notification-content">
            ${icon}
            ${message}
        </div>
        <button class="close-btn">&times;</button>
        <div class="notification-timer">
            <div class="notification-timer-bar"></div>
        </div>
    `;
    container.appendChild(notification);
    
    // 添加显示类触发动画
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 关闭按钮事件
    const closeBtn = notification.querySelector('.close-btn');
    closeBtn.addEventListener('click', function() {
        closeNotification(notification);
    });
    
    // 自动关闭
    if (duration) {
        const timerBar = notification.querySelector('.notification-timer-bar');
        
        // 确保进度条动画时间与实际关闭时间一致
        timerBar.style.animation = `timerAnimation ${duration}ms linear forwards`;
        
        setTimeout(() => {
            if (notification.parentNode) {
                closeNotification(notification);
            }
        }, duration);
    }
    
    // 更新所有弹窗位置
    updateNotificationsPosition();
}

function closeNotification(notification) {
    notification.classList.remove('show');
    notification.style.transform = 'translateX(120%)';
    notification.style.opacity = '0';
    
    // 等待动画结束移除
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
            updateNotificationsPosition(true); // 传入true表示关闭后需要动画
        }
    }, 400);
}

function updateNotificationsPosition(animate = false) {
    const container = document.getElementById('notification-container');
    const notifications = container.querySelectorAll('.notification');
    
    // 添加过渡效果
    if (animate) {
        notifications.forEach(notif => {
            notif.style.transition = 'top 0.4s ease';
        });
    }
    
    let top = 0;
    notifications.forEach(notif => {
        notif.style.top = `${top}px`;
        // 使用margin-bottom来控制弹窗间距
        top += notif.offsetHeight;
    });
    
    // 移除过渡效果
    if (animate) {
        setTimeout(() => {
            notifications.forEach(notif => {
                notif.style.transition = '';
            });
        }, 400);
    }
}

// 下载速率限制
const downloadBtn = document.querySelector('.download-btn');
let lastDownloadTime = 0;
let cooldownActive = false;

downloadBtn.addEventListener('click', function(e) {
    const currentTime = new Date().getTime();
    const cooldownPeriod = 5000; // 5秒冷却时间
    
    // 如果在冷却时间内
    if (currentTime - lastDownloadTime < cooldownPeriod) {
        e.preventDefault(); // 阻止下载
        
        // 如果还没有显示错误消息
        if (!cooldownActive) {
            cooldownActive = true;
            
            // 计算剩余时间
            const remainingTime = Math.ceil((cooldownPeriod - (currentTime - lastDownloadTime)) / 1000);
            
            // 显示错误弹窗
            showNotification(`下载过于频繁，请${remainingTime}秒后再试！`, 'error', 5000);
            
            // 添加禁用状态样式
            downloadBtn.classList.add('disabled');
            
            // 恢复按钮状态
            setTimeout(() => {
                downloadBtn.classList.remove('disabled');
                cooldownActive = false;
            }, cooldownPeriod - (currentTime - lastDownloadTime));
        }
    } else {
        // 允许下载，记录时间
        lastDownloadTime = currentTime;
    }
});