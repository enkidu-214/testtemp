import App from '../App.vue'

// 登录
const login = r => require.ensure([], () => r(require('../pages/login/login.vue')), 'login')

/* 数据看板 */
const dataService = r => require.ensure([], () => r(require('../pages/dataService')), 'dataService')

//组织成绩报表
const orgResultReport = r => require.ensure([], () => r(require('../pages/dataService/children/orgResultReport.vue')), 'orgResultReport')
//计划训练报表
const planResultReport = r => require.ensure([], () => r(require('../pages/dataService/children/planResultReport.vue')), 'planResultReport')

/* 执勤服务 */
const dutyService = r => require.ensure([], () => r(require('../pages/dutyService/index.vue')), 'dutyService')
// 执勤监控
const sentryMonitor = r => require.ensure([], () => r(require('../pages/dutyService/monitor')), 'monitor')
// 指挥控制
const sentryControl = r => require.ensure([], () => r(require('../pages/dutyService/control')), 'control')
// 路线规划
const sentryScheduler = r => require.ensure([], () => r(require('../pages/dutyService/scheduler')), 'scheduler')
// 执勤数据
const sentryRecord = r => require.ensure([], () => r(require('../pages/dutyService/record')), 'record')
// 作业管理
const sentryTask = r => require.ensure([], () => r(require('../pages/dutyService/task')), 'task')
// 区域服务
const sentryRegion = r => require.ensure([], () => r(require('../pages/dutyService/region')), 'region')
// 气象服务
const weatherService = r => require.ensure([], () => r(require('../pages/dutyService/weather')), 'weather')

/* 人员定位服务 */
const searchService = r => require.ensure([], () => r(require('../pages/searchService')), 'searchService')

/* 用户/设备管理 */
const resourceService = r => require.ensure([], () => r(require('../pages/resourceService/')), 'resourceService')
// 用户管理
const userManager = r => require.ensure([], () => r(require('../pages/resourceService/children/user.vue')), 'user')
// 群组管理
const teamManager = r => require.ensure([], () => r(require('../pages/resourceService/children/team.vue')), 'team')
// 哨位管理
const sentryManager = r => require.ensure([], () => r(require('../pages/resourceService/children/sentry.vue')), 'sentry')
// 云台管理
const nacelleManager = r => require.ensure([], () => r(require('../pages/resourceService/children/nacelle.vue')), 'nacelle')
// 系统配置
const systemConfig = r => require.ensure([], () => r(require('../pages/resourceService/children/syscfg.vue')), 'syscfg')

/* 问题反馈 */
const feedBack = r => require.ensure([], () => r(require('../pages/feedback')), 'feedback')

/* 测试页面 */
const testService = r => require.ensure([], () => r(require('../pages/test/test2')), 'test')


export default [{
    path: '/',
    component: App, //顶层路由，对应index.html
    children: [ //二级路由。对应App.vue
        //地址为空时跳转monitor页面
        {
            path: '',
            redirect: '/login'
        },
        // 数据看板
        {
            path: '/dataService',
            component: dataService,
            children: [
                {
                    path: 'orgResultReport', //组织成绩报表
                    component: orgResultReport,
                },
                {
                    path: 'planResultReport', //计划训练报表
                    component: planResultReport,
                },
            ]
        },
        // 执勤服务
        {
            path: '/dutyService',
            component: dutyService,
            children: [
                //执勤监控
                {
                    path: 'monitor',
                    component: sentryMonitor,
                    meta: {
                        keepAlive: true
                    }
                },
                //指挥控制
                {
                    path: 'control',
                    component: sentryControl,
                    meta: {
                        keepAlive: true
                    }
                },
                // 路线规划
                {
                    path: 'scheduler',
                    component: sentryScheduler
                },
                //执勤记录
                {
                    path: 'record',
                    component: sentryRecord
                },
                //作业管理
                {
                    path: 'task',
                    component: sentryTask,
                },
                //区域服务
                {
                    path: 'region',
                    component: sentryRegion,
                },
                //气象服务
                {
                    path: 'weather',
                    component: weatherService
                },
            ]
        },
        // 人员定位服务
        {
            path: '/searchService',
            component: searchService
        },
        //用户设备管理
        {
            path: '/resourceService',
            component: resourceService,
            redirect: '/resourceService/user',
            children: [{
                path: 'user', //用户
                component: userManager,
            }, {
                path: 'team', //队伍
                component: teamManager,
            }, {
                path: 'sentry',  // 哨位
                component: sentryManager,
            }, {
                path: 'nacelle',  // 云台
                component: nacelleManager,
            }, {
                path: 'syscfg', // 系统参数配置
                component: systemConfig,
            }]
        },
        // 问题反馈
        {
            path: '/feedBack',
            component: feedBack
        },
        //登录注册页
        {
            path: '/login',
            component: login
        },
        //气象服务
        {
            path: '/test',
            component: testService
        },
        //个人信息页
        // {
        //     path: '/profile',
        //     component: profile,
        //     children: [{
        //         path: 'info', //个人信息详情页
        //         component: info,
        //         children: [{
        //             path: 'setusername',
        //             component: setusername,
        //         }, {
        //             path: 'address',
        //             component: address,     //编辑地址
        //             children: [{
        //                 path: 'add',
        //                 component: add,
        //                 children: [{
        //                     path: 'addDetail',
        //                     component: addDetail
        //                 }]
        //             }]
        //         }]
        //     },
        //     {
        //         path: 'service', //服务中心
        //         component: service,
        //     },]
        // },
        // //修改密码页
        // {
        //     path: '/forget',
        //     component: forget
        // },
    ]
}
]
