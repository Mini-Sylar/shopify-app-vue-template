import { GraphqlQueryError } from '@shopify/shopify-api'
import shopify from '../../shopify.js'

const ADJECTIVES = [
  'autumn',
  'hidden',
  'bitter',
  'misty',
  'silent',
  'empty',
  'dry',
  'dark',
  'summer',
  'icy',
  'delicate',
  'quiet',
  'white',
  'cool',
  'spring',
  'winter',
  'patient',
  'twilight',
  'dawn',
  'crimson',
  'wispy',
  'weathered',
  'blue',
  'billowing',
  'broken',
  'cold',
  'damp',
  'falling',
  'frosty',
  'green',
  'long'
]

const NOUNS = [
  'waterfall',
  'river',
  'breeze',
  'moon',
  'rain',
  'wind',
  'sea',
  'morning',
  'snow',
  'lake',
  'sunset',
  'pine',
  'shadow',
  'leaf',
  'dawn',
  'glitter',
  'forest',
  'hill',
  'cloud',
  'meadow',
  'sun',
  'glade',
  'bird',
  'brook',
  'butterfly',
  'bush',
  'dew',
  'dust',
  'field',
  'fire',
  'flower'
]

const DEFAULT_PRODUCTS_COUNT = 5
const CREATE_PRODUCT_MUTATION = `
  mutation CreateProduct($input: ProductInput!) {
    productCreate(input: $input) {
      product {
        id
        title
      }
      userErrors {
        field
        message
      }
    }
  }
`

const CREATE_VARIANT_MUTATION = `
  mutation ProductVariantsCreate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
    productVariantsBulkCreate(productId: $productId, variants: $variants) {
      productVariants {
        id
        title
      }
      userErrors {
        field
        message
      }
    }
  }
`

export default async function productCreator(session, count = DEFAULT_PRODUCTS_COUNT) {
  const client = new shopify.api.clients.Graphql({ session })

  try {
    for (let i = 0; i < count; i++) {
      const productResponse = await client.request(CREATE_PRODUCT_MUTATION, {
        variables: {
          input: {
            title: `${randomTitle()}`
            // include other necessary fields here
          }
        }
      })
      if (productResponse.data.productCreate.userErrors.length === 0) {
        const productId = productResponse.data.productCreate.product.id

        await client.request(CREATE_VARIANT_MUTATION, {
          variables: {
            productId: productId,
            variants: [
              {
                price: randomPrice(),
                compareAtPrice: randomPrice() + 5
                // include other necessary fields here
              }
            ]
          }
        })
      }
    }
  } catch (error) {
    if (error instanceof GraphqlQueryError) {
      throw new Error(`${error.message}\n${JSON.stringify(error.response, null, 2)}`)
    } else {
      throw error
    }
  }
}

function randomTitle() {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)]
  return `${adjective} ${noun}`
}

function randomPrice() {
  return Math.round((Math.random() * 10 + Number.EPSILON) * 100) / 100
}
