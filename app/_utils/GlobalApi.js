// app/_utils/GlobelApi.js
import { request, gql } from 'graphql-request';

const Master_url = process.env.NEXT_PUBLIC_BACKEND_API_URL;
const NEXT_PUBLIC_HYGRAPH_API=process.env.NEXT_PUBLIC_HYGRAPH_API;

const GetCategory = async () => {
  const query = gql`
    query Category {
      categories {
        id
        name
        icon {
          url
        }
        slug
      }
    }
  `;
  const result = await request(Master_url, query);
  return result.categories;
};

const GetEditsByCategory = async (slug) => {
  const query = gql`
    query GetEditsByCategory($slug: String!) {
      edits(where: { category_some: { slug: $slug } }) {
        name
        slug
        description
        video {
          url
        }
      }
    }
  `;
  const result = await request(Master_url, query, { slug });
  return result.edits;
};

const api = {
  GetCategory,
  GetEditsByCategory
};
export default api;
