import { gql } from "@apollo/client";
// handles querying the user's data for their profile page
export const QUERY_ME = gql`
    {
        me {
            _id
            username
            email
            savedBooks {
                bookId
                authors
                image
                description
                title
                link
            }
        }
    }
`;
