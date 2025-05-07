import { GraphqlQueryError } from '@shopify/shopify-api'
import { Session } from '@shopify/shopify-api'
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
] as const

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
] as const

interface ShopifyGraphQLResponse<T> {
  body: {
    data: T
  }
}

interface ProductCreateData {
  productCreate: {
    product: {
      id: string
      title: string
    }
    userErrors: Array<{
      field: string[]
      message: string
    }>
  }
}

interface ProductVariantBulkCreateData {
  productVariantsBulkCreate: {
    productVariants: Array<{
      id: string
      title: string
    }>
    userErrors: Array<{
      field: string[]
      message: string
    }>
  }
}

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

export default async function productCreator(
  session: Session,
  count = DEFAULT_PRODUCTS_COUNT
): Promise<void> {
  const client = new shopify.api.clients.Graphql({ session })

  try {
    for (let i = 0; i < count; i++) {
      const productResponse = await client.request<ShopifyGraphQLResponse<ProductCreateData>>(
        CREATE_PRODUCT_MUTATION,
        {
          variables: {
            input: {
              title: `${randomTitle()}`
              // include other necessary fields here
            }
          }
        }
      )

      if (productResponse.data?.body.data.productCreate.userErrors.length === 0) {
        const productId = productResponse.data.body.data.productCreate.product.id

        await client.request<ShopifyGraphQLResponse<ProductVariantBulkCreateData>>(
          CREATE_VARIANT_MUTATION,
          {
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
          }
        )
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

function randomTitle(): string {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)]
  return `${adjective} ${noun}`
}

function randomPrice(): number {
  return Math.round((Math.random() * 10 + Number.EPSILON) * 100) / 100
}
