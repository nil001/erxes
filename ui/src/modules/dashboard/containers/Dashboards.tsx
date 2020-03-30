import gql from 'graphql-tag';
import { generatePaginationParams } from 'modules/common/utils/router';
import { commonListComposer } from 'modules/settings/utils';
import { graphql } from 'react-apollo';
import DashboardList from '../components/DashboardList';
import { mutations, queries } from '../graphql';
import { IDashboard } from '../types';

export type EmailTemplatesQueryResponse = {
  emailTemplates: IDashboard[];
  loading: boolean;
  refetch: () => void;
};

type Props = {
  queryParams: any;
};

export default commonListComposer<Props>({
  text: 'email template',
  label: 'emailTemplates',
  stringEditMutation: mutations.dashboardEdit,
  stringAddMutation: mutations.dashboardAdd,

  gqlListQuery: graphql(gql(queries.dashboards), {
    name: 'listQuery',
    options: ({ queryParams }: { queryParams: any }) => {
      return {
        notifyOnNetworkStatusChange: true,
        variables: generatePaginationParams(queryParams)
      };
    }
  }),

  gqlAddMutation: graphql(gql(mutations.dashboardAdd), {
    name: 'addMutation'
  }),

  gqlEditMutation: graphql(gql(mutations.dashboardEdit), {
    name: 'editMutation'
  }),

  gqlRemoveMutation: graphql(gql(mutations.dashboardRemove), {
    name: 'removeMutation'
  }),

  ListComponent: DashboardList
});
