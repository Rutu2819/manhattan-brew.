import express from 'express'
import { supabase } from '../config/supabaseClient.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

// Maximum value of a free-item reward (keep in sync with Order.jsx)
const FREE_ITEM_MAX = 250

// POST /order: create a pending order
router.post('/', requireAuth, async (req, res) => {
  const { items, freeItemName } = req.body

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order has no items' })
  }

  // Subtotal calculated on the server from the item prices
  const subtotal = items.reduce(
    (sum, i) => sum + Number(i.price) * Number(i.qty),
    0
  )
  if (!Number.isFinite(subtotal) || subtotal <= 0) {
    return res.status(400).json({ error: 'Invalid order total' })
  }

  // Read the user's tier discount and reward status from the database
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('discount_percent, pending_reward, reward_redeemed')
    .eq('id', req.user.userId)
    .single()
  if (userError) return res.status(500).json({ error: userError.message })

  // Free item reward (optional)
  let freeAmount = 0
  let freeName = null
  if (freeItemName) {
    const canRedeem =
      user.pending_reward === 'free_item' && user.reward_redeemed === false
    const line = items.find((i) => i.name === freeItemName)
    if (!canRedeem || !line) {
      return res.status(400).json({ error: 'Free item reward is not available' })
    }
    freeAmount = Math.min(Number(line.price), FREE_ITEM_MAX)
    freeName = line.name
  }

  // Permanent tier discount applied to what remains
  const percent = user.discount_percent || 0
  const afterFree = subtotal - freeAmount
  const discountAmount = Math.round(afterFree * percent) / 100
  const finalTotal = afterFree - discountAmount

  const { data, error } = await supabase
    .from('orders')
    .insert({
      user_id: req.user.userId,
      items,
      subtotal,
      free_item_name: freeName,
      free_item_amount: freeAmount,
      discount_percent: percent,
      discount_amount: discountAmount,
      total: finalTotal,
      status: 'pending'
    })
    .select()
    .single()

  if (error) {
    console.error('order insert error:', error.message)
    return res.status(500).json({ error: error.message })
  }
  res.json({ order: data })
})

// POST /order/:id/pay: mock payment confirmation
router.post('/:id/pay', requireAuth, async (req, res) => {
  const { id } = req.params
  const userId = req.user.userId

  // Load the order (must still be pending, so it can't be paid twice)
  const { data: existing, error: findError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .eq('status', 'pending')
    .single()
  if (findError || !existing) {
    return res.status(400).json({ error: 'Order already paid or not found' })
  }

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('stamp_count, tier, discount_percent, pending_reward, reward_redeemed')
    .eq('id', userId)
    .single()
  if (userError) return res.status(500).json({ error: userError.message })

  // If this order used the free item, make sure it is still available
  const usedFreeItem = !!existing.free_item_name
  if (
    usedFreeItem &&
    !(userData.pending_reward === 'free_item' && userData.reward_redeemed === false)
  ) {
    return res.status(409).json({ error: 'Free item reward was already used' })
  }

  // Mark the order as paid
  const { data, error } = await supabase
    .from('orders')
    .update({ status: 'paid' })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()
  if (error) return res.status(500).json({ error: error.message })

  // Start from the current values
  let newStamp_count = userData.stamp_count + 1
  let newTier = userData.tier
  let newDiscount = userData.discount_percent
  let newPendingReward = userData.pending_reward
  let newRewardRedeemed = userData.reward_redeemed

  // Free item used: consume the reward
  if (usedFreeItem) {
    newPendingReward = null
    newRewardRedeemed = true
  }

  // Tier-up logic (runs after, so a newly earned reward replaces the used one)
  if (userData.tier === 'bronze' && newStamp_count >= 6) {
    newTier = 'silver'
    newStamp_count = 0
    newDiscount = 5
    newPendingReward = 'free_item'
    newRewardRedeemed = false
  } else if (userData.tier === 'silver' && newStamp_count >= 8) {
    newTier = 'gold'
    newStamp_count = 0
    newDiscount = 10
    newPendingReward = 'free_item'
    newRewardRedeemed = false
  } else if (userData.tier === 'gold' && newStamp_count >= 10) {
    newStamp_count = 0
    newDiscount = 10
    newPendingReward = 'free_item'
    newRewardRedeemed = false
  }

  const { error: userUpdateError } = await supabase
    .from('users')
    .update({
      tier: newTier,
      stamp_count: newStamp_count,
      discount_percent: newDiscount,
      pending_reward: newPendingReward,
      reward_redeemed: newRewardRedeemed
    })
    .eq('id', userId)
  if (userUpdateError) {
    console.error('user update error:', userUpdateError.message)
    return res.status(500).json({ error: userUpdateError.message })
  }

  res.json({ order: data })
})

export default router