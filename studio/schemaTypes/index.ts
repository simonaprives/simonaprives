//document schemas
import category from './category'
import post from './post'
import author from './author'
import aboutPage from './aboutPage'
import siteSettings from './siteSettings'
import biolinks from './biolinks'
import cv from './cv'
import artworkExhibits from './artworkExhibits'
import artworksOnPaper from './artworksOnPaper'
import artworksInMotion from './artworksInMotion'
import homePage from './homePage'

//object schemas
import blockContent from './objects/blockContent'
import link from './objects/link'
import mainImage from './objects/mainImage'
import exhibition from './objects/exhibition'
import residency from './objects/residency'
import teaching from './objects/teaching'
import education from './objects/education'
import artworkExhibit from './objects/artworkExhibit'
import artworkOnPaper from './objects/artworkOnPaper'
import artworkInMotionItem from './objects/artworkInMotionItem'


export const schemaTypes = [
    siteSettings, 
    post, 
    aboutPage, 
    biolinks,
    author, 
    category,
    cv,
    artworkExhibits,
    artworksOnPaper,
    artworksInMotion,
    homePage,
    
    //objects
    blockContent,
    mainImage,
    link,
    exhibition,
    residency,
    teaching,
    education,
    artworkExhibit,
    artworkOnPaper,
    artworkInMotionItem,
]
