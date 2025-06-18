// Shopify shop param persistence logic (multi-app safe)
function getQueryParam(name) {
  const url = new URL(window.location.href)
  return url.searchParams.get(name)
}

function setQueryParam(name, value) {
  const url = new URL(window.location.href)
  url.searchParams.set(name, value)
  window.location.replace(url.toString())
}

// Use a namespaced key for shop param, based on the app's API key
const meta = document.querySelector('meta[name="shopify-api-key"]')
const apiKey = meta && 'content' in meta ? meta.content : 'default-app'
const shopKey = `shopify-shop-${apiKey}`

const shopParam = getQueryParam('shop')
if (shopParam) {
  localStorage.setItem(shopKey, shopParam)
} else {
  const storedShop = localStorage.getItem(shopKey)
  if (storedShop) {
    setQueryParam('shop', storedShop)
    // The page will reload with the shop param, so stop further execution
    throw new Error('Reloading with shop param')
  }
}
