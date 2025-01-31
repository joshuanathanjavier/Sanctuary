import React, { useState } from 'react';

interface SeeMoreParagraphProps {
  text: string;
  maxlength: number;
}

const SeeMoreParagraph: React.FC<SeeMoreParagraphProps> = ({ text, maxlength }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className='text-center md:text-left'>
      <p>
        {isExpanded ? text : `${text.substring(0, maxlength)}...`}
      </p>
      <button onClick={toggleExpand} color='primary' className='text-blue-500'>
        {isExpanded ? 'See Less' : 'See More'}
      </button>
    </div>
  );
};

export default SeeMoreParagraph;