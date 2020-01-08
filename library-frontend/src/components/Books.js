import React, { useState } from 'react'

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState('')

  if (!props.show) {
    return null
  }

  if (props.result.loading) {
    return <div>loading...</div>
  }

  const books = props.result.data.allBooks.filter(book => {
    if (!selectedGenre) {
      return book
    }
    return book.genres.includes(selectedGenre)
  })

  let allGenres = books.reduce(function(accumulator, currentValue) {
    return [...accumulator, ...currentValue.genres]
  }, [])

  const uniqueGenres = [...new Set(allGenres)]

  return (
    <div>
      <h2>books</h2>
      <p>
        {!selectedGenre ? 'Books in all genres' : 'Books in genre '}
        <strong>{selectedGenre}</strong>
      </p>
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
      <div>
        <h2>Filter by genre</h2>
        <button onClick={() => setSelectedGenre('')}>all genres</button>
        {uniqueGenres.map(genre =>
          <button key={genre} onClick={() => setSelectedGenre(genre)}>{genre}</button>
        )}
      </div>
    </div>
  )
}

export default Books