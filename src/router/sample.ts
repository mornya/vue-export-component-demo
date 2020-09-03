export default [
  {
    // 샘플
    path: '/sample',
    name: 'sample',
    component: () => import('@/layouts/DefaultLayout.vue'),
    redirect: { name: 'sample.sampleOne' },
    children: [
      {
        // 샘플 1
        path: 'sampleOne',
        name: 'sample.sampleOne',
        component: () => import('@/views/sample/SampleOne.vue'),
      },
      {
        // 샘플 2
        path: 'sampleTwo',
        name: 'sample.sampleTwo',
        component: () => import('@/views/sample/SampleTwo.vue'),
      },
    ],
  },
];
