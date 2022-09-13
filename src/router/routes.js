import store from '../store';

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'Home', path: '', component: () => import('pages/Home.vue') },
      {
        name: 'Node',
        path: '/node/:nodeId',
        component: () => import('pages/Node.vue'),
        beforeEnter: (to, _, next) => {
          const { nodeId } = to.params;

          const { nodes } = store.getters;

          if (!nodes[nodeId]) return next('/');

          return next();
        },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
