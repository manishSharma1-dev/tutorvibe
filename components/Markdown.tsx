import React from 'react'
import markdownit from 'markdown-it'
type props = {
    text  : string ;
}

const md = markdownit()

const Markdown = ({ text } : props) => {

    const htmlcontext = md.render(text)
    
  return (
    <div dangerouslySetInnerHTML={{ __html : htmlcontext }}></div>
  )
}

export default Markdown


