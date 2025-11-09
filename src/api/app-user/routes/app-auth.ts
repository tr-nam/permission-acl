// src/api/app-user/routes/app-auth.ts
/**
 * app-auth router
 */
module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/app-auth/login',
            handler: 'app-user.appLogin', // Trỏ tới hàm appLogin
            config: {
                auth: false, // Tắt xác thực cho endpoint này
            },
        },
    ],
};