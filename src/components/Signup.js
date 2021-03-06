import React from 'react';

import './Signup.css';

const JAVOLUTION_FORM_ID = 'GRumZEwsY0G';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      name: '',
      email_address: '',
      from: 'javolution',
      comment: '',
    };
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  async handleSubmit(e) {
    e.preventDefault();
    // console.log('handleSubmit', this.state)
    const formData = new FormData();
    formData.append('nom', this.state.name);
    formData.append('email', this.state.email_address);
    formData.append('blog', 'javolution ' + this.props.cta);

    const res = await fetch('https://formcarry.com/s/GRumZEwsY0G', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: formData,
    });
    if (res.ok) {
      window.location.href = window.location.origin + '/thanks';
    }
  }

  render() {
    let form,
      { cta } = this.props;
    switch (cta) {
      case 'JavaScript':
        form = {
          id: JAVOLUTION_FORM_ID,
          title: 'Subscribe to the Newsletter',
          subTitle: 'Subscribe to get my latest content by email.',
          buttonText: 'Subscribe',
          nameLabel: 'Your name',
          emailLabel: 'Your email',
          commentLabel: 'A comment ?',
          blog: 'Javolution - JavaScript',
          noSpam: {
            1: "I won't spam you.",
            2: 'Unsubscribe any time.',
          },
        };
        break;
      case 'Révolution':
      default:
        form = {
          id: JAVOLUTION_FORM_ID,
          title: 'Abonnez-vous',
          subTitle: 'Abonnez-vous pour recevoir mes derniers articles par mail.',
          buttonText: 'Abonnez-vous',
          nameLabel: 'Votre nom',
          emailLabel: 'Votre email',
          commentLabel: 'Un commentaire ?',
          blog: 'Javolution - Révolution',
          noSpam: {
            1: 'Je ne vous enverrai pas de spam.',
            2: 'Désabonnez-vous quand vous voulez.',
          },
        };
    }
    return (
      <form
        className="seva-form formkit-form"
        acceptCharset="UTF-8"
        method="post"
        onSubmit={this.handleSubmit}
        min-width="400 500 600 700 800"
        style={{
          boxShadow: 'var(--form-shadow)',
          backgroundColor: 'var(--bg)',
          borderRadius: '6px',
        }}>
        <div data-style="full">
          <div
            data-element="column"
            className="formkit-column"
            style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <h1
              className="formkit-header"
              data-element="header"
              style={{
                color: 'var(--textTitle)',
                fontSize: '20px',
                fontWeight: 700,
              }}>
              {form.title}
            </h1>
            <div
              data-element="subheader"
              className="formkit-subheader"
              style={{ color: 'var(--textNormal)' }}>
              <p>{form.subTitle}</p>
            </div>
            <div className="formkit-image">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="46"
                height="46"
                viewBox="0 0 46 46"
                style={{ maxWidth: '100%' }}>
                <g fill="none" fillRule="evenodd">
                  <path
                    fill="#DD92AB"
                    d="M23,36 C22.813,36 22.627,35.948 22.463,35.844 L0.463,21.844 C0.159,21.651 -0.017,21.308 0.001,20.948 C0.02,20.589 0.23,20.266 0.553,20.105 L23,6 L45.447,20.105 C45.769,20.266 45.98,20.588 45.999,20.948 C46.018,21.308 45.841,21.65 45.537,21.844 L23.537,35.844 C23.373,35.948 23.187,36 23,36 Z"
                  />
                  <path
                    fill="#FFF"
                    d="M38,37 L8,37 L8,1 C8,0.448 8.448,0 9,0 L37,0 C37.552,0 38,0.448 38,1 L38,37 Z"
                  />
                  <path
                    fill="#FFA7C4"
                    d="M45,46 C44.916,46 44.831,45.989 44.748,45.968 L21.748,39.968 L22,33 L46,21 L46,45 C46,45.31 45.856,45.602 45.611,45.792 C45.435,45.928 45.219,46 45,46 Z"
                  />
                  <path
                    fill="#FFC3D7"
                    d="M45,46 L1,46 C0.447,46 0,45.552 0,45 L0,21 L45.479,44.122 C45.88,44.341 46.083,44.804 45.969,45.247 C45.856,45.69 45.457,46 45,46 Z"
                  />
                  <path
                    fill="#FFA7C4"
                    d="M19 20.414L14.293 15.707C13.902 15.316 13.902 14.684 14.293 14.293L19 9.586 20.414 11 16.414 15 20.414 19 19 20.414zM27 20.414L25.586 19 29.586 15 25.586 11 27 9.586 31.707 14.293C32.098 14.684 32.098 15.316 31.707 15.707L27 20.414z"
                  />
                </g>
              </svg>
            </div>
          </div>
          <div data-element="column" className="formkit-column">
            <ul
              className="formkit-alert formkit-alert-error"
              data-element="errors"
              data-group="alert"
            />

            <div data-element="fields" className="seva-fields formkit-fields">
              <div className="formkit-field">
                <input
                  className="formkit-input"
                  aria-label={form.nameLabel}
                  name="name"
                  value={this.state.name}
                  onChange={this.handleChange}
                  placeholder={form.nameLabel}
                  type="text"
                  style={{
                    borderColor: 'rgb(227, 227, 227)',
                    borderRadius: '4px',
                    color: 'rgb(0, 0, 0)',
                    fontWeight: 400,
                  }}
                  required
                />
              </div>
              <div className="formkit-field">
                <input
                  className="formkit-input"
                  aria-label="Blog"
                  name="fields[blog]"
                  value={form.blog}
                  type="text"
                  readOnly
                  style={{
                    display: 'none',
                  }}
                  required
                />
              </div>
              <div className="formkit-field">
                <input
                  className="formkit-input"
                  name="email_address"
                  value={this.state.email_address}
                  onChange={this.handleChange}
                  aria-label={form.emailLabel}
                  placeholder={form.emailLabel}
                  required
                  type="email"
                  style={{
                    borderColor: 'rgb(227, 227, 227)',
                    borderRadius: '4px',
                    color: 'rgb(0, 0, 0)',
                    fontWeight: 400,
                  }}
                />
              </div>
              <div className="formkit-field">
                <textarea
                  className="formkit-input"
                  name="comment"
                  rows={3}
                  value={this.state.comment}
                  onChange={this.handleChange}
                  aria-label={form.commentLabel}
                  placeholder={form.commentLabel}
                  type="text"
                  style={{
                    borderColor: 'rgb(227, 227, 227)',
                    borderRadius: '4px',
                    color: 'rgb(0, 0, 0)',
                    fontWeight: 400,
                  }}
                />
              </div>
              <button
                data-element="submit"
                className="formkit-submit formkit-submit"
                style={{
                  backgroundColor: 'hsl(340, 63%, 55%)',
                  borderRadius: '24px',
                  color: 'white',
                  fontWeight: 700,
                }}>
                <div className="formkit-spinner" />
                <span>{form.buttonText}</span>
              </button>
            </div>
            <div
              data-element="guarantee"
              className="formkit-guarantee"
              style={{
                color: 'var(--textNormal)',
                fontSize: '13px',
                fontWeight: 400,
              }}>
              <p>{form.noSpam['1']}</p>
              <p>{form.noSpam['2']}</p>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default Signup;
