
/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 * }
 */

export default [
    
    {
        path: '/home',
        name: 'home',
        meta: {
            title: '登录',
            hideInMenu: true,
            showAlways: true
        },
        // component: () => import('@/view/home')
        component: resolve => require(["../view/home"], resolve)
    },
    {
        path: '/terrace',
        name: 'terrace',
        meta: {
            title: '登录',
            hideInMenu: true,
            showAlways: true
        },
        component: resolve => require(["../view/terrace"], resolve),
    },
    {
        path: '/report',
        name: 'report',
        meta: {
            title: '登录',
            hideInMenu: true,
            showAlways: true
        },
        component: resolve => require(["../view/report"], resolve),
    },
    {
        path: '/',
        name: '_home',
        redirect: '/home',
        meta: {
            title: '登录',
            hideInMenu: true,
            showAlways: true
        },
        component: resolve => require(["../view/home"], resolve),
        
    },
    {
        path: '/401',
        name: 'error_401',
        meta: {
            hideInMenu: true
        },
        component: resolve => require(["@/view/error-page/401.vue"], resolve),
    },
    {
        path: '/500',
        name: 'error_500',
        meta: {
            hideInMenu: true
        },
        component: resolve => require(["@/view/error-page/500.vue"], resolve),
    },
    {
        path: '*',
        name: 'error_404',
        meta: {
            hideInMenu: true
        },
        component: resolve => require(["@/view/error-page/404.vue"], resolve),
    }
]
