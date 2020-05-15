import React from 'react';
import Layout from '../components/Layout';

class NotFoundPage extends React.Component {
  render() {
    return (
      <Layout location={this.props.location}>
        <main>
          <h1>Pas trouvé</h1>
          <p>Je n'ai pas encore écrit cet article. Vous voulez m'aider ?</p>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/6IJB0aD8gSA"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullscreen
          />
          <p>Too doo doo doo doo doo doo doo</p>
        </main>
      </Layout>
    );
  }
}

export default NotFoundPage;
