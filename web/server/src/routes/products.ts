import express from 'express'
import shopify from '../shopify.js'
import productCreator from '../services/shopify/product-creator.js'
import { GraphqlQueryError } from '@shopify/shopify-api'

const router = express.Router()

router.get('/count', async (_req, res) => {
  const session = res.locals.shopify.session
  const client = new shopify.api.clients.Graphql({ session })
  try {
    const countData = await client.request(`query{productsCount{count}}`, {
      retries: 2
    })
    res.status(200).send(countData.data)
  } catch (error) {
    if (error instanceof GraphqlQueryError) {
      console.error(`${error.message}\n${JSON.stringify(error.response, null, 2)}`)
    }
    res.status(500).send({ error: 'Failed to fetch product count' })
  }
})

router.get('/create', async (_req, res) => {
  let status = 200
  let error = null

  try {
    await productCreator(res.locals.shopify.session)
  } catch (e) {
    if (e instanceof GraphqlQueryError) {
      console.error(`${e.message}\n${JSON.stringify(e.response, null, 2)}`)
      error = e.message
      status = 500
    }
    if (e instanceof Error) {
      console.error(e.message)
      error = e.message
      status = 500
    } else {
      console.error('Unknown error:', e)
      error = 'Unknown error'
      status = 500
    }
  }
  res.status(status).send({ success: status === 200, error })
})

export default router
