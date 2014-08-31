'use strict';

module.exports = {
  nodes: [
    {
      label: 'fn1',
      nodes: [
        {
          label: 'parallel',
          nodes: [
            {
              label: '<anonymous>',
              nodes: []
            },
            {
              label: 'noop',
              nodes: []
            }
          ]
        }
      ]
    },
    {
      label: 'fn2',
      nodes: [
        {
          label: 'parallel',
          nodes: [
            {
              label: '<anonymous>',
              nodes: []
            },
            {
              label: 'noop',
              nodes: []
            }
          ]
        }
      ]
    },
    {
      label: 'fn3',
      nodes: [
        {
          label: 'series',
          nodes: [
            {
              label: 'fn1',
              nodes: [
                {
                  label: 'parallel',
                  nodes: [
                    {
                      label: '<anonymous>',
                      nodes: []
                    },
                    {
                      label: 'noop',
                      nodes: []
                    }
                  ]
                }
              ],
            },
            {
              label: 'fn2',
              nodes: [
                {
                  label: 'parallel',
                  nodes: [
                    {
                      label: '<anonymous>',
                      nodes: []
                    },
                    {
                      label: 'noop',
                      nodes: []
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
