//document schemas
import category from './category'
import post from './post'
import author from './author'
import aboutPage from './aboutPage'
import siteSettings from './siteSettings'
import biolinks from './biolinks'

//object schemas
import blockContent from './objects/blockContent'
import link from './objects/link'
import mainImage from './objects/mainImage'

export const schemaTypes = [
    siteSettings, 
    post, 
    aboutPage, 
    biolinks,
    author, 
    category, 
    
    //objects
    blockContent,
    mainImage,
    link
]
