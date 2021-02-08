import React from 'react';
import Layout from '../components/Layout';
import get from 'lodash/get';
import { graphql } from 'gatsby';

class Confirm extends React.Component {
  render() {
    const siteTitle = get(this.props, 'data.site.siteMetadata.title');
    return (
      <Layout location={this.props.location} title={siteTitle}>
        <main>
          <h1>Presque fini...</h1>
          <p>
            Merci pour votre abonnement. Vous devez regarder votre boîte mail pour le confirmer.
          </p>
        </main>
      </Layout>
    );
  }
}

export const pageQuery = graphql`
  query ConfirmSiteData {
    site {
      siteMetadata {
        title
      }
    }
  }
`;

export default Confirm;
