module.exports = {
    currentYear() {
      const today = new Date();
      return today.getFullYear();
    },
    isPreview: process.env.ELEVENTY_ENV === 'preview'
  };