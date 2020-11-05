export const resolvers = [
  {
    name: 'Conversations.integrationName',
    indexname: 'erxes__integrations',
    fieldname: 'name'
  },
  {
    name: 'Conversations.integrationKind',
    indexname: 'erxes__integrations',
    fieldname: 'kind'
  },
  {
    name: 'Conversations.firstRespondedUser',
    indexname: 'erxes__users',
    fieldname: 'username'
  }
];
