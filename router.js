const express = require('express')
const axios = require('axios')
const prisma = require('./lib/prisma')
const cron = require('node-cron')
require('dotenv').config()


const router = express.Router()


cron.schedule('0 */23 * * *', async () => {
    const tokens = await prisma.tokens.findUnique({
        where: {
            id: 1
        }
    })
    const postData =
    {
        "client_id": process.env.CLIENT_ID,
        "client_secret": process.env.CLIENT_SECRETE,
        "grant_type": "refresh_token",
        "refresh_token": tokens.refresh_token,
        "redirect_uri": process.env.REDIRECT_URI
    }

    try {
        await axios.post('https://tgbb.amocrm.com/oauth2/access_token', postData, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(async (response) => {
            token = response.data.access_token
            await prisma.tokens.update({
                where: {
                    id: 1
                },
                data: {
                    refresh_token: response.data.refresh_token,
                    access_token: response.data.access_token
                }
            })
        })
    } catch (err) {
    console.log(err)
    }
})


router.get('/api/leads', async (req, res) => {
    const tokens = await prisma.tokens.findUnique({
        where: {
            id: 1
        }
    })
    try {
        await axios.get('https://tgbb.amocrm.com/api/v4/contacts', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokens.access_token}`
            }
        }).then(response => {
            res.json(response.data)
        })
    } catch (err) {
        res.json(err)
    }
})


module.exports = router
