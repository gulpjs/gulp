'use strict';

module.exports = {
  nodes: [
    {
      label: 'fn1',
      nodes: []
    },
    {
      label: 'fn2',
      nodes: []
    },
    {
      label: 'fn3',
      nodes: [
        {
          label: 'series',
          nodes: [
            {
              label: 'fn1',
              nodes: [],
            },
            {
              label: 'fn2',
              nodes: []
            }
          ]
        }
      ]
    }
  ]
};
