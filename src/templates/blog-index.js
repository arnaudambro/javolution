import { Link, graphql } from 'gatsby';
import { formatPostDate, formatReadingTime } from '../utils/helpers';

import Bio from '../components/Bio';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import Panel from '../components/Panel';
import React from 'react';
import SEO from '../components/SEO';
import get from 'lodash/get';
import { rhythm } from '../utils/typography';

const tags = ['JavaScript', 'Révolution'];
const STORAGE_KEY_TAGS = 'javolution-tags';

const getInitTags = () => {
  if (typeof window === `undefined`) return tags;
  if (window === undefined) return tags;
  if (!window.localStorage) return tags;
  if (tags.includes(window.location.hash.replace('#', '')))
    return [window.location.hash.replace('#', '')];
  const savedTags = window.localStorage.getItem(STORAGE_KEY_TAGS);
  if (!savedTags) return tags;
  return savedTags;
};

class BlogIndexTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      tags: getInitTags(),
    };
  }

  handleClick(e) {
    const tag = e.target.value;
    this.setState(
      ({ tags }) => {
        if (tags.includes(tag)) {
          return {
            tags: tags.filter(t => t !== tag),
          };
        }
        return {
          tags: [...tags, tag],
        };
      },
      () => {
        if (typeof window === `undefined`) return;
        if (!window.localStorage) return;
        window.localStorage.setItem(STORAGE_KEY_TAGS, JSON.stringify(this.state.tags));
      }
    );
  }

  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title');
    const langKey = this.props.pageContext.langKey;

    const posts = get(this, 'props.data.allMarkdownRemark.edges');

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO />
        <aside>
          <Bio />
        </aside>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <span>Tags&nbsp;:&nbsp;</span>
          {tags.map(tag => (
            <button
              onClick={this.handleClick}
              key={tag}
              value={tag}
              className={`tag${this.state.tags.includes(tag) ? ' selected' : ''}`}>
              {tag}
            </button>
          ))}
        </div>
        <main>
          {posts
            .filter(({ node }) => {
              const postTags = get(node, 'frontmatter.tags');
              if (!postTags.length) return true;
              if (!this.state.tags.length) return true;
              const splitPostTags = postTags.split(', ');
              let filter = false;
              for (let tag of splitPostTags) {
                if (this.state.tags.includes(tag)) filter = true;
              }
              return filter;
            })
            .map(({ node }) => {
              const title = get(node, 'frontmatter.title') || node.fields.slug;

              return (
                <article key={node.fields.slug}>
                  <header>
                    <h3
                      style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: rhythm(1),
                        marginBottom: rhythm(1 / 4),
                      }}>
                      <Link style={{ boxShadow: 'none' }} to={node.fields.slug} rel="bookmark">
                        {title}
                      </Link>
                    </h3>
                    <small>
                      {formatPostDate(node.frontmatter.date, langKey)}
                      {` • ${formatReadingTime(node.timeToRead)}`}
                    </small>
                  </header>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: node.frontmatter.spoiler,
                    }}
                  />
                </article>
              );
            })}
        </main>
        <Footer />
      </Layout>
    );
  }
}

export default BlogIndexTemplate;

export const pageQuery = graphql`
  query($langKey: String!) {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark(
      filter: { fields: { langKey: { eq: $langKey } } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          fields {
            slug
            langKey
          }
          timeToRead
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            spoiler
            tags
          }
        }
      }
    }
  }
`;
