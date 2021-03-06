const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')

const app = express()

app.use(bodyParser.json())

app.post('/events', async (req, res) => {
  const { type, data } = req.body;
  console.log('moderation hit')
  if(type === 'CommentCreated') {
    const status = data.content.includes('orange') ? 'rejected' : 'approved'
  try {
    await axios.post('http://events-services:4005/events', {
      type: 'CommentModerated',
      data: {
        id: data.id,
        postId: data.postId,
        status,
        content: data.content,
      },
    });
  } catch(e) {
    console.log(`Moderation error`, e.message)
  }
  }
  res.send({})
})

app.listen(4003, () => {
  console.log('moderation listening on 4003')
})