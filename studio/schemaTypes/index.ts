//document schemas
import category from './category'
import post from './post'
import author from './author'
import aboutPage from './aboutPage'
import siteSettings from './siteSettings'
import biolinks from './biolinks'

//object schemas
import blockContent from './blockContent'
import link from './link'

export const schemaTypes = [
    siteSettings, 
    post, 
    aboutPage, 
    biolinks,
    author, 
    category, 
    
    //objects
    blockContent,
    link
]
