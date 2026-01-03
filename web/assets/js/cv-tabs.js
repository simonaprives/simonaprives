// CV Tabs functionality
document.addEventListener('DOMContentLoaded', () => {
  const tabButtons = document.querySelectorAll('.cv-tabs__tab')
  const tabPanels = document.querySelectorAll('.cv-tabs__panel')

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetPanel = button.getAttribute('aria-controls')

      // Update button states
      tabButtons.forEach(btn => {
        btn.setAttribute('aria-selected', 'false')
      })
      button.setAttribute('aria-selected', 'true')

      // Update panel visibility
      tabPanels.forEach(panel => {
        panel.hidden = true
      })
      document.getElementById(targetPanel).hidden = false
    })
  })
})
