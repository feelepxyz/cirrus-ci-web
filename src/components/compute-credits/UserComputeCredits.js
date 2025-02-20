import React from 'react';
import { createPaginationContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import ComputeCreditsBase from './ComputeCreditsBase';

class UserComputeCredits extends React.Component {
  render() {
    return <ComputeCreditsBase accountId={this.props.user.githubUserId} {...this.props.user} />;
  }
}

export default createPaginationContainer(
  UserComputeCredits,
  {
    user: graphql`
      fragment UserComputeCredits_user on User
        @argumentDefinitions(count: { type: "Int", defaultValue: 100 }, cursor: { type: "String" }) {
        githubUserId
        balanceInCredits
        transactions(last: $count, after: $cursor) @connection(key: "UserComputeCredits_transactions") {
          edges {
            node {
              ...ComputeCreditsTransactionRow_transaction
            }
          }
        }
      }
    `,
  },
  {
    direction: 'forward',
    getConnectionFromProps(props) {
      return props.info && props.info.transactions;
    },
    // This is also the default implementation of `getFragmentVariables` if it isn't provided.
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      };
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count: count,
        cursor: cursor,
      };
    },
    query: graphql`
      query UserComputeCreditsQuery($count: Int!, $cursor: String) {
        viewer {
          ...UserComputeCredits_user @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);
