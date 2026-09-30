import { supabase } from '../config/supabaseClient.js'
import { combos, moods, budgetRanges } from '../../src/Data/ComboData.js'
import dotenv from 'dotenv'
dotenv.config()
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
async function askGroqForCombo(mood, budget) {
  const eligible = combos.filter(c => c.price >= budget.min && c.price <= budget.max)
  const comboList = eligible.map(c =>
    `- slug: ${c.slug}, name: ${c.name}, price: ₹${c.price}, tags: [${c.tags.join(', ')}], tagline: "${c.tagline}"`
  ).join('\n')

  const prompt = `
You are a café recommendation assistant for "Manhattan Brew".
Here is the full list of available combos:
${comboList}

A customer is feeling: "${mood.label}" (associated vibes: ${mood.matchTags.join(', ')})
Their budget range is: "${budget.label}" (minimum ₹${budget.min}, maximum ₹${budget.max === Infinity ? 'no limit' : budget.max})

Pick the ONE combo (by its exact slug) that best fits BOTH their mood and their budget.
Respond ONLY in this exact JSON format, with no other text, no markdown fences:
{"slug": "the-chosen-slug", "reason": "a short, friendly one-sentence explanation"}
`.trim()

 const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }]
      })
    })

    const data = await res.json()
    console.log('RAW GROQ RESPONSE:', JSON.stringify(data, null, 2))
    const rawText = data.choices?.[0]?.message?.content?.trim()

  if (!rawText) {
    throw new Error(`No response text for mood=${mood.key}, budget=${budget.label}`)
  }

  const cleaned = rawText.replace(/```json|```/g, '').trim()
  return JSON.parse(cleaned)
}

async function generateAll() {
  for (const mood of moods) {
    for (const budget of budgetRanges) {
      try {
        const { data: existing } = await supabase
    .from('combo_suggestions')
    .select('*')
    .eq('mood_key', mood.key)
    .eq('budget_label', budget.label)
    .maybeSingle()

  if (existing) {
    console.log(`⏭️ Skipping mood=${mood.key}, budget=${budget.label} (already saved)`)
    continue
      }

        const { slug, reason } = await askGroqForCombo(mood, budget)
      

        const matchedCombo = combos.find(c => c.slug === slug)
        if (!matchedCombo) {
          console.error(`❌ AI returned unknown slug "${slug}" for mood=${mood.key}, budget=${budget.label}`)
          continue
        }
        if (matchedCombo.price < budget.min || matchedCombo.price > budget.max) {
          console.error(`❌ AI picked "${slug}" but price ₹${matchedCombo.price} is outside ${budget.label}`)
          continue
        }

        const { error } = await supabase
          .from('combo_suggestions')
          .upsert({
            mood_key: mood.key,
            budget_label: budget.label,
            combo_slug: slug,
            reason
          }, { onConflict: 'mood_key,budget_label' })

        if (error) {
          console.error(`❌ Supabase insert failed for mood=${mood.key}, budget=${budget.label}:`, error.message)
        } else {
          console.log(`✅ Saved: mood=${mood.key}, budget=${budget.label} → ${slug}`)
        }
      } catch (err) {
        console.error(`❌ Error for mood=${mood.key}, budget=${budget.label}:`, err.message)
        
      }
      await sleep(5000)
    }
  }
  console.log('Done generating combo suggestions.')
}

generateAll()