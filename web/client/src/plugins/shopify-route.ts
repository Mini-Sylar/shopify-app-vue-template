// Shopify shop param persistence logic (multi-app safe)
function getQueryParam(name: string): string | null {
  const url = new URL(window.location.href)
  return url.searchParams.get(name)
}

function setQueryParam(name: string, value: string): void {
  const url = new URL(window.location.href)
  url.searchParams.set(name, value)
  window.location.replace(url.toString())
}

// Use a namespaced key for shop param, based on the app's API key
function getApiKey(): string {
  const meta = document.querySelector('meta[name="shopify-api-key"]') as HTMLMetaElement | null
  return meta?.content || 'default-app'
}
const apiKey = getApiKey()
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
