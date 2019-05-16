const schema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  definitions: {
    ImportSchema: {
      description: `
        The schema exist for two main purpose. The first
        parse csv file when importing data. The second is
        to provide filter options.`,
      type: 'object',
      properties: {
        amountColName: {
          type: 'string',
        },
        transactionCustomFields: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                },
                type: {
                  type: 'string',
                  enum: ['string', 'number', 'date']
                }
              }
            }
        },
        itemColName: {
          type: 'string',
        },
        itemCustomFields: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
              },
              type: {
                type: 'string',
                enum: ['string', 'number', 'date']
              }
            }
          }
        },
        transactionColName: {
          type: 'string',
        },
      }
    },
    Organization: {
      type: 'object',
      properties: {
        dbName: {
          type: 'string'
        },
        importSchema: {
          type: 'object',
          ref: 'ImportSchema'
        },
        name: {
          type: 'string'
        },
      },
    },
    Report: {
      type: 'object',
      properties: {
        created: {
          type: 'date',
        },
        modified: {
          type: 'date',
        },
        conditions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
              },
              value: {
                type: 'string',
              }
            }
          }
        },
        status: {
          type: 'string',
          enum: ['pending', 'success', 'error']
        },
        errorMessage: {
          type: 'string'
        },
        nodes: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string'
              },
              community: {
                type: 'number'
              },
              id: {
                type: 'string',
              },
              degree: {
                type: 'number',
              }
            }
          }
        },
        edges: {
          type: 'object',
        },
        filterGroups: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        filterItems: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        startTime: {
          type: 'date'
        },
        endTime: {
          type: 'date'
        }
      }
    },
    User: {

    },
    Transactions: {

    }
  },
};
