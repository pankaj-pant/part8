import React, { useState } from 'react'

const YearForm = (props) => {
    const [name, setName] = useState(props.authors[0].name)
    const [born, setBorn] = useState('')
  
    const submit = async (event) => {
      event.preventDefault()
  
      await props.editAuthor({
        variables: { name, born }
      })
  
      setName(props.authors[0].name)
      setBorn('')
    }
  
    return (
      <div>
        <h2>Set birthyear</h2>
        <form onSubmit={submit}>
        <div>
          <select value={name} onChange={event => setName(event.target.value)}>
            {props.authors.map(
              author => <option key={author.id} value={author.name}>{author.name}</option>
            )}
          </select>
        </div>
        <div>
          <input
            type='number' 
            value={born}
            onChange={({target}) => setBorn(parseInt(target.value))}
          />
        </div>
        <div>
          <button type='submit'>Update author</button>
        </div>
      </form>
      </div>
    )
  }

export default YearForm