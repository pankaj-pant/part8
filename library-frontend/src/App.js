import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { gql } from 'apollo-boost'
import { Query, ApolloConsumer } from 'react-apollo'


const ALL_AUTHORS = gql`
{
  allAuthors  {
    name,
    born,
    bookCount
  }
}
`

const ALL_BOOKS = gql`
{
  allBooks  {
    title,
    published,
    author,
    genres
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
            <NewBook show={page === 'add'} />
          </>
        )}
      </ApolloConsumer>
    </div>
    
  )
  

/*   return <Query query={ALL_AUTHORS}>
    {(result) => { 
     
  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>
  
      <Authors
        show={page === 'authors'}
        result={result}
      />

      <Books
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'}
      />

    </div>
  )
}}
</Query> */

}

export default App