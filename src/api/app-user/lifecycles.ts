// src/api/app-user/lifecycles.ts

export default {
    async beforeCreate(event) {
        const { data } = event.params;
        if (data.password) {
            data.password = await strapi.plugins['users-permissions'].services.user.hashPassword(data);
        }
    },

    async beforeUpdate(event) {
        const { data } = event.params;
        if (data.password) {
            data.password = await strapi.plugins['users-permissions'].services.user.hashPassword(data);
        }
    },
};