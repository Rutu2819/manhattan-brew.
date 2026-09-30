import express from 'express'
import { supabase } from '../config/supabaseClient.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

const TIER_THRESHOLDS = {
  bronze: 6,
  silver: 8,
  gold: 10,
}

// GET /rewards — fetch current user's reward status
router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('name, stamp_count, tier, discount_percent, pending_reward, reward_redeemed')
    .eq('id', req.user.userId)
    .single()

  if (error) return res.status(500).json({ error: error.message })

  const threshold = TIER_THRESHOLDS[data.tier] || TIER_THRESHOLDS.bronze

  res.json({
    name: data.name,
    tier: data.tier,
    stampCount: data.stamp_count,
    stampThreshold: threshold,
    discountPercent: data.discount_percent,
    pendingReward: data.pending_reward,
    rewardRedeemed: data.reward_redeemed,
  })
})

export default router