import { writeFileSync } from 'fs';

// 生成大量模拟用户数据
function generateMockUsers() {
    const users = [];
    for (let i = 1; i <= 100; i++) {
        const randomStatus = Math.floor(Math.random() * 2);
        const randomRole = ['admin', 'editor'][Math.floor(Math.random() * 2)];
        // 生成更精确的创建时间，范围是 2023 年全年
        const startCreateDate = new Date(2023, 0, 1);
        const endCreateDate = new Date(2023, 11, 31, 23, 59, 59, 999);
        const createTimestamp = startCreateDate.getTime() + Math.random() * (endCreateDate.getTime() - startCreateDate.getTime());
        const createDate = new Date(createTimestamp);

        // 生成更精确的更新时间，更新时间要晚于创建时间
        const endUpdateDate = new Date();
        const updateTimestamp = createDate.getTime() + Math.random() * (endUpdateDate.getTime() - createDate.getTime());
        const updateDate = new Date(updateTimestamp);

        const user = {
            id: i,
            username: `user${i}`,
            email: `user${i}@example.com`,
            role: randomRole,
            status: randomStatus,
            createTime: createDate.toISOString(),
            updateTime: updateDate.toISOString()
        };
        users.push(user);
    }
    return users;
}

// 生成模拟用户数据
const mockUsers = generateMockUsers();

// 保存模拟用户数据到 JSON 文件
try {
    writeFileSync('mock_users.json', JSON.stringify(mockUsers, null, 2));
    console.log('模拟用户数据已成功保存到 mock_users.json 文件');
} catch (error) {
    console.error('保存文件时出现错误:', error);
}
    