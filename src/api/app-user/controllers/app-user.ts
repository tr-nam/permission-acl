// src/api/app-user/controllers/app-user.ts
'use strict';

/**
 * app-user controller
 */

import { factories } from '@strapi/strapi';
import { Context } from 'koa'; // Import Context để có type-safety

export default factories.createCoreController('api::app-user.app-user', ({ strapi }) => ({

    // Hàm đăng nhập tùy chỉnh
    async appLogin(ctx: Context) {
        // 1. Lấy dữ liệu từ body
        const { identifier, password } = ctx.request.body as any;

        if (!identifier || !password) {
            return ctx.badRequest('Missing identifier or password');
        }

        // 2. TÌM USER TRONG BẢNG "AppUser" CỦA BẠN
        const user = await strapi.db.query('api::app-user.app-user').findOne({
            where: {
                $or: [{ username: identifier }, { email: identifier }],
            },
        });

        if (!user) {
            return ctx.badRequest('Invalid identifier or password');
        }

        // 3. SO SÁNH MẬT KHẨU
        const validPassword = await strapi.plugins['users-permissions'].services.user.validatePassword(
            password,
            user.password
        );

        if (!validPassword) {
            return ctx.badRequest('Invalid identifier or password');
        }

        // 4. TẠO TOKEN (JWT)
        const token = strapi.plugins['users-permissions'].services.jwt.issue({
            id: user.id,
        });

        // 5. LẤY TOÀN BỘ QUYỀN (populate)
        const populatedUser = await strapi.entityService.findOne('api::app-user.app-user', user.id, {
            populate: {
                app_groups: {
                    populate: ['app_permissions']
                },
            }
        }
        );

        // Xóa mật khẩu khỏi response cho an toàn
        delete populatedUser.password;

        // 6. TRẢ VỀ KẾT QUẢ
        ctx.send({
            jwt: token,
            user: populatedUser,
        });
    },
}));