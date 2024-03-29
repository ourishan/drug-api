const express = require('express')
const app = express()
const db = require('./db.json')

app.use(express.json())

app.get('/api/get-drug-classes', (req, res) => {
    res.json({ data: db.medications })
})

app.get('/api/get-single-drug-class/:drugClass', (req, res) => {
    res.json({ data: db.medications[0][req.params.drugClass] })
})

app.post('/api/add-drug-class', (req, res) => {
    let flag = false
    if (!db.medications[0].hasOwnProperty(req.body.drugClass)) {
        db.medications[0][req.body.drugClass] = []
        flag = true
    }
    res.json({ success: flag })
})

app.post('/api/delete-drug-class', (req, res) => {
    let flag = false
    if (db.medications[0].hasOwnProperty(req.body.drugClass)) {
        delete db.medications[0][req.body.drugClass]
        flag = true
    }
    res.json({ success: flag })
})

app.get('/api/get-single-medicine/:medicineName', (req, res) => {
    res.json({
        data: Object.values(db.medications[0])
            .find(drug =>
                drug.find(med =>
                    med.name === req.params.medicineName
                )
            )[0]
    })
})

app.post('/api/add-single-medicine', (req, res) => {
    try {
        db.medications[0][req.body.drugClassName].push(req.body.data)
        res.json({ data: { success: true } })
    } catch (error) {
        res.json({ data: { success: false } })
    }
})

app.post('/api/update-single-medicine', (req, res) => {
    let flag = false
    Object.values(db.medications[0])
        .forEach(drug =>
            drug.forEach((med, i, a) => {
                if (med.name === req.body.medicineName) {
                    for ([key, value] of Object.entries(req.body.data)) {
                        if (!med[key] || med[key] !== value) {
                            med[key] = value
                            flag = true
                        }
                    }
                }
            })
        )
    res.json({ data: { success: flag } })
})

app.post('/api/delete-single-medicine', (req, res) => {
    let flag = false
    Object.values(db.medications[0])
        .forEach(drug =>
            drug.forEach((med, i, a) => {
                if (med.name === req.body.medicineName) {
                    a.splice(i, 1)
                    flag = true
                }
            })
        )

    res.json({
        data: {
            success:
                Object.values(db.medications[0])
                    .every(drug =>
                        drug.every((med, i, a) =>
                            med.name !== req.body.medicineName
                        )
                    ) && flag
                    ? true : false
        }
    })
})

const listener = app.listen(8080, _ => console.log(`server running on ${listener.address().port}`))