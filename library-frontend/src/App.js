import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import RecommendedBooks from './components/RecommendedBooks'
import { gql } from 'apollo-boost'
import { useQuery, useMutation, useApolloClient, useSubscription } from '@apollo/react-hooks'

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    id
    title
    published
    genres 
    author {
      name 
      id
      born
    }
  }
`

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
    ...BookDetails
  }
}
${BOOK_DETAILS}
`

const USER = gql`
  {
    me {
      username
      favoriteGenre
    }
  }
`
const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
${BOOK_DETAILS}
`

const CREATE_BOOK = gql`
  mutation createBook($title: String!, $published: Int!, $author: String!, $genres: [String!]!) {
    addBook(
      title: $title,
      published: $published,
      author: $author,
      genres: $genres
    ){
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
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

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const [page, setPage] = useState('authors')

  useEffect(() => {
    const storedToken = localStorage.getItem('library-user-token')
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const handleError = (error) => {
    setErrorMessage(error.graphQLErrors[0].message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const client = useApolloClient()

  const authors = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)
  const user = useQuery(USER)

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) =>
      set.map(b => b.id).includes(object.id)  

    const dataInStore = client.readQuery({query: ALL_BOOKS})
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      dataInStore.allBooks.push(addedBook)
      client.writeQuery({
        query: ALL_BOOKS,
        data: dataInStore
      })
    }   
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({subscriptionData}) => {
      const addedBook = subscriptionData.data.bookAdded
      notify(`${addedBook.title} added`)
      updateCacheWith(addedBook)
    }
  })

  const [addBook] = useMutation( CREATE_BOOK, {
    onError: handleError,
    refetchQueries: [{query: ALL_BOOKS}, {query: ALL_AUTHORS}],
    update: (store, response) => {
      updateCacheWith(response.data.addBook)
    }
  })

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    onError: handleError,
    refetchQueries: [{query: ALL_AUTHORS}]
  })

  const [login] = useMutation(LOGIN, {
    onError: handleError
  })

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('authors')
  }

  const errorNotification = () => errorMessage &&
    <div style={{color: 'red'}}>
      {errorMessage}
    </div>

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        { token ?
          <>
            <button onClick={() => setPage('addBook')}>Add Book</button>
            <button onClick={() => setPage('recommendedBooks')}>Recommendations</button>
            <button onClick={logout}>Logout</button>
          </>
          :
          <button onClick={() => setPage('login')}>Login</button>
        }  
      </div>
      {errorNotification()}
          
      <Authors show={page === 'authors'} result={authors} editAuthor={editAuthor}/>
      <Books show={page === 'books'} result={books}/>      
      <NewBook show={page === 'addBook'} addBook={addBook} setPage={page => setPage(page)}/>
      <LoginForm show={page === 'login'} login={login} setToken={token => setToken(token)} setPage={page => setPage(page)}/>
      <RecommendedBooks show={page === 'recommendedBooks'} result={books} userGenre={user}/>
            
    </div> 
  )
}

export default App