import React from 'react'
import markdownit from 'markdown-it'
import DOMPurify from 'dompurify'
import styles from './Markdown.module.css';
import { useState,useEffect } from 'react';

type props = {
    text  : string;
}

const md = markdownit()

const Markdown = ({ text } : props) => {
  const [sanetizedHtml,setSanatizedHtml] = useState<string>('')

  useEffect(() => {

      if(typeof window !== 'undefined'){
        const htmlcontext =  md.render(text)
        const sanetized =  DOMPurify.sanitize(htmlcontext)
        setSanatizedHtml(sanetized)
      }

  },[text])


  return (
    <div className={styles['markdown-content']}  dangerouslySetInnerHTML={{ __html : sanetizedHtml }}></div>
  )
}

export default Markdown


