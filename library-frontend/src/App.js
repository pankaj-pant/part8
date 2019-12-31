import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import YearForm from './components/YearForm'
import { gql } from 'apollo-boost'
import { Query, ApolloConsumer, Mutation } from 'react-apollo'


const ALL_AUTHORS = gql`
{
  allAuthors  {
    name,
    born,
    bookCount,
    id
  }
}
`

const ALL_BOOKS = gql`
{
  allBooks  {
    title,
    published,
    author,
    genres,
    id
  }
}
`
const CREATE_BOOK = gql`
  mutation createBook($title: String!, $published: Int!, $author: String!, $genres: [String!]!) {
    addBook(
      title: $title,
      published: $published,
      author: $author,
      genres: $genres
    ){
      title
      published
      author
      genres
      id
    }
  }
`

const EDIT_AUTHOR = gql`
mutation editAuthor($name: String!, $born: Int!) {
  editAuthor(name: $name, born: $born)  {
    name
    born
    id
  }
}
`

const App = () => {
  const [page, setPage] = useState('authors')

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>
      <ApolloConsumer>
        {(client =>
          <>
            <Query query={ALL_AUTHORS}>
              {(result) =>
                <Authors show={page === 'authors'} result={result} client={client}/>
              }
            </Query>
            <Query query={ALL_BOOKS}>
              {(result) =>
                <Books show={page === 'books'} result={result} client={client}/>
              }
            </Query>
            
          </>
        )}
      </ApolloConsumer>
      <Mutation mutation={CREATE_BOOK} refetchQueries={[{ query: ALL_BOOKS }, { query: ALL_AUTHORS }]}>
        {(addBook) => 
          <NewBook show={page === 'add'} addBook={addBook}/>
        }
      </Mutation>
      <Mutation mutation={EDIT_AUTHOR} refetchQueries={[{ query: ALL_AUTHORS }]}>
        {(editAuthor) =>
          <YearForm editAuthor={editAuthor} />
        }
      </Mutation>
            
    </div>
    
  )

}

export default App