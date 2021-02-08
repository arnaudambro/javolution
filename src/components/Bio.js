import React from 'react';
import profilePic from '../assets/profile-pic.jpg';
import { rhythm } from '../utils/typography';

class Bio extends React.Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: rhythm(2),
        }}>
        <img
          src={profilePic}
          alt={`Arnaud Ambroselli`}
          style={{
            marginRight: rhythm(1 / 2),
            marginBottom: 0,
            width: rhythm(2),
            height: rhythm(2),
            borderRadius: '50%',
          }}
        />
        <p style={{ maxWidth: 510, marginBottom: 0 }}>
          Blog d'Arnaud Ambroselli.
          <br />
          Code et politique. <br />
          JavaScript et Révolution.
          <br />
          Javolution.
          <br />
        </p>
      </div>
    );
  }
}

export default Bio;
