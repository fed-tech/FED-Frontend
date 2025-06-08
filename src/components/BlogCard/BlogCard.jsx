import React from 'react';
import styles from './styles/BlogCard.module.scss';
import { FaExternalLinkAlt } from 'react-icons/fa';

function BlogCard(props) {
  const { data, customButtons } = props;
  console.log('Blog card received data:', data);
 
  let processedData = data;
 
  if (typeof data === 'string') {
    try {
      processedData = JSON.parse(data);
      console.log('Successfully parsed string data in BlogCard:', processedData);
    } catch (err) {
      console.error('Error parsing blog data in card:', err, 'Raw data:', data);
      processedData = {};
    }
  } else if (!data) {
    console.error('BlogCard received null or undefined data');
    processedData = {};
  }
  
  console.log('BlogCard using processed data:', processedData);
 
  const truncateText = (text, limit) => {
    if (!text) return '';
    const textWithoutTags = text.replace(/<[^>]*>/g, '');
    return textWithoutTags.length > limit ? textWithoutTags.substring(0, limit) + "..." : textWithoutTags;
  };
 
  const id = processedData.id || processedData._id;
  const title = processedData.title || processedData.blogTitle || 'Untitled Blog';
  const desc = processedData.desc || processedData.blogContent || processedData.blogSubtitle || '';
  const image = processedData.image || processedData.blogImage || 'https://via.placeholder.com/100';
  const date = processedData.date || processedData.blogDate || new Date().toISOString();
  const author = processedData.author || processedData.blogAuthor || {name: "Unknown", department: "N/A"};
  const authorDepartment = processedData.authorDepartment || processedData.department || '';
  const likes = processedData.likes || 0;
  const comments = processedData.comments || [];
  const summary = processedData.summary || processedData.metaDescription || truncateText(desc, 100);
  const blogLink = processedData.blogLink || processedData.mediumLink || 'https://medium.com/@fedkiit';
  
  console.log('Raw author data:', author);
  
  // parse author information safely
  let parsedAuthor = { name: "Unknown", department: "N/A" };
  
  try {
    if (typeof author === 'string') {
      if (author.startsWith('{') && author.endsWith('}')) {
        try {
          parsedAuthor = JSON.parse(author);
        } catch (err) {
          console.error('Error parsing author JSON:', err, author);
          if (!author.includes('"name"') && !author.includes(':')) {
            parsedAuthor = { name: author, department: "" };
          }
        }
      } else {
        parsedAuthor = { name: author, department: "" };
      }
    } else if (typeof author === 'object' && author !== null) {
      parsedAuthor = author;
      
      if (!parsedAuthor.department && parsedAuthor.dept) {
        parsedAuthor.department = parsedAuthor.dept;
      } else if (!parsedAuthor.department) {
        parsedAuthor.department = "";
      }
    }
    
    // If there's no department info but we have additional blog data, try to find it
    if ((!parsedAuthor.department || parsedAuthor.department === "N/A") && processedData.authorDepartment) {
      parsedAuthor.department = processedData.authorDepartment;
    }
    
    // Further attempt to extract department from various potential fields
    if ((!parsedAuthor.department || parsedAuthor.department === "N/A") && processedData.authorDetails) {
      const authorDetails = typeof processedData.authorDetails === 'string' 
        ? JSON.parse(processedData.authorDetails) 
        : processedData.authorDetails;
        
      if (authorDetails && authorDetails.department) {
        parsedAuthor.department = authorDetails.department;
      } else if (authorDetails && authorDetails.dept) {
        parsedAuthor.department = authorDetails.dept;
      }
    }
  } catch (err) {
    console.error('Error handling author data:', err);
  }
  
  console.log('Parsed author data:', parsedAuthor);
  
  const handleBlogClick = () => {
    window.open(blogLink, '_blank');
  };
  
  const truncatedSummary = truncateText(summary, 100);
  
  return (
    <div className={styles.card}>
      <div className={styles.link}>
        <div className={styles.imageSection}>
          <img src={image || "https://via.placeholder.com/100"} alt={title} />
        </div>
        <div className={styles.contentSection}>
          <div className={styles.topSection}>
            <h1 className={styles.heading}>{title} <FaExternalLinkAlt size={12} /></h1>
            {truncatedSummary && (
              <div className={styles.summary}>
                <p>{truncatedSummary}</p>
              </div>
            )}
          </div>
          
          <div className={styles.bottomSection}>
            <div className={styles.authorInfo}>
             
              <p className={styles.authorName}>By {parsedAuthor.name || 'Unknown'} 
                {(parsedAuthor.department && parsedAuthor.department !== 'N/A') ? 
                  `(${parsedAuthor.department})` : 
                  (authorDepartment ? `(${authorDepartment})` : '')}
              </p>
              <p className={styles.date}>{new Date(date).toDateString()}</p>
            </div>
            
            <div className={styles.buttonContainer}>
              <button className={styles.readButton} onClick={(e) => {
                e.stopPropagation();
                handleBlogClick();
              }}>
                Read
              </button>
              {customButtons && (
                <div className={styles.customButtonsWrapper}>
                  {customButtons}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;