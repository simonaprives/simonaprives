// Smart back navigation based on referrer
document.addEventListener('DOMContentLoaded', () => {
  const backLink = document.querySelector('.back-link')
  if (!backLink) return

  const referrer = document.referrer
  
  if (referrer.includes('/cv/')) {
    backLink.href = '/cv/'
    backLink.textContent = '← CV'
  } else if (referrer.includes('/exhibits/')) {
    // Check if it's a specific exhibit page (not just the index)
    const match = referrer.match(/\/exhibits\/([^\/]+)/)
    if (match && match[1] && match[1] !== 'index.html') {
      // Link back to the specific exhibit
      backLink.href = `/exhibits/${match[1]}/`
      backLink.textContent = '← Exhibit'
    } else {
      // Link back to exhibits index
      backLink.href = '/exhibits/'
      backLink.textContent = '← Exhibits'
    }
  }
})
