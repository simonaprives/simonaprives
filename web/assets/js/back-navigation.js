// Smart back navigation based on referrer
document.addEventListener('DOMContentLoaded', () => {
  const backLink = document.querySelector('.back-link')
  if (!backLink) return

  const referrer = document.referrer
  
  if (referrer.includes('/cv/')) {
    backLink.href = '/cv/'
    backLink.textContent = '← CV'
  }
})
