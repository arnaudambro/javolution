import React from 'react';

import { rhythm } from '../utils/typography';

class Footer extends React.Component {
  render() {
    return (
      <footer
        style={{
          marginTop: rhythm(2.5),
          paddingTop: rhythm(1),
        }}>
        <div style={{ float: 'right' }}>
          <a href="/rss.xml" target="_blank" rel="noopener noreferrer">
            rss
          </a>
        </div>
        <a href="https://mobile.twitter.com/arnaudambro" target="_blank" rel="noopener noreferrer">
          twitter
        </a>{' '}
        &bull;{' '}
        <a href="https://github.com/arnaudambro/" target="_blank" rel="noopener noreferrer">
          github
        </a>{' '}
        &bull;{' '}
        <a
          href="https://stackoverflow.com/users/5225096/arnaudambro"
          target="_blank"
          rel="noopener noreferrer">
          stack overflow
        </a>
        &bull;{' '}
        <a href="https://medium.com/@arnaudambroselli" target="_blank" rel="noopener noreferrer">
          medium
        </a>
      </footer>
    );
  }
}

export default Footer;
