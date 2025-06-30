// app/_utils/GlobalApi.js
import { request, gql } from 'graphql-request';

const CMS_API = process.env.NEXT_PUBLIC_BACKEND_API_URL;
const AUTH_TOKEN = process.env.NEXT_PUBLIC_HYGRAPH_TOKEN;

const headers = {
  Authorization: `Bearer ${AUTH_TOKEN}`,
};

// 👉 Fetch all categories
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
  const result = await request(CMS_API, query);
  return result.categories;
};

// 👉 Fetch all edits under a category
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
  const result = await request(CMS_API, query, { slug });
  return result.edits;
};

// 👉 Create & Publish Contact Submission (Minimal Fields Only)
const CreateContactSubmission = async (name, email, message) => {
  const mutation = gql`
    mutation CreateSubmission($name: String!, $email: String!, $message: String!) {
      createContactSubmission(data: { name: $name, email: $email, message: $message }) {
        id
      }
    }
  `;

  const publishMutation = gql`
    mutation PublishContact($id: ID!) {
      publishContactSubmission(to: PUBLISHED, where: { id: $id }) {
        name
        message
        email
        submittedat
      }
    }
  `;

  const variables = { name, email, message };

  try {
    const createResult = await request(CMS_API, mutation, variables, headers);
    const id = createResult.createContactSubmission.id;

    const publishResult = await request(CMS_API, publishMutation, { id }, headers);
    return publishResult.publishContactSubmission;
  } catch (error) {
    console.error('❌ GraphQL Error:', error);
    throw error;
  }
};

const api = {
  GetCategory,
  GetEditsByCategory,
  CreateContactSubmission,
};

export default api;
