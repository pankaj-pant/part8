import React from 'react'

const RecommendedBooks = (props) => {

  if (!props.show) {
    return null
  }

  if (props.userGenre.data.me === null) {
    return <div>Please refresh if the page does not load in 3 seconds...</div>
  }

  const books = props.result.data.allBooks.filter(book => {
    return book.genres.includes(props.userGenre.data.me.favoriteGenre)
  })

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <strong>{props.userGenre.data.me.favoriteGenre}</strong></p>  
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(book =>
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          )}
        </tbody>
      </table>
     </div>
  )
}

export default RecommendedBooks