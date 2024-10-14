import React from 'react'
import markdownit from 'markdown-it'
// import DOMPurify from 'dompurify'
type props = {
    text  : string ;
}

const md = markdownit()

const Markdown = ({ text } : props) => {

    const htmlcontext = md.render(text)
    // const sanetizedHtml = DOMPurify.sanitize(htmlcontext);

  return (
    <div dangerouslySetInnerHTML={{ __html : htmlcontext }}></div>
  )
}

export default Markdown


