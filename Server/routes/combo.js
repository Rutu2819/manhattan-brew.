import express from 'express'
import { supabase } from '../config/supabaseClient.js'
import { combos } from '../../src/Data/comboData.js'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post('/suggest', async (req, res) => {

    console.log('DEBUG: /suggest route hit, authorization header is:', req.headers.authorization)
    const { mood_key, budget_label } = req.body

    if (!mood_key || !budget_label) {
        return res.status(400).json({ error: 'mood_key and budget_label are required' })
    }

    try {
        const { data: suggestion, error: suggestionError } = await supabase
            .from('combo_suggestions')
            .select('*')
            .eq('mood_key', mood_key)
            .eq('budget_label', budget_label)
            .single()

        if (suggestionError || !suggestion) {
            return res.status(404).json({ error: 'No cached suggestion found for this mood and budget' })
        }

        const fullCombo = combos.find(c => c.slug === suggestion.combo_slug)

        if (!fullCombo) {
            return res.status(500).json({ error: 'Cached combo slug no longer exists in comboData' })
        }

        let userId = null
        const authHeader = req.headers.authorization

        if (authHeader?.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1]
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET)
                userId = decoded.userId
            } catch (jwtErr) {
                console.error('JWT verify failed in combo.js:', jwtErr.message)
            }
        }

        if (userId) {
            console.log('DEBUG: userId is', userId, '- attempting notification insert')
            supabase
                .from('user_combo_history')
                .insert({
                    user_id: userId,
                    mood_key,
                    budget_label,
                    combo_slug: suggestion.combo_slug
                })
                .then(({ error }) => {
                    if (error) console.error('Failed to log combo history:', error)
                })

            supabase
                .from('notifications')
                .insert({
                    user_id: userId,
                    title: 'New combo suggestion!',
                    message: `We found a "${fullCombo.name}" combo for your mood and budget.`,
                    type: 'combo',
                    is_read: false
                })
                .then(({ error }) => {
                    if (error) console.error('Failed to create notification:', error)
                })
        }
        res.json({
            combo: fullCombo,
            reason: suggestion.reason
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to get combo suggestion' })
    }
})

export default router
