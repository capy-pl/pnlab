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
        amountName: {
          type: 'string',
        },
        transactionFields: {
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
        itemName: {
          type: 'string',
        },
        itemFields: {
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
        transactionName: {
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
          properties: {
            from: {
              type: 'number'
            },
            to: {
              type: 'number'
            },
            weight: {
              type: 'number'
            }
          }
        },
        communities: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: 'number',
              utility: 'number'
            }
          }
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
    StoredReport: {
      type: 'object',
      properties: {
        report: {
          type: 'Report'
        },
        name: {
          type: 'string'
        },
        description: {
          type: 'string'
        },
      }
    },
    User: {
      type: 'object',
      properties: {
        email: {
          type: 'string'
        },
        name: {
          type: 'string'
        },
        org: {
          type: 'Organization'
        }
      }
    },
    ItemGroup: {

    },
    Item: {
    },
    Transactions: {
    }
  },
};
