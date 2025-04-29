// src/mocks/handlers.js
import {http, HttpResponse} from 'msw'
// 读取 mock_users.json 文件（假设文件与 handlers.js 同目录）
import mockUsers from './mock_users.json';
export const handlers = [
    // 用户登录接口
    http.post('/api/login', async ({request}) => {
        const {account, password} = await request.json()

        // 模拟验证逻辑
        if (account === '123456' && password === 'a123456') {
            return HttpResponse.json({
                code: 200,
                data: {
                    token: 'yuangong_token',
                    username: '员工',
                    id: 2,
                    role: {
                        id: 2,
                        name: '普通员工',
                        intro: '一般权限',
                    }
                }
            })
        } else if (account === 'admin123' && password === 'admin123') {
            return HttpResponse.json({
                code: 200,
                data: {
                    token: 'admin_token',
                    username: '超级管理员',
                    id: 1,
                    role: {
                        id: 1,
                        name: '超级管理员',
                        intro: '所有权限',
                    }
                }
            })
        }

        // 模拟错误响应
        return HttpResponse.json(
            {code: 401, message: '账号或密码错误'},
            {status: 401}
        )
    }),

    // 验证登录接口
    // 在用户详情接口中添加Token验证
    http.get('/api/users/:id', async ({request, params}) => {
        // 1. Token验证
        const authHeader = request.headers.get('Authorization')
        if (!authHeader?.startsWith('Bearer ')) {
            return HttpResponse.json(
                {code: 401, message: "未授权访问"},
                {status: 401}
            )
        }

        // 2. 提取并验证Token有效性
        const token = authHeader.split(' ')[1]
        const validTokens = ['yuangong_token', 'admin_token'] // 来自登录接口的合法token
        if (!validTokens.includes(token)) {
            return HttpResponse.json(
                {code: 401, message: "无效的Token"},
                {status: 401}
            )
        }

        // 3. 参数处理（保留原有逻辑）
        const userId = Number(params.id)
        if (isNaN(userId)) {
            return HttpResponse.json(
                {code: 400, message: "无效的用户ID"},
                {status: 400}
            )
        }

        // 4. 模拟数据查询（根据token类型返回不同数据）
        const baseData = {
            id: userId,
            createAt: '2021-01-02T10:01:52.000Z',
            updateAt: new Date().toISOString()
        }

        const responseData = token === 'admin_token' ?
            // 管理员权限数据
            {
                ...baseData,
                name: '超级管理员',
                intro: '所有权限',
                role: {
                    id: 1,
                    name: '系统管理员',
                    permissions: "所有权限"
                },
                department: {
                    id: 1,
                    name: '技术部',
                    leader: '张三',
                    employeeCount: 50,
                    establishedDate: '2020-01-01',
                }
            } :
            // 普通用户数据
            {
                ...baseData,
                name: '普通用户',
                intro: '基础权限',
                role: {
                    id: 2,
                    name: '普通用户',
                    permissions: "普通权限",
                },
                department: {
                    id: 2,
                    name: '组织部',
                    leader: '李四',
                    employeeCount: 50,
                    establishedDate: '2020-01-01',
                }
            }

        return HttpResponse.json({
            code: 200,
            data: responseData
        })
    }),
    // 创建用户接口
    http.post('/api/users', async ({request}) => {
        const userData = await request.json()

        // 模拟创建成功
        return HttpResponse.json({
            code: 201,
            data: {
                ...userData,
                id: Date.now(), // 使用时间戳作为模拟ID
                createAt: new Date().toISOString(),
                updateAt: new Date().toISOString()
            }
        })
    }),

    http.post('/api/users/list', async ({ request }) => {
        try {
            // 获取原始请求参数对象
            const rawParams = await request.json();
            const {
                page = 1,
                limit = 10,
                username,   // 可能为 undefined
                email,
                role,
                status,
                startTime,
                endTime
            } = rawParams;

            // 参数基础校验
            if (!Number.isInteger(page) || page < 1 ||
                !Number.isInteger(limit) || limit < 1) {
                return HttpResponse.json(
                    { code: 400, message: '参数错误：page 和 limit 必须为正整数' },
                    { status: 400 }
                );
            }

            // 数据过滤逻辑
            let filteredUsers = mockUsers.filter(user => {
                // 用户名过滤（精确包含查询）
                if ('username' in rawParams && !user.username.includes(username)) {
                    return false;
                }

                // 邮箱过滤（精确包含查询）
                if ('email' in rawParams && !user.email.includes(email)) {
                    return false;
                }

                // 角色精确匹配（允许空角色查询）
                if ('role' in rawParams && user.role !== role) {
                    return false;
                }

                // 状态匹配（允许0值）
                if ('status' in rawParams && user.status !== Number(status)) {
                    return false;
                }

                // 时间范围过滤（需要同时存在起止时间）
                if ('startTime' in rawParams && 'endTime' in rawParams) {
                    const userTime = new Date(user.createTime).getTime();
                    const start = new Date(startTime).getTime();
                    const end = new Date(endTime).getTime();
                    if (!(userTime >= start && userTime <= end)) {
                        return false;
                    }
                }

                return true;
            });

            // 分页计算
            const offset = (page - 1) * limit;
            const paginatedList = filteredUsers.slice(offset, offset + limit);

            return HttpResponse.json({
                code: 200,
                data: {
                    list: paginatedList,
                    total: filteredUsers.length,
                    page: page,
                    limit: limit
                }
            });

        } catch (error) {
            return HttpResponse.json(
                { code: 500, message: `服务器内部错误: ${error.message}` },
                { status: 500 }
            );
        }
    }),

    // 获取单个用户接口
    http.get('/api/users/:id', async ({params}) => {
        const {id} = params

        // 模拟获取用户数据
        return HttpResponse.json({
            code: 200,
            data: {
                id: parseInt(id),
                username: `user${id}`,
                email: `user${id}@example.com`,
                role: {
                    id: (parseInt(id) % 3) + 1,
                    name: ['普通用户', '编辑', '管理员'][parseInt(id) % 3]
                },
                department: {
                    id: Math.floor(parseInt(id) / 10) + 1,
                    name: `部门${Math.floor(parseInt(id) / 10) + 1}`
                },
                createAt: '2023-01-01T00:00:00.000Z',
                updateAt: new Date().toISOString()
            }
        })
    }),

    // 更新用户接口
    http.patch('/api/users/:id', async ({params, request}) => {
        const {id} = params
        const updates = await request.json()

        // 模拟更新成功
        return HttpResponse.json({
            code: 200,
            data: {
                id: parseInt(id),
                ...updates,
                updateAt: new Date().toISOString()
            }
        })
    }),

    // 删除用户接口
    http.delete('/api/users/:id', async ({params}) => {
        const {id} = params

        // 模拟删除成功
        return HttpResponse.json({
            code: 200,
            message: `用户 ${id} 删除成功`
        })
    }),

    // 获取部门列表接口
    http.get('/api/departments', async () => {
        // 模拟部门数据
        const departments = [
            {
                id: 1,
                name: '总裁办',
                parentId: null,
                leader: 'coderwhy',
                createAt: '2021-01-02T10:03:09.000Z',
                updateAt: '2021-01-05T08:25:46.000Z'
            },
            {
                id: 2,
                name: '技术部',
                parentId: null,
                leader: 'techlead',
                createAt: '2021-01-03T10:03:09.000Z',
                updateAt: '2021-01-06T08:25:46.000Z'
            },
            {
                id: 3,
                name: '市场部',
                parentId: null,
                leader: 'marketlead',
                createAt: '2021-01-04T10:03:09.000Z',
                updateAt: '2021-01-07T08:25:46.000Z'
            }
        ]

        return HttpResponse.json({
            code: 200,
            data: departments
        })
    }),

    // 创建部门接口
    http.post('/api/departments', async ({request}) => {
        const departmentData = await request.json()

        // 模拟创建成功
        return HttpResponse.json({
            code: 201,
            data: {
                ...departmentData,
                id: Date.now(), // 使用时间戳作为模拟ID
                createAt: new Date().toISOString(),
                updateAt: new Date().toISOString()
            }
        })
    }),

    // 获取角色列表接口
    http.get('/api/roles', async () => {
        // 模拟角色数据
        const roles = [
            {
                id: 1,
                name: '超级管理员',
                intro: '所有权限',
                createAt: '2021-01-01T00:00:00.000Z',
                updateAt: '2021-01-01T00:00:00.000Z'
            },
            {
                id: 2,
                name: '编辑',
                intro: '内容编辑权限',
                createAt: '2021-01-02T00:00:00.000Z',
                updateAt: '2021-01-02T00:00:00.000Z'
            },
            {
                id: 3,
                name: '普通用户',
                intro: '基础权限',
                createAt: '2021-01-03T00:00:00.000Z',
                updateAt: '2021-01-03T00:00:00.000Z'
            }
        ]

        return HttpResponse.json({
            code: 200,
            data: roles
        })
    }),

    // 创建角色接口
    http.post('/api/roles', async ({request}) => {
        const roleData = await request.json()

        // 模拟创建成功
        return HttpResponse.json({
            code: 201,
            data: {
                ...roleData,
                id: Date.now(), // 使用时间戳作为模拟ID
                createAt: new Date().toISOString(),
                updateAt: new Date().toISOString()
            }
        })
    }),

    // 获取菜单列表接口
    http.get('/api/role/:id/menu', async ({params}) => {
        // 模拟菜单数据
        const menus = [
            {
                "id": 38,
                "name": "系统总览",
                "type": 1,
                "path": "/main/analysis",
                "icon": "el-icon-monitor",
                "sort": 1,
                "children": [
                    {
                        "id": 39,
                        "name": "核心技术",
                        "type": 2,
                        "path": "/main/overview",
                        "sort": 106,
                        "parentId": 38
                    },
                    {
                        "id": 48,
                        "name": "商品统计",
                        "type": 2,
                        "path": "/main/dashboard",
                        "sort": 107,
                        "parentId": 38
                    }
                ]
            },
            {
                "id": 1,
                "name": "系统管理",
                "type": 1,
                "path": "/system",
                "icon": "el-icon-setting",
                "sort": 2,
                "children": [
                    {
                        "id": 11,
                        "name": "用户管理",
                        "type": 2,
                        "path": "/system/users",
                        "sort": 201,
                        "parentId": 1
                    },
                    {
                        "id": 12,
                        "name": "部门管理",
                        "type": 2,
                        "path": "/system/departments",
                        "sort": 202,
                        "parentId": 1
                    },
                    {
                        "id": 13,
                        "name": "角色管理",
                        "type": 2,
                        "path": "/system/roles",
                        "sort": 203,
                        "parentId": 1
                    },
                    {
                        "id": 14,
                        "name": "权限管理",
                        "type": 2,
                        "path": "/system/permissions",
                        "sort": 204,
                        "parentId": 1
                    }
                ]
            },
            {
                "id": 2,
                "name": "内容管理",
                "type": 1,
                "path": "/content",
                "icon": "el-icon-document",
                "sort": 3,
                "children": [
                    {
                        "id": 21,
                        "name": "文章管理",
                        "type": 2,
                        "path": "/content/articles",
                        "sort": 301,
                        "parentId": 2
                    },
                    {
                        "id": 22,
                        "name": "图库管理",
                        "type": 2,
                        "path": "/content/gallery",
                        "sort": 302,
                        "parentId": 2
                    }
                ]
            },
            {
                "id": 3,
                "name": "数据统计",
                "type": 1,
                "path": "/statistics",
                "icon": "el-icon-data-line",
                "sort": 4,
                "children": [
                    {
                        "id": 31,
                        "name": "访问统计",
                        "type": 2,
                        "path": "/statistics/visits",
                        "sort": 401,
                        "parentId": 3
                    },
                    {
                        "id": 32,
                        "name": "销售报表",
                        "type": 2,
                        "path": "/statistics/sales",
                        "sort": 402,
                        "parentId": 3
                    }
                ]
            }
        ]
        // 角色权限映射表
        const rolePermission = {
            1: [38, 1, 2, 3],        // 管理员：系统总览 + 系统管理
            2: [38, 2],           // 普通用户：仅系统总览
            3: [1]             // 系统维护员：仅系统管理
        }

        try {
            const roleId = Number(params.id)

            // 获取当前角色允许访问的菜单ID
            const allowedIds = rolePermission[roleId] || []

            // 递归过滤菜单
            const filterMenu = (menus) => {
                return menus
                    .filter(menu => allowedIds.includes(menu.id))
                    .map(menu => ({
                        ...menu,
                        // 不再过滤子项
                        children: menu.children || []
                    }))
            }

            return HttpResponse.json({
                code: 200,
                data: filterMenu(menus),  // 严格匹配图片返回结构
            })
        } catch (error) {
            return HttpResponse.json({
                code: 500,
                data: null,
                message: `Error: ${error.message}`
            }, {status: 500})
        }
    }),

    // 获取商品列表接口
    http.get('/api/products', async ({}) => {
        // 模拟商品数据
        const products = [
            {
                id: 1,
                name: '商品1',
                description: '这是商品1的描述',
                price: 100,
                stock: 100,
                createAt: '2023-01-01T00:00:00.000Z',
                updateAt: new Date().toISOString()
            },
            {
                id: 2,
                name: '商品2',
                description: '这是商品2的描述',
                price: 200,
                stock: 50,
                createAt: '2023-01-02T00:00:00.000Z',
                updateAt: new Date().toISOString()
            }
        ]

        return HttpResponse.json({
            code: 200,
            data: products
        })
    }),

    // 创建商品接口
    http.post('/api/products', async ({request}) => {
        const productData = await request.json()

        // 模拟创建成功
        return HttpResponse.json({
            code: 201,
            data: {
                ...productData,
                id: Date.now(), // 使用时间戳作为模拟ID
                createAt: new Date().toISOString(),
                updateAt: new Date().toISOString()
            }
        })
    }),

    // 获取故事列表接口
    http.get('/api/stories', async ({}) => {
        // 模拟故事数据
        const stories = [
            {
                id: 1,
                title: '故事1',
                content: '这是故事1的内容',
                author: '作者1',
                createAt: '2023-01-01T00:00:00.000Z',
                updateAt: new Date().toISOString()
            },
            {
                id: 2,
                title: '故事2',
                content: '这是故事2的内容',
                author: '作者2',
                createAt: '2023-01-02T00:00:00.000Z',
                updateAt: new Date().toISOString()
            }
        ]

        return HttpResponse.json({
            code: 200,
            data: stories
        })
    }),

    // 创建故事接口
    http.post('/api/stories', async ({request}) => {
        const storyData = await request.json()

        // 模拟创建成功
        return HttpResponse.json({
            code: 201,
            data: {
                ...storyData,
                id: Date.now(), // 使用时间戳作为模拟ID
                createAt: new Date().toISOString(),
                updateAt: new Date().toISOString()
            }
        })
    }),

    // 高级查询接口
    http.post('/api/advanced-search', async ({request}) => {
        const searchData = await request.json()

        // 模拟查询结果
        return HttpResponse.json({
            code: 200,
            data: {
                query: searchData,
                results: [
                    {id: 1, name: '匹配项1', type: 'user'},
                    {id: 2, name: '匹配项2', type: 'product'}
                ]
            }
        })
    }),

    // 图表数据接口
    http.get('/api/charts/data', async () => {
        // 模拟图表数据
        const chartData = {
            labels: ['一月', '二月', '三月', '四月', '五月', '六月'],
            datasets: [
                {
                    label: '用户增长',
                    data: [12, 19, 3, 5, 2, 3],
                    borderColor: 'rgba(75,192,192,1)'
                },
                {
                    label: '订单量',
                    data: [2, 3, 20, 5, 1, 4],
                    borderColor: 'rgba(153,102,255,1)'
                }
            ]
        }

        return HttpResponse.json({
            code: 200,
            data: chartData
        })
    })
]