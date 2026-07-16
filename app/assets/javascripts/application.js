//
// For guidance on how to add JavaScript see:
// https://prototype-kit.service.gov.uk/docs/adding-css-javascript-and-images
//

window.GOVUKPrototypeKit.documentReady(() => {
  if (window.DfeFrontend && typeof window.DfeFrontend.initAll === 'function') {
    window.DfeFrontend.initAll()
  }
})
