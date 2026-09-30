import express from 'express'
import { requireAuth } from '../middleware/auth.js'
import { supabase } from '../config/supabaseClient.js'

const router = express.Router()



router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    res.json({ success: true, notifications })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong fetching notifications' });
  }
})
router.patch('/:id/read', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.userId
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error

    res.json({ success: true, message: 'Notification marked as read' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong updating notification' })
  }
})









export default router