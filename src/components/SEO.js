import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';

const query = graphql`
  query GetSiteMetadata {
    site {
      siteMetadata {
        title
        author
        description
        siteUrl
        social {
          twitter
        }
      }
    }
  }
`;

function SEO({ meta, image, title, description, slug, lang = 'en' }) {
  return (
    <StaticQuery
      query={query}
      render={data => {
        const { siteMetadata } = data.site;
        const metaDescription = description || siteMetadata.description;
        const metaImage = image ? `${siteMetadata.siteUrl}${image}` : null;
        const url = `${siteMetadata.siteUrl}${slug}`;
        return (
          <Helmet
            htmlAttributes={{ lang }}
            {...(title
              ? {
                  titleTemplate: `%s — ${siteMetadata.title}`,
                  title,
                }
              : {
                  title: `${siteMetadata.title} — Le blog d'Arnaud Ambroselli`,
                })}
            meta={[
              {
                name: 'description',
                content: metaDescription,
              },
              {
                property: 'og:url',
                content: url,
              },
              {
                property: 'og:title',
                content: title || siteMetadata.title,
              },
              {
                property: 'og:description',
                content: metaDescription,
              },
              {
                property: 'og:type',
                content: 'article',
              },
              {
                property: 'og:image:width',
                content: '300',
              },
              {
                property: 'og:image:height',
                content: '300',
              },
              {
                name: 'twitter:card',
                content: 'summary',
              },
              {
                name: 'twitter:creator',
                content: siteMetadata.social.twitter,
              },
              {
                name: 'twitter:title',
                content: title || siteMetadata.title,
              },
              {
                name: 'twitter:description',
                content: metaDescription,
              },
            ]
              .concat(
                metaImage
                  ? [
                      {
                        property: 'og:image',
                        content: metaImage,
                      },
                      {
                        property: 'og:image:url',
                        content: metaImage,
                      },
                      {
                        property: 'og:image:alt',
                        content: title,
                      },
                      {
                        property: 'og:image:type',
                        content: 'image/jpg',
                      },
                      {
                        name: 'twitter:image',
                        content: metaImage,
                      },
                    ]
                  : []
              )
              .concat(meta)}
          />
        );
      }}
    />
  );
}

SEO.defaultProps = {
  meta: [],
  title: '',
  slug: '',
};

SEO.propTypes = {
  description: PropTypes.string,
  image: PropTypes.string,
  meta: PropTypes.array,
  slug: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default SEO;
