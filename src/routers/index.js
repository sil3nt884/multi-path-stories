const express = require('express')
const router = express.Router()

let storyMappings = {}
let lastStoryChoice
let tempStory = {}
let reviewStoryMode = false
let phase = 0
let reviewPhase = 0
let storyPhase = {}

const resetStoryChoice = () => {
  tempStory = {}
  storyMappings = {}
}

const assignPhaseStoryMapping = (key, storyMapping, lastStoryChoice) => {
  storyPhase[`${key}:${phase}`] = { last: lastStoryChoice, ...storyMapping }
}

const getGroupedStoryPhase = (phase) => {
  return Object.keys(storyPhase)
    .filter(key => parseInt(key.split(':')[1]) === phase)
    .map(keys => storyPhase[`${keys.split(':')[0]}:${keys.split(':')[1]}`])
    .reduce((acc, current) => Object.assign(acc, current))
}

router.get('/', (req, res) => {
  res.render('index', { last: lastStoryChoice, ...storyMappings })
})

router.post('/addSentence', (req, res) => {
  const key = Object.keys(req.body)[0]
  storyMappings[key] = `<a href='/capture?${key}'>${Object.values(req.body)
    .filter(body => !body.includes('<script>'))[0] || '#'}</a>`
  assignPhaseStoryMapping(key, storyMappings, lastStoryChoice)
  tempStory = { ...storyMappings }
  res.render('index', { last: lastStoryChoice, ...tempStory })
})

router.get('/reset', (req, res) => {
  reviewStoryMode = true
  reviewPhase = 0
  const storyInFull = getGroupedStoryPhase(reviewPhase)
  res.render('index', { ...storyInFull })
})

router.get('/capture', (req, res) => {
  const key = Object.keys(req.query)[0]
  if (!reviewStoryMode) {
    lastStoryChoice = storyMappings[key].match(/>(.*?)</)[1]
    resetStoryChoice()
    phase = phase + 1
    res.render('index', { last: lastStoryChoice })
  } else if (reviewStoryMode) {
    const story = getGroupedStoryPhase(reviewPhase)
    res.render('index', story)
    reviewPhase = +reviewPhase + 1
  }
})

module.exports = router
